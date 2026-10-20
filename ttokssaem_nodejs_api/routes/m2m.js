var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcM2m = require('../services/SvcM2m');

module.exports = function (app) {

	/*
	알림 읽기
	*/
	app.all('/api/v1/selM2mList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selM2mList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcM2m(cmd, req.body, req, res, t);
		svc.selM2mList();
	});

	/*
	문의하기
	*/
	app.all('/api/v1/requestM2M', JwtAuth, function (req, res) {
		let cmd = '/api/v1/requestM2M';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcM2m(cmd, req.body, req, res, t);
		svc.requestM2M();
	});

	/*
	수정, 삭제하기
	*/
	app.all('/api/v1/updateM2M', JwtAuth, function (req, res) {
		let cmd = '/api/v1/updateM2M';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcM2m(cmd, req.body, req, res, t);
		svc.updateM2M();
	});
};
