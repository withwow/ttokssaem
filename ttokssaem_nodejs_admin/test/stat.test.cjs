const test = require('node:test');
const assert = require('node:assert/strict');
const SalesStat = require('../common/SalesStat');

test('inclusive months, cross-year allocation and last-month remainder conserve price', () => {
  const prepared = SalesStat.preparePayments([
    { startdate: '20251101', enddate: '20260131', price: 100 },
    { startdate: '202602', enddate: '2026-02', price: 500 },
  ]);
  const result = SalesStat.calculate(prepared, 2026);
  assert.equal(result.rows[10].previous, 33);
  assert.equal(result.rows[11].previous, 33);
  assert.equal(result.rows[0].current, 34);
  assert.equal(result.rows[1].current, 500);
  assert.equal(result.totals.previous + result.totals.current, 600);
  assert.equal(result.rows[0].rate, null);
});

test('invalid dates and reversed periods are excluded without using payment registration date', () => {
  const prepared = SalesStat.preparePayments([
    { startdate: '', enddate: '', price: 100 },
    { startdate: '20260229', enddate: '20260301', price: 100 },
    { startdate: '202601', enddate: '202512', price: 100 },
    { startdate: '202413', enddate: '202501', price: 100 },
    { startdate: '20240229', enddate: '20240229', price: 100 },
  ]);
  assert.equal(prepared.excludedCount, 4);
  assert.equal(SalesStat.calculate(prepared, 2024).totals.current, 100);
});

test('long periods allocate only the share belonging to comparison years', () => {
  const prepared = SalesStat.preparePayments([{ startdate: '202401', enddate: '202712', price: 4800 }]);
  const result = SalesStat.calculate(prepared, 2026);
  assert.equal(result.totals.previous, 1200);
  assert.equal(result.totals.current, 1200);
  assert.equal(result.totals.rate, 0);
});

test('stat endpoints require login, validate year, isolate branch cache and refresh', async () => {
  global._logger = { debug() {}, error() {} };
  const express = require('express');
  const MysqlConn = require('../common/MysqlConn');
  const savedQuery = MysqlConn.pool.query;
  let queries = [];
  MysqlConn.pool.query = async (sql, params) => {
    queries.push({ sql, params });
    return [[{ startdate: '20260101', enddate: '20260331', price: 300 }]];
  };
  const app = express();
  app.set('view engine', 'ejs');
  app.set('views', require('path').join(__dirname, '../views'));
  app.use(express.json());
  app.use((req, res, next) => {
    req.session = req.headers['x-test-branch'] ? { userid: 'test', branchid: req.headers['x-test-branch'], menulist: [] } : {};
    next();
  });
  app.use(require('../routes/stat'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = 'http://127.0.0.1:' + server.address().port;
  const get = async (url, branch) => (await fetch(base + url, { headers: branch ? { 'x-test-branch': branch } : {} })).json();
  try {
    assert.equal((await get('/v1/selSalesStat?year=2026')).code, 999);
    assert.equal((await get('/v1/selSalesStat?year=2026abc', 'TEST-A')).code, 2);
    assert.equal(queries.length, 0);
    const result = await get('/v1/selSalesStat?year=2026', 'TEST-A');
    assert.equal(result.data.totals.current, 300);
    assert.deepEqual(queries[0].params, ['N', 'TEST-A']);
    assert.match(queries[0].sql, /AND branchid = \?/);
    await get('/v1/selSalesStat?year=2025', 'TEST-A');
    assert.equal(queries.length, 1);
    await get('/v1/selSalesStat?year=2026&branchid=TEST-A', 'TEST-B');
    assert.deepEqual(queries[1].params, ['N', 'TEST-B']);
    const refreshed = await fetch(base + '/v1/generateSalesStat', {
      method: 'POST', headers: { 'x-test-branch': 'TEST-A', 'Content-Type': 'application/json' }, body: JSON.stringify({ year: '2026' }),
    });
    assert.equal((await refreshed.json()).code, 0);
    assert.equal(queries.length, 3);
    await get('/v1/selSalesStat?year=2026', 'BR00000000');
    assert.deepEqual(queries[3].params, ['N']);
    assert.doesNotMatch(queries[3].sql, /AND branchid/);
    const page = await fetch(base + '/stat', { headers: { 'x-test-branch': 'TEST-A' } });
    assert.equal(page.status, 200);
    assert.match(await page.text(), /월별 매출 통계/);
    const unauthenticated = await fetch(base + '/stat', { redirect: 'manual' });
    assert.equal(unauthenticated.headers.get('location'), '/login');
  } finally {
    MysqlConn.pool.query = savedQuery;
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await MysqlConn.pool.end();
  }
});
