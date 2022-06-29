var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcUser = require('../services/SvcUser');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	학생 목록
	*/
	app.get('/v1/selStudentList', function (req, res) {
		let cmd = '/v1/selStudentList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcUser(cmd, req.query, req, res, t);
		svc.selUserList();
	});

	/*
	학생 정보
	*/
	app.post('/v1/selStudent', function (req, res) {
		let cmd = '/v1/selStudent';
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

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.selUser();
	});

	/*
	학생 등록
	*/
	app.post('/v1/insStudent', async function (req, res) {
		let cmd = '/v1/insStudent';
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

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.insUser();
	});

	/*
	학생 수정
	*/
	app.post('/v1/updStudent', function (req, res) {
		let cmd = '/v1/updStudent';
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

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.updUser();
	});

	/*
	학생 삭제
	*/
	app.post('/v1/delStudent', function (req, res) {
		let cmd = '/v1/delStudent';
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

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.delUser();
	});
};
