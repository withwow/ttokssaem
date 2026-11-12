const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// MysqlConn은 xml 경로를 cwd 기준으로 읽으므로 앱 루트에서 로드한다.
process.chdir(path.join(__dirname, '..'));

const logs = [];
global._logger = {
  debug() {},
  info(msg) { logs.push(['info', msg]); },
  warn(msg) { logs.push(['warn', msg]); },
  error(msg) { logs.push(['error', msg]); },
};

const MysqlConn = require('../common/MysqlConn.js');
const SvcSchedule = require('../services/SvcSchedule');
const SvcNotice = require('../services/SvcNotice');

const originalGetConnection = MysqlConn.pool.getConnection;
test.after(() => {
  MysqlConn.pool.getConnection = originalGetConnection;
  return MysqlConn.pool.end();
});

function fakeConnection(handler) {
  const calls = [];
  const conn = {
    calls,
    released: false,
    async beginTransaction() { calls.push('BEGIN'); },
    async commit() { calls.push('COMMIT'); },
    async rollback() { calls.push('ROLLBACK'); },
    release() { conn.released = true; },
    async query(sql) {
      calls.push(sql);
      return handler(sql);
    },
  };
  return conn;
}

test('initialization returns counts and commits on success', async () => {
  const conn = fakeConnection((sql) => {
    if (/DELETE FROM/.test(sql)) return [{ affectedRows: 1554 }];
    if (/INSERT INTO/.test(sql)) return [{ affectedRows: 1550 }];
    if (/COUNT\(\*\)/.test(sql)) return [[{ cnt: 1550 }]];
    throw new Error('unexpected sql ' + sql);
  });
  MysqlConn.pool.getConnection = async () => conn;

  const result = await new SvcSchedule('', '', '', '', '').initialization(3);

  assert.deepEqual(result, { dayofweek: 3, ok: true, deleted: 1554, inserted: 1550, master: 1550, error: '' });
  assert.equal(conn.calls[0], 'BEGIN');
  assert.match(conn.calls[1], /dayofweek = 3/);
  assert.equal(conn.calls.at(-1), 'COMMIT');
  assert.ok(!conn.calls.includes('ROLLBACK'));
  assert.ok(conn.released);
});

test('initialization rolls back and reports the original error when a query fails', async () => {
  const conn = fakeConnection((sql) => {
    if (/DELETE FROM/.test(sql)) return [{ affectedRows: 10 }];
    throw new Error('ER_LOCK_WAIT_TIMEOUT');
  });
  MysqlConn.pool.getConnection = async () => conn;

  const result = await new SvcSchedule('', '', '', '', '').initialization(4);

  assert.equal(result.ok, false);
  assert.equal(result.error, 'ER_LOCK_WAIT_TIMEOUT');
  assert.ok(conn.calls.includes('ROLLBACK'));
  assert.ok(!conn.calls.includes('COMMIT'));
  assert.ok(conn.released);
});

test('initialization reports a connection failure instead of throwing a TypeError', async () => {
  MysqlConn.pool.getConnection = async () => { throw new Error('connect ETIMEDOUT'); };

  const result = await new SvcSchedule('', '', '', '', '').initialization(0);

  assert.equal(result.ok, false);
  assert.equal(result.error, 'connect ETIMEDOUT');
});

test('scheduleInitToOperator queues a push for each configured member with a token', async () => {
  process.env.SCHEDULE_ALERT_MEMBERIDS = 'withwow, nobody';
  const conn = fakeConnection((sql) => {
    if (/pushtoken/.test(sql) && /'withwow'/.test(sql)) return [[{ os: 'ios', pushtoken: 'TOKEN' }]];
    if (/pushtoken/.test(sql) && /SELECT/.test(sql)) return [[]];
    if (/INSERT INTO\s+ttokssaemdb.pushsendmsg/.test(sql)) return [{ affectedRows: 1 }];
    throw new Error('unexpected sql ' + sql);
  });
  MysqlConn.pool.getConnection = async () => conn;

  const sent = await new SvcNotice().scheduleInitToOperator({
    dayofweek: 3, schdate: '20261111', ok: false, deleted: 0, inserted: 0, master: 0, error: 'ER_LOCK_WAIT_TIMEOUT',
  });

  assert.equal(sent, 1, JSON.stringify(logs.slice(-3)));
  const insert = conn.calls.find((sql) => /INSERT INTO\s+ttokssaemdb.pushsendmsg/.test(sql));
  assert.match(insert, /스케줄 초기화 실패/);
  assert.match(insert, /20261111 수요일 실행플랜 복구 실패/);
  assert.match(insert, /'TOKEN'/);
  assert.match(insert, /'I'/);
  assert.ok(conn.released);
});

test('scheduleInitToOperator skips when no recipient is configured', async () => {
  delete process.env.SCHEDULE_ALERT_MEMBERIDS;
  MysqlConn.pool.getConnection = async () => { throw new Error('must not connect'); };

  const sent = await new SvcNotice().scheduleInitToOperator({ dayofweek: 3, ok: true });

  assert.equal(sent, 0);
});

test('success message includes counts and flags a master/copy mismatch', () => {
  assert.equal(
    SvcNotice.makeScheduleInitMessage({ dayofweek: 3, schdate: '20261111', ok: true, deleted: 1554, inserted: 1554, master: 1554 }),
    '20261111 수요일 실행플랜 복구 완료 (삭제 1554건, 복사 1554건)',
  );
  assert.match(
    SvcNotice.makeScheduleInitMessage({ dayofweek: 0, ok: true, deleted: 5, inserted: 4, master: 5 }),
    /일요일 .*마스터 5건과 복사 건수가 다릅니다/,
  );
});
