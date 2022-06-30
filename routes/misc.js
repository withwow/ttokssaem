var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcMember = require('../services/SvcMember');

module.exports = function (app) {
	/*
	학생 정보 조회
	*/
	app.post('/api/v1/searchStudent', function (req, res) {
		let cmd = '/api/v1/searchStudent';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.searchStudent();
	});

};
