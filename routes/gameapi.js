var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcMember = require('../services/SvcMember');
var SvcLevel = require('../services/SvcLevel');
var SvcIap = require('../services/SvcIap');

module.exports = function (app) {
	/*
	유저 정보
	*/
	app.post('/api/v1/userinfo', JwtAuth, function (req, res) {
		let cmd = '/api/v1/userinfo';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));
		_logger.debug(util.inspect(JwtAuth));

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.userinfo();
	});

	/*
	인앱 영수증 검증
	*/
	app.post('/api/v1/iapcheck', JwtAuth, function (req, res) {
		let cmd = '/api/v1/iapcheck';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcIap(cmd, req.body, req, res, t);
		svc.iapcheck();
	});

	/*
	정보 수정
	*/
	app.post('/api/v1/updateuserinfo', JwtAuth, function (req, res) {
		let cmd = '/api/v1/updateuserinfo';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.updateuserinfo();
	});

	/*
	재화 더하기
	*/
	app.post('/api/v1/addproperty', JwtAuth, function (req, res) {
		let cmd = '/api/v1/addproperty';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.addproperty();
	});

	/*
	레벨 목록
	*/
	app.post('/api/v1/levels', JwtAuth, function (req, res) {
		let cmd = '/api/v1/levels';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcLevel(cmd, req.body, req, res, t);
		svc.selLevelList();
	});

	/*
	레벨 클리어
	*/
	app.post('/api/v1/levelclear', JwtAuth, function (req, res) {
		let cmd = '/api/v1/levelclear';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcLevel(cmd, req.body, req, res, t);
		svc.levelclear();
	});

	/*
	쿠폰
	*/
	app.post('/api/v1/usecoupon', JwtAuth, function (req, res) {
		let cmd = '/api/v1/usecoupon';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.usecoupon();
	});

};
