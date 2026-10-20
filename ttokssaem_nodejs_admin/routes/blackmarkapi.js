var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcBlackmark = require('../services/SvcBlackmark');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	벌점 목록
	*/
	app.get('/v1/selBlackmarkList', function (req, res) {
		let cmd = '/v1/selBlackmarkList';
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

		let svc = new SvcBlackmark(cmd, req.query, req, res, t);
		svc.selBlackmarkList();
	});

	/*
	벌점 최근 3개
	*/
	app.post('/v1/loadLastBlackmarks', function (req, res) {
		let cmd = '/v1/loadLastBlackmarks';
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
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcBlackmark(cmd, req.body, req, res, t);
		svc.loadLastBlackmarks();
	});

};
