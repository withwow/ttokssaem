'use strict';
/*
  API 성능 개선(3단계): 개발 전(dev)과 개발 후(이 브랜치) 쿼리 결과 비교 (읽기 전용)

  사용법 (저장소 루트에서, 작업 트리는 바꾸지 않음):
    git fetch origin dev claude/project-thread-hg3o79
    NODE_PATH=<mysql2, mybatis-mapper@0.6.5가 설치된 node_modules> \
      node <이 파일> <저장소 루트> [보고서 경로.md]

  - DB 접속 정보는 ttokssaem_nodejs_api/.env (없으면 ttokssaem_nodejs_admin/.env)의 MYSQL_* 값을 읽고, 출력하지 않는다.
  - XML 매퍼는 git show 로 두 버전을 읽어 각각 SQL을 만든다. OLD_REF, NEW_REF 환경변수로 바꿀 수 있다.
  - SELECT, EXPLAIN 이외의 문장은 실행하지 않는다. UPDATE 문은 만들기만 하고 비교한다.
*/
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const mapper = require('mybatis-mapper');

const REPO = path.resolve(process.argv[2] || '.');
const OUT = path.resolve(process.argv[3] || 'compare-step3-report.md');
const OLD_REF = process.env.OLD_REF || 'origin/dev';
const NEW_REF = process.env.NEW_REF || 'origin/claude/project-thread-hg3o79';
const FMT = { language: 'sql', indent: '  ' };
const XMLS = ['notice', 'm2m', 'studyplan', 'voca', 'member', 'attendance', 'penalty'];

function loadEnv() {
  const cands = [process.env.CMP_ENV, path.join(REPO, 'ttokssaem_nodejs_api', '.env'), path.join(REPO, 'ttokssaem_nodejs_admin', '.env')].filter(Boolean);
  const file = cands.find(f => fs.existsSync(f));
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return env;
}

function xmlFiles(ref, tag) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `cmp3-${tag}-`));
  return XMLS.map(x => {
    const f = path.join(dir, `${x}.xml`);
    fs.writeFileSync(f, execFileSync('git', ['-C', REPO, 'show', `${ref}:ttokssaem_nodejs_api/xml/${x}.xml`]));
    return f;
  });
}
const FILES = { old: xmlFiles(OLD_REF, 'old'), new: xmlFiles(NEW_REF, 'new') };
let loaded = null;

function toIntString(value, fallback) {
  const n = parseInt(value, 10);
  return String(isNaN(n) ? fallback : n);
}
// old: 기존 MAKESQL, new: 이 브랜치의 MAKESQL(LIMIT/OFFSET 정수화, 원본 param은 그대로)
function render(ver, ns, id, param) {
  if (loaded !== ver) { mapper.createMapper(FILES[ver]); loaded = ver; }
  const p = Object.assign({}, param);
  if (ver === 'new') {
    if (p.start !== undefined && p.start !== '' && p.start !== null) p.start = toIntString(p.start, 0);
    if (p.length !== undefined && p.length !== '' && p.length !== null) p.length = toIntString(p.length, 10);
  }
  return mapper.getStatement(ns, id, p, FMT);
}

