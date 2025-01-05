var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcAppChecker = require('../services/SvcAppChecker');

module.exports = function (app) {

	/*
	앱 체커
	*/
	app.post('/api/v1/appchecker', JwtAuth, function (req, res) {
		let cmd = '/api/v1/appchecker';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAppChecker(cmd, req.body, req, res, t);
		svc.appChecker();
	});

}
