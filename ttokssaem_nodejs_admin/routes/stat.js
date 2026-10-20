const router = require('express').Router();
const SvcSession = require('../services/SvcSession');
const SvcStat = require('../services/SvcStat');
const Response = require('../common/Response');
const ElapsedTimer = require('../common/ElapsedTimer');
const Code = require('../common/Code');

router.get('/stat', (req, res) => {
  const session = new SvcSession(req);
  if (!session.isLogin()) return res.redirect('/login');
  res.render('stat/stat', {
    title: '똑소리나는샘 관리형 독서실 > 월별 매출 통계',
    userinfo: session.getUserInfo(), menulist: session.getMenuList(),
    permission: session.getPermission('/payment'),
    year: Number(new Intl.DateTimeFormat('en', { timeZone: 'Asia/Seoul', year: 'numeric' }).format(new Date())),
  });
});

async function respond(req, res, refresh) {
  res.set('Cache-Control', 'no-store');
  const cmd = refresh ? '/v1/generateSalesStat' : '/v1/selSalesStat';
  const timer = new ElapsedTimer();
  const session = new SvcSession(req);
  const send = (code, data) => res.json(new Response(cmd, code, data, timer).build());
  if (!session.isLogin()) return send(Code.Api.SESSION_TIMEOUT.value, {});
  const input = refresh ? req.body.year : req.query.year;
  if (!/^\d{4}$/.test(String(input)) || Number(input) < 1001 || Number(input) > 9999 || !session.getBranchId()) {
    return send(Code.Api.BAD_REQUEST.value, {});
  }
  try { send(Code.Api.OK.value, await SvcStat.getSalesStat(session.getBranchId(), Number(input), refresh)); }
  catch (err) { _logger.error(err.stack); send(Code.Api.DB_ERROR.value, {}); }
}
router.get('/v1/selSalesStat', (req, res) => respond(req, res, false));
router.post('/v1/generateSalesStat', (req, res) => respond(req, res, true));
module.exports = router;
