var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcAuth = require('../services/SvcAuth');

module.exports = function (app) {
	/*
	로그 인
	*/
	app.post('/api/v1/login', function (req, res) {
		let cmd = '/api/v1/login';
		_logger.debug(`POST == ${cmd}`);
		
		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.login();
	});

	/*
	토큰 검사
	*/
	app.all('/api/v1/authcheck', JwtAuth, function (req, res) {
		let cmd = '/api/v1/authcheck';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.authcheck();
	});

	/*
	로그 아웃
	*/
	app.post('/api/v1/logout', JwtAuth, function (req, res) {
		let cmd = '/api/v1/logout';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.logout();
	});
};
