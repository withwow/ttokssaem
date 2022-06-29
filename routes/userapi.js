var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcUser = require('../services/SvcUser');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	USER 목록
	*/
	app.get('/v1/selUserList', function (req, res) {
		let cmd = '/v1/selUserList';
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

		let svc = new SvcUser(cmd, req.query, req, res, t);
		svc.selUserList();
	});

	/*s
	USER 정보
	*/
	app.post('/v1/selUser', function (req, res) {
		let cmd = '/v1/selUser';
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

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.selUser();
	});

	/*
	User 등록
	*/
	app.post('/v1/insUser', async function (req, res) {
		let cmd = '/v1/insUser';
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

		if( req.body.session_branchid !== 'BR00000000' )
			req.body.branchid = req.body.session_branchid

		_logger.debug(util.inspect(req.body));

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.insUser();
	});

	/*
	User 수정
	*/
	app.post('/v1/updUser', function (req, res) {
		let cmd = '/v1/updUser';
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

		if( req.body.session_branchid !== 'BR00000000' )
			req.body.branchid = req.body.session_branchid

		_logger.debug(util.inspect(req.body));

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.updUser();
	});

	/*
	USER 삭제
	*/
	app.post('/v1/delUser', function (req, res) {
		let cmd = '/v1/delUser';
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

		if( req.body.session_branchid !== 'BR00000000' )
			req.body.branchid = req.body.session_branchid

		_logger.debug(util.inspect(req.body));

		let svc = new SvcUser(cmd, req.body, req, res, t);
		svc.delUser();
	});
};
