var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcAttendance = require('../services/SvcAttendance');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	출결 목록
	*/
	app.get('/v1/selAttendanceList', function (req, res) {
		let cmd = '/v1/selAttendanceList';
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

		let svc = new SvcAttendance(cmd, req.query, req, res, t);
		svc.selAttendanceList();
	});

};
