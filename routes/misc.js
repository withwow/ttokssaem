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

	/*
	학생 정보 조회
	*/
	app.post('/api/v1/verifyID', function (req, res) {
		let cmd = '/api/v1/verifyID';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.verifyID();
	});	

	/*
	아이디 중복 조회
	*/
	app.post('/api/v1/checkMemberID', function (req, res) {
		let cmd = '/api/v1/checkMemberID';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.checkMemberID();
	});

	/*
	아이디 찾기
	*/
	app.post('/api/v1/findID', function (req, res) {
		let cmd = '/api/v1/findID';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.findID();
	});

	/*
	비밀번호 찾기
	*/
	app.post('/api/v1/findPW', function (req, res) {
		let cmd = '/api/v1/findPW';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.findPW();
	});
};
