var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcMember = require('../services/SvcMember');

module.exports = function (app) {

	/*
	회원 가입
	*/
	app.post('/api/v1/joinMember', function (req, res) {
		let cmd = '/api/v1/joinMember';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(`POST == ${util.inspect(req.body)}`);

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.joinMember();
	});

};
