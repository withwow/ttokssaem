var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcVocaExam = require('../services/SvcVocaExam');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	단어시험 이력 목록
	*/
	app.get('/v1/selVocaExamList', function (req, res) {
		let cmd = '/v1/selVocaExamList';
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

		let svc = new SvcVocaExam(cmd, req.query, req, res, t);
		svc.selVocaExamList();
	});

	/*
	단어시험 이력 정보
	*/
	app.post('/v1/selVocaExam', function (req, res) {
		let cmd = '/v1/selVocaExam';
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

		let svc = new SvcVocaExam(cmd, req.body, req, res, t);
		svc.selVocaExam();
	});

	/*
	단어시험 이력 등록
	*/
	app.post('/v1/insVocaExam', async function (req, res) {
		let cmd = '/v1/insVocaExam';
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

		let svc = new SvcVocaExam(cmd, req.body, req, res, t);
		svc.insVocaExam();
	});

	/*
	단어시험 이력 수정
	*/
	app.post('/v1/updVocaExam', function (req, res) {
		let cmd = '/v1/updVocaExam';
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

		let svc = new SvcVocaExam(cmd, req.body, req, res, t);
		svc.updVocaExam();
	});

	/*
	단어장 삭제
	*/
	app.post('/v1/delVocaExam', function (req, res) {
		let cmd = '/v1/delVocaExam';
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

		let svc = new SvcVocaExam(cmd, req.body, req, res, t);
		svc.delVocaExam();
	});
};
