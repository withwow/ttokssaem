var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcGameAuth = require('../services/SvcGameAuth');
var SvcIap = require('../services/SvcIap');

module.exports = function (app) {
	/*
	로그 인
	*/
	app.post('/api/v1/login', function (req, res) {
		let cmd = '/api/v1/login';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcGameAuth(cmd, req.body, req, res, t);
		svc.login();
	});

	/*
	토큰 검사
	*/
	app.all('/api/v1/authcheck', JwtAuth, function (req, res) {
		let cmd = '/api/v1/authcheck';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcGameAuth(cmd, req.body, req, res, t);
		svc.authcheck();
	});

	/*
	유저 정보
	*/
	app.post('/api/v1/userinfo', JwtAuth, function (req, res) {
		let cmd = '/api/v1/userinfo';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));
		_logger.debug(util.inspect(JwtAuth));

		var t = new ElapsedTimer();

		let svc = new SvcGameAuth(cmd, req.body, req, res, t);
		svc.userinfo();
	});

	/*
	로그 아웃
	*/
	app.post('/api/v1/logout', JwtAuth, function (req, res) {
		let cmd = '/api/v1/logout';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcGameAuth(cmd, req.body, req, res, t);
		svc.logout();
	});
};
