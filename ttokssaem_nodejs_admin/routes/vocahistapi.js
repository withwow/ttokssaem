var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcVocaHist = require('../services/SvcVocaHist');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	단어시험 이력 목록
	*/
	app.get('/v1/selVocaHistList', function (req, res) {
		let cmd = '/v1/selVocaHistList';
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
		
		// req.query.memodate = req.query.memodate.replace(/-/g, '');

		_logger.debug(util.inspect(req.query));

		let svc = new SvcVocaHist(cmd, req.query, req, res, t);
		svc.selVocaHistList();
	});

	/*
	단어시험 이력 정보
	*/
	app.post('/v1/selVocaHist', function (req, res) {
		let cmd = '/v1/selVocaHist';
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

		let svc = new SvcVocaHist(cmd, req.body, req, res, t);
		svc.selVocaHist();
	});

	/*
	단어시험 이력 등록
	*/
	app.post('/v1/insVocaHist', async function (req, res) {
		let cmd = '/v1/insVocaHist';
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

		let svc = new SvcVocaHist(cmd, req.body, req, res, t);
		svc.insVocaHist();
	});

	/*
	단어시험 이력 수정
	*/
	app.post('/v1/updVocaHist', function (req, res) {
		let cmd = '/v1/updVocaHist';
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

		let svc = new SvcVocaHist(cmd, req.body, req, res, t);
		svc.updVocaHist();
	});

	/*
	단어장 삭제
	*/
	app.post('/v1/delVocaHist', function (req, res) {
		let cmd = '/v1/delVocaHist';
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

		let svc = new SvcVocaHist(cmd, req.body, req, res, t);
		svc.delVocaHist();
	});
};
