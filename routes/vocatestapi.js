var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcVocaTest = require('../services/SvcVocaTest');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	테스트 관리 목록
	*/
	app.get('/v1/selVocaTestList', function (req, res) {
		let cmd = '/v1/selVocaTestList';
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
		
		req.query.memodate = req.query.memodate.replace(/-/g, '');

		_logger.debug(util.inspect(req.query));

		let svc = new SvcVocaTest(cmd, req.query, req, res, t);
		svc.selVocaTestList();
	});

	/*
	테스트 관리 정보
	*/
	app.post('/v1/selVocaTest', function (req, res) {
		let cmd = '/v1/selVocaTest';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.selVocaTest();
	});

	/*
	테스트 관리 등록
	*/
	app.post('/v1/insVocaTest', async function (req, res) {
		let cmd = '/v1/insVocaTest';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.insVocaTest();
	});

	/*
	테스트 관리 수정
	*/
	app.post('/v1/updVocaTest', function (req, res) {
		let cmd = '/v1/updVocaTest';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.updVocaTest();
	});

	/*
	단어장 삭제
	*/
	app.post('/v1/delVocaTest', function (req, res) {
		let cmd = '/v1/delVocaTest';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.delVocaTest();
	});

	/*
	테스트 시작
	*/
	app.post('/v1/startVocaTest', function (req, res) {
		let cmd = '/v1/startVocaTest';
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

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.startVocaTest();
	});


	/*
	단어 시험 결과 목록
	*/
	app.get('/v1/selVocaSolveList', function (req, res) {
		let cmd = '/v1/selVocaSolveList';
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

		let svc = new SvcVocaTest(cmd, req.query, req, res, t);
		svc.selVocaSolveList();
	});


	/*
	단어 시험 결과 정정하기
	*/
	app.post('/v1/correctVocaSolve', function (req, res) {
		let cmd = '/v1/correctVocaSolve';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.correctVocaSolve();
	});


	/*
	재계산하기
	*/
	app.post('/v1/reCompute', function (req, res) {
		let cmd = '/v1/reCompute';
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

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.reCompute();
	});

	/*
	해당날짜 모두 지우기
	*/
	app.post('/v1/deleteMemodateVocaTest', function (req, res) {
		let cmd = '/v1/deleteMemodateVocaTest';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

				
		req.body.memodate = req.body.memodate.replace(/-/g, '');

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVocaTest(cmd, req.body, req, res, t);
		svc.deleteMemodateVocaTest();
	});
};
