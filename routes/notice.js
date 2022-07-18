var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcNotice = require('../services/SvcNotice');

module.exports = function (app) {

	/*
	알림 읽기
	*/
	app.all('/api/v1/selNoticeList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selNoticeList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcNotice(cmd, req.body, req, res, t);
		svc.selNoticeList();
	});

};
