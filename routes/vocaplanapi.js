var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcVocaPlan = require('../services/SvcVocaPlan');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	VOCAPLAN 목록
	*/
	app.get('/v1/selVocaPlanList', function (req, res) {
		let cmd = '/v1/selVocaPlanList';
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

		let svc = new SvcVocaPlan(cmd, req.query, req, res, t);
		svc.selVocaPlanList();
	});

	/*
	VocaPlan 정보
	*/
	app.post('/v1/selVocaPlan', function (req, res) {
		let cmd = '/v1/selVocaPlan';
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

		let svc = new SvcVocaPlan(cmd, req.body, req, res, t);
		svc.selVocaPlan();
	});

	/*
	VocaPlan 등록
	*/
	app.post('/v1/insVocaPlan', async function (req, res) {
		let cmd = '/v1/insVocaPlan';
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

		let svc = new SvcVocaPlan(cmd, req.body, req, res, t);
		svc.insVocaPlan();
	});

	/*
	VocaPlan 수정
	*/
	app.post('/v1/updVocaPlan', function (req, res) {
		let cmd = '/v1/updVocaPlan';
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

		let svc = new SvcVocaPlan(cmd, req.body, req, res, t);
		svc.updVocaPlan();
	});

	/*
	VocaPlan 삭제
	*/
	app.post('/v1/delVocaPlan', function (req, res) {
		let cmd = '/v1/delVocaPlan';
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

		let svc = new SvcVocaPlan(cmd, req.body, req, res, t);
		svc.delVocaPlan();
	});
};
