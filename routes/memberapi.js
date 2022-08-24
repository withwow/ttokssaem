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

		/*
	회원 가입
	*/
	app.post('/api/v2/joinMember', function (req, res) {
		let cmd = '/api/v2/joinMember';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(`POST == ${util.inspect(req.body)}`);

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.v2_joinMember();
	});

	/*
	회원 정보
	*/
	app.post('/api/v1/memberInfo', JwtAuth, function (req, res) {
		let cmd = '/api/v1/memberInfo';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.memberInfo();
	});

	/*
	푸시 정보
	*/
	app.post('/api/v1/updatePush', JwtAuth, function (req, res) {
		let cmd = '/api/v1/updatePush';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.updatePush();
	});

	/*
	비밀번호 업데이트
	*/
	app.post('/api/v1/updatePassword', JwtAuth, function (req, res) {
		let cmd = '/api/v1/updatePassword';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.updatePassword();
	});

	/*
	멤버정보 업데이트
	*/
	app.post('/api/v1/updateMemberInfo', JwtAuth, function (req, res) {
		let cmd = '/api/v1/updateMemberInfo';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.updateMemberInfo();
	});

	/*
	탈퇴신청
	*/
	app.post('/api/v1/withdraw', JwtAuth, function (req, res) {
		let cmd = '/api/v1/withdraw';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcMember(cmd, req.body, req, res, t);
		svc.withdraw();
	});
};
