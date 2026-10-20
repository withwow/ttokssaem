var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcStudyplan = require('../services/SvcStudyplan');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {

	/*
	학습계획 목록
	*/
	app.post('/v1/selStudyplan', function (req, res) {
		let cmd = '/v1/selStudyplan';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.selStudyplan();
	});

	/*
	학습계획 반영
	*/
	app.post('/v1/updStudyplan', function (req, res) {
		let cmd = '/v1/updStudyplan';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.updStudyplan();
	});


	/*
	학습계획 등록
	*/
	app.post('/v1/insStudyplan', function (req, res) {
		let cmd = '/v1/insStudyplan';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.insStudyplan();
	});


	/*
	학습계획 다운로드 : 평시
	*/
	app.post('/v1/downloadStudyplan', function (req, res) {
		let cmd = '/v1/downloadStudyplan';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.downloadStudyplan();
	});

	/*
	학습계획 다운로드 : 수능
	*/
	app.post('/v1/downloadStudyplanEx', function (req, res) {
		let cmd = '/v1/downloadStudyplanEx';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.downloadStudyplanEx();
	});

	/*
	학습계획 등록 - 개별
	*/
	app.post('/v1/insEachItem', function (req, res) {
		let cmd = '/v1/insEachItem';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.insEachItem();
	});

	/*
	학습계획 삭제 - 개별
	*/
	app.post('/v1/delEachItem', function (req, res) {
		let cmd = '/v1/delEachItem';
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

		let svc = new SvcStudyplan(cmd, req.body, req, res, t);
		svc.delEachItem();
	});
};
