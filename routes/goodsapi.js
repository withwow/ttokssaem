var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcGoods = require('../services/SvcGoods');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	상품 목록
	*/
	app.get('/v1/selGoodsList', function (req, res) {
		let cmd = '/v1/selGoodsList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.query.session_branchid = svcSession.getBranchId();
		req.query.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcGoods(cmd, req.query, req, res, t);
		svc.selGoodsList();
	});

	/*
	상품 정보
	*/
	app.post('/v1/selGoods', function (req, res) {
		let cmd = '/v1/selGoods';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcGoods(cmd, req.body, req, res, t);
		svc.selGoods();
	});

	/*
	상품 등록
	*/
	app.post('/v1/insGoods', async function (req, res) {
		let cmd = '/v1/insGoods';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let common = new SvcCommon();
		let goodsid = await common.getMax('ttok.goods', 'GOODS', 5);
		req.body.goodsid = goodsid;

		let svc = new SvcGoods(cmd, req.body, req, res, t);
		svc.insGoods();
	});

	/*
	상품 수정
	*/
	app.post('/v1/updGoods', function (req, res) {
		let cmd = '/v1/updGoods';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcGoods(cmd, req.body, req, res, t);
		svc.updGoods();
	});

	/*
	상품 삭제
	*/
	app.post('/v1/delGoods', function (req, res) {
		let cmd = '/v1/delGoods';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcGoods(cmd, req.body, req, res, t);
		svc.delGoods();
	});
};
