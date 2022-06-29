var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	/*
	로그 인
	*/
	app.post('/v1/login', function (req, res) {
		let cmd = '/v1/login';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcCommon(cmd, req.body, req, res, t);
		svc.login();
	});

	/*
	아이디 검사
	*/
	app.post('/v1/checkMemberId', function (req, res) {
		let cmd = '/v1/checkMemberId';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcCommon(cmd, req.body, req, res, t);
		svc.checkMemberId();
	});

	/*
	로그 아웃
	*/
	app.post('/v1/logout', function (req, res) {
		let cmd = '/v1/logout';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcCommon(cmd, req.body, req, res, t);
		svc.logout();
	});

	/*
	세션 정보 보기
	*/
	app.get('/session', function (req, res) {
		let cmd = '/session';

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		svcSession.print();

		let resdata = {};
		resdata.sessionid = req.sessionID;
		resdata.ip = svcSession.getIp();
		resdata.userid = svcSession.getUserId();
		resdata.username = svcSession.getUserName();
		resdata.permission = svcSession.getPermission();

		res.json(new Response(cmd, '0', resdata, t).build());
	});
};
