var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcMember = require('../services/SvcMember');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	/*
	일반회원 목록
	*/
	app.get('/v1/selMemberList', function (req, res) {
		let cmd = '/v1/selMemberList';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcMember(cmd, req.query, req, res, t);
		svc.selMemberList();
	});

	/*
	일반회원 정보
	*/
	app.post('/v1/selMember', function (req, res) {
		let cmd = '/v1/selMember';
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

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.selMember();
	});

	/*
	일반회원 등록
	*/
	app.post('/v1/insMember', function (req, res) {
		let cmd = '/v1/insMember';
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

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.insMember();
	});

	/*
	일반회원 수정
	*/
	app.post('/v1/updMember', function (req, res) {
		let cmd = '/v1/updMember';
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

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.updMember();
	});

	/*
	일반회원 삭제
	*/
	app.post('/v1/delMember', function (req, res) {
		let cmd = '/v1/delMember';
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

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.delMember();
	});
};
