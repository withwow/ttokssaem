var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcVoca = require('../services/SvcVoca');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	단어장 목록
	*/
	app.get('/v1/selVocaList', function (req, res) {
		let cmd = '/v1/selVocaList';
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

		let svc = new SvcVoca(cmd, req.query, req, res, t);
		svc.selVocaList();
	});

	/*
	단어장 정보
	*/
	app.post('/v1/selVoca', function (req, res) {
		let cmd = '/v1/selVoca';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.selVoca();
	});

	/*
	단어장 등록
	*/
	app.post('/v1/insVoca', async function (req, res) {
		let cmd = '/v1/insVoca';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.insVoca();
	});

	/*
	단어장 수정
	*/
	app.post('/v1/updVoca', function (req, res) {
		let cmd = '/v1/updVoca';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.updVoca();
	});

	/*
	단어장 삭제
	*/
	app.post('/v1/delVoca', function (req, res) {
		let cmd = '/v1/delVoca';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.delVoca();
	});
};
