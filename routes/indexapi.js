var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcDashboard = require('../services/SvcDashboard');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

  	/*
	학생들 목록
	*/
	app.get('/v1/selStudentAll', function (req, res) {
		let cmd = '/v1/selStudentAll';
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

		let svc = new SvcDashboard(cmd, req.query, req, res, t);
		svc.selStudentAll();
	});

	/*
	학생들 이벤트
	*/
	app.get('/v1/lastStudentStaus', function (req, res) {
		let cmd = '/v1/lastStudentStaus';
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

		let svc = new SvcDashboard(cmd, req.query, req, res, t);
		svc.lastStudentStaus();
	});
};
