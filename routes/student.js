var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcStudent = require('../services/SvcStudent');

module.exports = function (app) {

	/*
	알림 읽기
	*/
	app.all('/api/v1/selStudentList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selStudentList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudent(cmd, req.body, req, res, t);
		svc.selStudentList();
	});

};