function assertReadOnly(sql) {
  const s = sql.replace(/^(\s+|--[^\n]*\n|\/\*[\s\S]*?\*\/)+/, '');
  if (!/^(SELECT|EXPLAIN)\b/i.test(s)) throw new Error(`읽기 전용이 아닌 문장 차단: ${s.slice(0, 40)}`);
  if (/;\s*\S/.test(s)) throw new Error('여러 문장 차단');
}
let conn;
async function q(sql) { assertReadOnly(sql); const [rows] = await conn.query(sql); return rows; }
async function timed(sql, n = 3) {
  const nc = sql.replace(/^(\s*)SELECT\b/i, '$1SELECT SQL_NO_CACHE');
  let rows, err = null; const ms = [];
  for (let i = 0; i < n; i++) {
    const t = process.hrtime.bigint();
    try { rows = await q(nc); } catch (e) { err = e.code || e.message; break; }
    ms.push(Number(process.hrtime.bigint() - t) / 1e6);
  }
  ms.sort((a, b) => a - b);
  return { rows, err, ms: ms.length ? Math.round(ms[Math.floor(ms.length / 2)]) : null };
}
async function explain(sql) {
  try {
    const rows = await q(`EXPLAIN ${sql}`);
    return rows.map(r => `${r.table}:${r.type}:${r.key || '-'}:${r.rows}${/filesort|temporary/i.test(r.Extra || '') ? `(${(r.Extra.match(/Using (filesort|temporary)/g) || []).join(',')})` : ''}`).join(' / ');
  } catch (e) { return `EXPLAIN 실패 ${e.code || e.message}`; }
}
const norm = v => (v instanceof Date ? v.toISOString() : Buffer.isBuffer(v) ? v.toString('hex') : v);
const normRows = (rows, drop = []) => (rows || []).map(r => { const o = {}; for (const k of Object.keys(r)) if (!drop.includes(k)) o[k] = norm(r[k]); return o; });
const hash = x => crypto.createHash('sha1').update(JSON.stringify(x)).digest('hex').slice(0, 10);
const yn = b => (b ? '같음' : '**다름**');
const mask = id => (id == null ? '-' : `${String(id).slice(0, 3)}…(${hash(String(id)).slice(0, 4)})`); // 회원 아이디는 앞 3자 + 해시만

const report = [], summary = [];
const md = s => report.push(s);

// 같은 SQL을 전/후로 실행해 비교. agoregdate("n분전")는 실행 시각에 따라 바뀌므로 뺀다.
async function compareCase(ns, id, p, label, opt = {}) {
  const so = render('old', ns, id, p), sn = render('new', ns, id, p);
  const o = await timed(so), n = await timed(sn);
  if (o.err || n.err) return { ok: false, line: `| ${label} | 오류 ${o.err || ''}/${n.err || ''} | | | | |` };
  let a = normRows(o.rows, ['agoregdate']), b = normRows(n.rows, ['agoregdate']);
  if (opt.sortBy) { const f = (x, y) => String(x[opt.sortBy]).localeCompare(String(y[opt.sortBy])); a = a.slice().sort(f); b = b.slice().sort(f); }
  const same = hash(a) === hash(b);
  return { ok: same, so, sn, line: `| ${label} | ${o.rows.length}/${n.rows.length} | ${yn(same)} | ${o.ms} | ${n.ms} |` };
}

