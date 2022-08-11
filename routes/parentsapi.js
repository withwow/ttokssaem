var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcParents = require('../services/SvcParents');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {


	/*
  보호자 등록
	*/
	app.post('/v1/addParents', function (req, res) {
		let cmd = '/v1/addParents';
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

		let svc = new SvcParents(cmd, req.body, req, res, t);
		svc.addParents();
	});

		/*
  보호자 등록
	*/
	app.post('/v1/insParents', function (req, res) {
		let cmd = '/v1/insParents';
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

		let svc = new SvcParents(cmd, req.body, req, res, t);
		svc.insParents();
	});

	/*
  보호자 삭제
	*/
	app.post('/v1/delParents', function (req, res) {
		let cmd = '/v1/delParents';
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

		let svc = new SvcParents(cmd, req.body, req, res, t);
		svc.delParents();
	});

};
