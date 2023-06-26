var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcM2m = require('../services/SvcM2m');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	/*
	문의 목록
	*/
	app.get('/v1/selM2mList', function (req, res) {
		let cmd = '/v1/selM2mList';
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

		let svc = new SvcM2m(cmd, req.query, req, res, t);
		svc.selM2mList();
	});


	/*
	문의 정보
	*/
	app.post('/v1/selM2m', function (req, res) {
		let cmd = '/v1/selM2m';
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

		let svc = new SvcM2m(cmd, req.body, req, res, t);
		svc.selM2m();
	});

		/*
	답변 정보
	*/
	app.post('/v1/answerM2M', function (req, res) {
		let cmd = '/v1/answerM2M';
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

		let svc = new SvcM2m(cmd, req.body, req, res, t);
		svc.answerM2M();
	});


	/*
	메모 목록
	*/
	app.get('/v1/checkM2M', function (req, res) {
		let cmd = '/v1/checkM2M';
		// _logger.debug(`GET == ${cmd}`);

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

		// _logger.debug(util.inspect(req.query));

		let svc = new SvcM2m(cmd, req.query, req, res, t);
		svc.checkM2M();
	});

};