async function main() {
  const env = loadEnv();
  conn = await mysql.createConnection({ host: env.MYSQL_HOST, port: env.MYSQL_PORT, user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, database: env.MYSQL_DATABASE });
  const oldSha = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', OLD_REF]).toString().trim();
  const newSha = execFileSync('git', ['-C', REPO, 'rev-parse', '--short', NEW_REF]).toString().trim();
  const [{ ver }] = await q('SELECT VERSION() ver');
  md(`# API 개선(3단계) 개발 전/후 쿼리 비교\n\n- 실행: ${new Date().toISOString()}\n- 개발 전: ${OLD_REF} (${oldSha}), 개발 후: ${NEW_REF} (${newSha})\n- DB 버전: ${ver}\n- 시간은 SQL_NO_CACHE 3회 중앙값(ms). 행 비교는 정렬 순서까지 포함한 전체 결과의 해시(agoregdate "n분전"은 실행 시각 차이라 제외). 회원 아이디는 앞 3자와 해시만 표시.\n`);

  const colType = async (t, c) => ((await q(`SELECT DATA_TYPE t FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = 'ttokssaemdb' AND TABLE_NAME = '${t}' AND COLUMN_NAME = '${c}'`))[0] || {}).t;

  // ===== 3-1 알림 목록 =====
  md('## 3-1 알림 목록 (파생 테이블 감싸기 제거)\n');
  const topNotice = (await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.notice GROUP BY memberid ORDER BY c DESC LIMIT 1`))[0];
  const recentNotice = await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.notice WHERE noticeid > (SELECT MAX(noticeid) - 3000 FROM ttokssaemdb.notice) GROUP BY memberid ORDER BY c DESC LIMIT 3`);
  const noticeMembers = [topNotice, ...recentNotice.filter(r => r.memberid !== topNotice.memberid).slice(0, 2)];
  md(`- 대상: 알림 가장 많은 회원 1명 + 최근 알림이 많은 회원 2명\n`);
  md('| 회원(알림 수) / 쪽 | 행 수(전/후) | 결과 | 전 ms | 후 ms |\n|---|---|---|---:|---:|');
  let ok31 = true, ex31 = null;
  for (const m of noticeMembers) {
    const total = (await q(`SELECT COUNT(*) c FROM ttokssaemdb.notice WHERE memberid = ${conn.escape(m.memberid)}`))[0].c;
    for (const page of [0, 1, 5]) {
      const p = { branchid: '', memberid: m.memberid, page, length: 20, start: page * 20 };
      const r = await compareCase('notice', 'selNoticeList', p, `${mask(m.memberid)}(${total}) / ${page}쪽`);
      ok31 = ok31 && r.ok; md(r.line);
      if (!ex31 && r.sn) ex31 = { old: await explain(r.so), new: await explain(r.sn) };
    }
  }
  md(`\n- EXPLAIN 전: ${ex31 && ex31.old}\n- EXPLAIN 후: ${ex31 && ex31.new}`);
  summary.push(`3-1 알림 목록: ${ok31 ? '모두 같음' : '다른 경우 있음'}`);

  // ===== 3-2 오늘 알림 =====
  md('\n## 3-2 오늘 알림 (DATE(regdate) = CURRENT_DATE() → 범위 조건)\n');
  md(`- notice.regdate 타입: ${await colType('notice', 'regdate')} (datetime/timestamp이면 두 조건의 결과가 같아야 함)\n`);
  const todayMembers = await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.notice WHERE noticeid > (SELECT MAX(noticeid) - 3000 FROM ttokssaemdb.notice) AND regdate >= CURRENT_DATE() GROUP BY memberid ORDER BY c DESC LIMIT 2`);
  md('| 회원 | 행 수(전/후) | 결과 | 전 ms | 후 ms |\n|---|---|---|---:|---:|');
  let ok32 = true, ex32 = null;
  for (const m of [topNotice, ...todayMembers]) {
    const r = await compareCase('notice', 'todayNoticeList', { branchid: '', memberid: m.memberid }, mask(m.memberid));
    ok32 = ok32 && r.ok; md(r.line);
    if (!ex32 && r.sn) ex32 = await explain(r.sn);
  }
  md(`\n- EXPLAIN 후: ${ex32}`);
  summary.push(`3-2 오늘 알림: ${ok32 ? '모두 같음' : '다른 경우 있음'}`);

  // ===== 3-3 읽음 처리 =====
  md('\n## 3-3 읽음 처리 (한 건씩 UPDATE → 한 번에 UPDATE, 실행하지 않음)\n');
  const ids = [101, 102, 103];
  const oldUpd = ids.map(id => render('old', 'notice', 'readNotice', { noticeid: id }).replace(/\s+/g, ' ').trim());
  const newUpd = render('new', 'notice', 'readNoticeList', { noticeids: ids }).replace(/\s+/g, ' ').trim();
  const setOld = oldUpd.map(s => s.match(/SET (.*) WHERE/)[1]);
  const setNew = newUpd.match(/SET (.*) WHERE/)[1];
  const idsNew = (newUpd.match(/IN \((.*)\)/)[1]).split(',').map(x => x.replace(/['\s]/g, ''));
  const ok33 = setOld.every(s => s === setNew) && hash(idsNew) === hash(ids.map(String));
  md(`- 전(1건): \`${oldUpd[0]}\`\n- 후(3건): \`${newUpd}\`\n- 바꾸는 값(SET)과 대상 id: ${yn(ok33)}`);
  summary.push(`3-3 읽음 처리 UPDATE: ${ok33 ? '같은 값·같은 대상' : '다름'}`);

  // ===== 3-4 단어시험 이력 =====
  md('\n## 3-4 단어시험 이력 (vocaexam 전체 GROUP BY 제거)\n');
  const topHist = await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.checkvocaplan GROUP BY memberid ORDER BY c DESC LIMIT 2`);
  md('| 회원(배정 수) / 쪽 | 행 수(전/후) | 결과 | 전 ms | 후 ms |\n|---|---|---|---:|---:|');
  let ok34 = true, ex34 = null;
  for (const m of topHist) {
    for (const [page, who] of [[0, 'memberid'], [2, 'memberid'], [0, 'targetid']]) {
      const p = { branchid: '', page, length: 20, start: page * 20, memberid: who === 'memberid' ? m.memberid : 'x', targetid: who === 'targetid' ? m.memberid : '' };
      const r = await compareCase('voca', 'selVocaHistList', p, `${mask(m.memberid)}(${m.c}) / ${page}쪽${who === 'targetid' ? ' (학부모 조회)' : ''}`);
      ok34 = ok34 && r.ok; md(r.line);
      if (!ex34 && r.sn) ex34 = { old: await explain(r.so), new: await explain(r.sn) };
    }
  }
  md(`\n- EXPLAIN 전: ${ex34 && ex34.old}\n- EXPLAIN 후: ${ex34 && ex34.new}`);
  summary.push(`3-4 단어시험 이력: ${ok34 ? '모두 같음(차수 포함)' : '다른 경우 있음'}`);

  // ===== 3-5 다른 목록 =====
  md('\n## 3-5 1:1 문의·학습계획 달성·단어 풀이 목록 (감싸기 제거)\n');
  md('| 목록 / 회원 / 쪽 | 행 수(전/후) | 결과 | 전 ms | 후 ms |\n|---|---|---|---:|---:|');
  let ok35 = true;
  const topM2m = (await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.m2m GROUP BY memberid ORDER BY c DESC LIMIT 1`))[0];
  const topSp = (await q(`SELECT memberid, COUNT(*) c FROM ttokssaemdb.studyplan WHERE plandate >= CURRENT_DATE() - INTERVAL 60 DAY GROUP BY memberid ORDER BY c DESC LIMIT 1`))[0];
  const topVs = (await q(`SELECT memberid, memodate, degree, COUNT(*) c FROM ttokssaemdb.vocasolve WHERE id > (SELECT MAX(id) - 20000 FROM ttokssaemdb.vocasolve) GROUP BY memberid, memodate, degree ORDER BY c DESC LIMIT 1`))[0];
  for (const page of [0, 1]) {
    if (topM2m) { const r = await compareCase('m2m', 'selM2mList', { branchid: '', memberid: topM2m.memberid, page, length: 20, start: page * 20 }, `m2m / ${mask(topM2m.memberid)} / ${page}쪽`); ok35 = ok35 && r.ok; md(r.line); }
    if (topSp) { const r = await compareCase('studyplan', 'achiveStudyPlanList', { branchid: '', memberid: topSp.memberid, page, length: 20, start: page * 20 }, `학습계획 달성 / ${mask(topSp.memberid)} / ${page}쪽`); ok35 = ok35 && r.ok; md(r.line); }
    if (topVs) { const r = await compareCase('voca', 'selVocaSolveList', { branchid: '', memberid: topVs.memberid, memodate: topVs.memodate, degree: topVs.degree, page, length: 10, start: page * 10 }, `단어 풀이 / ${mask(topVs.memberid)} ${topVs.memodate} ${topVs.degree}차 / ${page}쪽`); ok35 = ok35 && r.ok; md(r.line); }
  }
  summary.push(`3-5 다른 목록: ${ok35 ? '모두 같음' : '다른 경우 있음'}`);

  // ===== 3-7 ${} → #{} =====
  md('\n## 3-7 값 바인딩 (${...} → #{...}), LIMIT/OFFSET 정수화\n');
  md('숫자 값이 따옴표로 감싸지는 것 외에 SQL이 같은지 모든 바뀐 문장에서 확인하고(따옴표 숫자를 숫자로 바꿔 비교), SELECT는 실제 결과도 비교합니다.\n');
  const sample = { branchid: 'BR00000001', memberid: topVs ? topVs.memberid : 'x', memodate: topVs ? topVs.memodate : '20261115', degree: topVs ? topVs.degree : 1, vocano: 1, vocalevel: 1, id: 1, total: 30, wrong: 2, finishflag: 'Y', answer: 'a', result: 'O', noticeid: 1, m2mid: 1, question: 'q', memberno: 1, dayofweek: 1, status: 1, masterplanid: 1, targetid: '', page: 0, length: 20, start: 0, schoolcode: '', membername: '', contact: '', memberpw: '', newpw: '', push: 'Y', os: '', pushtoken: '' };
  const unq = s => s.replace(/\s+/g, ' ').replace(/'(-?\d+)'/g, '$1').trim();
  const changed = [['member', 'verifyID'], ['voca', 'selVocaAnswer'], ['voca', 'finishVocaExam'], ['voca', 'selVocaTestList'], ['voca', 'updateVocaTestResult'], ['voca', 'solveVocaTestResult'], ['voca', 'totCntVocaSolve'], ['m2m', 'updM2m'], ['m2m', 'delM2m'], ['notice', 'readNotice'], ['notice', 'noticeAgree'], ['attendance', 'lastRuntimePlanStaus'], ['attendance', 'updateRuntimePlanStaus']];
  md('| 문장 | SQL(숫자 따옴표 제외) |\n|---|---|');
  let ok37 = true;
  for (const [ns, id] of changed) {
    let same;
    try { same = unq(render('old', ns, id, sample)) === unq(render('new', ns, id, sample)); } catch (e) { same = false; md(`| ${ns}.${id} | 생성 오류 ${e.message} |`); ok37 = false; continue; }
    ok37 = ok37 && same; md(`| ${ns}.${id} | ${same ? '같음' : '**다름**'} |`);
  }
  md('\n| SELECT 실행 | 행 수(전/후) | 결과 | 전 ms | 후 ms |\n|---|---|---|---:|---:|');
  const no = (await q(`SELECT branchid, memberno FROM ttokssaemdb.member WHERE type = 'S' AND classyn = 'Y' AND memberno IS NOT NULL ORDER BY memberid LIMIT 1`))[0];
  if (no) { const r = await compareCase('member', 'verifyID', { branchid: no.branchid, memberno: String(no.memberno) }, `member.verifyID 학생번호`); ok37 = ok37 && r.ok; md(r.line); }
  if (topVs) {
    for (const id of ['totCntVocaSolve', 'solveVocaTestResult']) { const r = await compareCase('voca', id, sample, `voca.${id}`); ok37 = ok37 && r.ok; md(r.line); }
    const r = await compareCase('voca', 'selVocaTestList', sample, 'voca.selVocaTestList (ORDER BY rand, id순 비교)', { sortBy: 'id' }); ok37 = ok37 && r.ok; md(r.line);
  }
  const rp = (await q(`SELECT branchid, memberid, dayofweek FROM ttokssaemdb.runtimeplan WHERE status <> 3 ORDER BY masterplanid DESC LIMIT 1`))[0];
  if (rp) { const r = await compareCase('attendance', 'lastRuntimePlanStaus', rp, 'attendance.lastRuntimePlanStaus'); ok37 = ok37 && r.ok; md(r.line); }
  const inj = render('new', 'notice', 'selNoticeList', { memberid: 'x', length: '20 UNION SELECT 1', start: '0; DROP' }).replace(/\s+/g, ' ');
  const injNo = render('new', 'member', 'verifyID', { branchid: 'b', memberno: '1 OR 1=1' }).replace(/\s+/g, ' ');
  md(`\n- 주입 시도 값(실행하지 않고 SQL만 생성): \`${(inj.match(/LIMIT .*$/) || [''])[0].trim()}\`, \`${(injNo.match(/memberno = '[^']*'/) || [''])[0]}\``);
  summary.push(`3-7 바인딩: ${ok37 ? '모두 같음' : '다른 경우 있음'}`);

  await conn.end();
  fs.writeFileSync(OUT, `${report[0]}\n## 요약\n\n${summary.map(s => `- ${s}`).join('\n')}\n\n${report.slice(1).join('\n')}\n`);
  console.log(`보고서: ${OUT}`);
  console.log(summary.join('\n'));
}

main().catch(async e => {
  console.error(`실패: ${e.code || ''} ${e.message}`);
  try { if (conn) await conn.end(); } catch (_) { /* ignore */ }
  process.exit(1);
});
