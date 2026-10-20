var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcAuth = require('../services/SvcAuth');
var SvcMenu = require('../services/SvcMenu');
var SvcAuthMenu = require('../services/SvcAuthMenu');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	/*
	AUTH 목록
	*/
	app.get('/v1/selAuthList', function (req, res) {
		let cmd = '/v1/selAuthList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcAuth(cmd, req.query, req, res, t);
		svc.selAuthList();
	});

	/*
	AUTH 정보
	*/
	app.post('/v1/selAuth', function (req, res) {
		let cmd = '/v1/selAuth';
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

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.selAuth();
	});

	/*
	AUTH 등록
	*/
	app.post('/v1/insAuth', async function (req, res) {
		let cmd = '/v1/insAuth';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		let common = new SvcCommon();
		let auth_id = await common.getMax('ttok.auth', 'AUTH', 8);
		req.body.auth_id = auth_id;

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.insAuth();
	});

	/*
	AUTH 수정
	*/
	app.post('/v1/updAuth', function (req, res) {
		let cmd = '/v1/updAuth';
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

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.updAuth();
	});

	/*
	AUTH 삭제
	*/
	app.post('/v1/delAuth', function (req, res) {
		let cmd = '/v1/delAuth';
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

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.delAuth();
	});

	/*
	MENU 목록
	*/
	app.get('/v1/selMenuList', function (req, res) {
		let cmd = '/v1/selMenuList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcMenu(cmd, req.query, req, res, t);
		svc.selMenuList();
	});

	/*
	MENU 정보
	*/
	app.post('/v1/selMenu', function (req, res) {
		let cmd = '/v1/selMenu';
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

		let svc = new SvcMenu(cmd, req.body, req, res, t);
		svc.selMenu();
	});

	/*
	MENU 등록
	*/
	app.post('/v1/insMenu', async function (req, res) {
		let cmd = '/v1/insMenu';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		let common = new SvcCommon();
		let menu_id = await common.getMax('ttok.menu', 'MENU', 8);
		req.body.menu_id = menu_id;

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMenu(cmd, req.body, req, res, t);
		svc.insMenu();
	});

	/*
	MENU 수정
	*/
	app.post('/v1/updMenu', function (req, res) {
		let cmd = '/v1/updMenu';
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

		let svc = new SvcMenu(cmd, req.body, req, res, t);
		svc.updMenu();
	});

	/*
	MENU 삭제
	*/
	app.post('/v1/delMenu', function (req, res) {
		let cmd = '/v1/delMenu';
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

		let svc = new SvcMenu(cmd, req.body, req, res, t);
		svc.delMenu();
	});

	/*
	AUTH,MENU 목록
	*/
	app.get('/v1/selAuthMenuList', function (req, res) {
		let cmd = '/v1/selAuthMenuList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcAuthMenu(cmd, req.query, req, res, t);
		svc.selAuthMenuList();
	});

	/*
	AUTH,MENU 저장
	*/
	app.post('/v1/regAuthMenu', function (req, res) {
		let cmd = '/v1/regAuthMenu';
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

		let svc = new SvcAuthMenu(cmd, req.body, req, res, t);
		svc.regAuthMenu();
	});

};
