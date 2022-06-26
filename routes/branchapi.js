var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcBranch = require('../services/SvcBranch');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	/*
	지점 목록
	*/
	app.get('/v1/selBranchList', function (req, res) {
		let cmd = '/v1/selBranchList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcBranch(cmd, req.query, req, res, t);
		svc.selBranchList();
	});

	/*
	지점 정보
	*/
	app.post('/v1/selBranch', function (req, res) {
		let cmd = '/v1/selBranch';
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

		let svc = new SvcBranch(cmd, req.body, req, res, t);
		svc.selBranch();
	});

	/*
	지점 등록
	*/
	app.post('/v1/insBranch', function (req, res) {
		let cmd = '/v1/insBranch';
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

		let svc = new SvcBranch(cmd, req.body, req, res, t);
		svc.insBranch();
	});

	/*
	지점 수정
	*/
	app.post('/v1/updBranch', function (req, res) {
		let cmd = '/v1/updBranch';
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

		let svc = new SvcBranch(cmd, req.body, req, res, t);
		svc.updBranch();
	});

	/*
	지점 삭제
	*/
	app.post('/v1/delBranch', function (req, res) {
		let cmd = '/v1/delBranch';
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

		let svc = new SvcBranch(cmd, req.body, req, res, t);
		svc.delBranch();
	});
};
