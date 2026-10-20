const MysqlConn = require('../common/MysqlConn');
const SalesStat = require('../common/SalesStat');
const cache = new Map();
const pending = new Map();
const CACHE_MS = 5 * 60 * 1000;

async function loadPayments(branchid, refresh) {
  const cached = cache.get(branchid);
  if (!refresh && cached && Date.now() - cached.timestamp < CACHE_MS) return cached;
  if (pending.has(branchid)) return pending.get(branchid);
  const task = (async () => {
    // Scope comes only from the authenticated session, never the request body.
    const sql = 'SELECT startdate, enddate, price FROM ttokssaemdb.payment WHERE cancel = ?' +
      (branchid === 'BR00000000' ? '' : ' AND branchid = ?');
    const [rows] = await MysqlConn.pool.query(sql, branchid === 'BR00000000' ? ['N'] : ['N', branchid]);
    const prepared = SalesStat.preparePayments(rows);
    const years = new Set([Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(new Date()))]);
    for (const payment of prepared.payments) {
      for (let year = Math.floor(payment.start / 12); year <= Math.floor(payment.end / 12); year++) {
        if (year > 1000) years.add(year);
      }
    }
    const result = { prepared, years: Array.from(years).sort((a, b) => b - a), timestamp: Date.now() };
    // Bound memory usage when many branch sessions access the page.
    for (const [key, value] of cache) if (Date.now() - value.timestamp >= CACHE_MS) cache.delete(key);
    if (cache.size >= 100 && !cache.has(branchid)) cache.delete(cache.keys().next().value);
    cache.set(branchid, result);
    return result;
  })();
  pending.set(branchid, task);
  try { return await task; } finally { pending.delete(branchid); }
}

async function getSalesStat(branchid, year, refresh = false) {
  if (!branchid) throw new Error('Missing session branch');
  const source = await loadPayments(branchid, refresh);
  const result = SalesStat.calculate(source.prepared, year);
  result.years = Array.from(new Set([...source.years, year])).sort((a, b) => b - a);
  result.generatedAt = new Date(source.timestamp).toISOString();
  return result;
}

module.exports = { getSalesStat };
