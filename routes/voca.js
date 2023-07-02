var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcVoca = require('../services/SvcVoca');

module.exports = function (app) {

	/*
	단어장 단어 목록 요청
	*/
	app.all('/api/v1/selVocaMemoList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selVocaMemoList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.selVocaMemoList();
	});

	/*
	테스트 단어 목록 요청
	*/
	app.all('/api/v1/selVocaTestList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selVocaTestList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.selVocaTestList();
	});

	/*
	단어시헝 테스트 요청
	*/
	app.all('/api/v1/requestVocaTest', JwtAuth, function (req, res) {
		let cmd = '/api/v1/requestVocaTest';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.requestVocaTest();
	});

	/*
	단어시헝 풀이 완료
	*/
	app.all('/api/v1/finishVocaTest', JwtAuth, function (req, res) {
		let cmd = '/api/v1/finishVocaTest';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.finishVocaTest();
	});

	/*
	단어 풀이 목록 요청
	*/
	app.all('/api/v1/selVocaSolveList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selVocaSolveList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcVoca(cmd, req.body, req, res, t);
		svc.selVocaSolveList();
	});
}
