var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcPush = require('../services/SvcPush');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	결제 내역 목록
	*/
	app.post('/v1/sendPushMessage', function (req, res) {
		let cmd = '/v1/sendPushMessage';
		_logger.debug(`GET == ${cmd}`);

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

		let svc = new SvcPush(cmd, req.body, req, res, t);
		svc.sendPushMessage();
	});

};
