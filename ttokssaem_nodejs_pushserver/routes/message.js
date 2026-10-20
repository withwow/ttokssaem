var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var bodyParser = require('../common/bodyParser').convBody;
var SvcMessage = require('../services/SvcMessage');
var SvcWebHook = require('../services/SvcWebHook');

module.exports = function (app) {
	/*
	푸시 전송
	*/
	app.post('/sendmessage', bodyParser, function (req, res) {
		let cmd = '/sendmessage';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcMessage(cmd, req.body, req, res, t);
		svc.sendmessage();
	});

	/*
	웹 훅 전송
	*/
	app.post('/sendwebhook', bodyParser, function (req, res) {
		let cmd = '/sendwebhook';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcWebHook(cmd, req.body, req, res, t);
		svc.sendwebhook();
	});
};
