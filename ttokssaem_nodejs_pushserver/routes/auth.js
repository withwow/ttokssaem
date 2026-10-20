var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var bodyParser = require('../common/bodyParser').convBody;
var SvcAuth = require('../services/SvcAuth');

module.exports = function (app) {
	/*
	로그 인
	*/
	app.post('/signin', bodyParser, function (req, res) {
		let cmd = '/signin';
		_logger.debug(`POST == ${cmd}`);
		_logger.debug(util.inspect(req.body));

		var t = new ElapsedTimer();

		let svc = new SvcAuth(cmd, req.body, req, res, t);
		svc.signin();
	});
};
