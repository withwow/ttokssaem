var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcGameAuth = require('../services/SvcGameAuth');
var SvcIap = require('../services/SvcIap');

module.exports = function (app) {
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
	재화 업데아트
	*/
	app.post('/api/v1/iapcheck', JwtAuth, function (req, res) {
		let cmd = '/api/v1/iapcheck';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcIap(cmd, req.body, req, res, t);
		svc.iapcheck();
	});
};
