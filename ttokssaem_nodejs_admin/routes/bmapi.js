var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcBm = require('../services/SvcBm');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	벌점 목록
	*/
	app.get('/v1/selBmList', function (req, res) {
		let cmd = '/v1/selBmList';
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

		let svc = new SvcBm(cmd, req.query, req, res, t);
		svc.selBmList();
	});

	/*
	벌점 정보
	*/
	app.post('/v1/selBm', function (req, res) {
		let cmd = '/v1/selBm';
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

		let svc = new SvcBm(cmd, req.body, req, res, t);
		svc.selBm();
	});

	/*
	벌점 등록
	*/
	app.post('/v1/insBm', async function (req, res) {
		let cmd = '/v1/insBm';
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

		let svc = new SvcBm(cmd, req.body, req, res, t);
		svc.insBm();
	});

	/*
	벌점 수정
	*/
	app.post('/v1/updBm', function (req, res) {
		let cmd = '/v1/updBm';
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

		let svc = new SvcBm(cmd, req.body, req, res, t);
		svc.updBm();
	});

	/*
	벌점 삭제
	*/
	app.post('/v1/delBm', function (req, res) {
		let cmd = '/v1/delBm';
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

		let svc = new SvcBm(cmd, req.body, req, res, t);
		svc.delBm();
	});
};
