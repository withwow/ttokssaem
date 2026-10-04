// Month indices keep allocation independent of the server timezone.
function parseMonth(value) {
  const text = String(value || '').trim();
  const match = text.match(/^(\d{4})(\d{2})(\d{2})?$/) || text.match(/^(\d{4})-(\d{2})(?:-(\d{2}))?$/);
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]);
  if (year < 1000 || month < 1 || month > 12) return null;
  if (match[3]) {
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  }
  return year * 12 + month - 1;
}

function preparePayments(rows) {
  const payments = [];
  let excludedCount = 0;
  for (const row of rows) {
    const start = parseMonth(row.startdate), end = parseMonth(row.enddate), price = Number(row.price);
    if (start === null || end === null || end < start || !Number.isSafeInteger(price)) {
      excludedCount++;
      continue;
    }
    const months = end - start + 1;
    const monthly = Math.trunc(price / months);
    payments.push({ start, end, monthly, remainder: price - monthly * months });
  }
  return { payments, excludedCount };
}

function calculate(prepared, year) {
  const totals = new Array(24).fill(0);
  const first = (year - 1) * 12;
  for (const payment of prepared.payments) {
    const start = Math.max(payment.start, first), end = Math.min(payment.end, first + 23);
    for (let month = start; month <= end; month++) {
      totals[month - first] += payment.monthly + (month === payment.end ? payment.remainder : 0);
    }
  }
  const rows = Array.from({ length: 12 }, (_, index) => {
    const previous = totals[index], current = totals[index + 12];
    return { month: index + 1, previous, current, difference: current - previous,
      rate: previous === 0 ? null : (current - previous) / previous * 100 };
  });
  const previous = totals.slice(0, 12).reduce((sum, value) => sum + value, 0);
  const current = totals.slice(12).reduce((sum, value) => sum + value, 0);
  return { year, previousYear: year - 1, rows, totals: { previous, current, difference: current - previous,
    rate: previous === 0 ? null : (current - previous) / previous * 100 }, excludedCount: prepared.excludedCount };
}

module.exports = { parseMonth, preparePayments, calculate };
