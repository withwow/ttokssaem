var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcCommon = require('../services/SvcCommon');
var SvcDashboard = require('../services/SvcDashboard');
var SvcSession = require('../services/SvcSession');
var CertStatus = require('../common/CertStatus');

module.exports = function (app) {

  	/*
	학생들 목록
	*/
	app.get('/v1/selStudentAll', function (req, res) {
		let cmd = '/v1/selStudentAll';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.query.session_branchid = svcSession.getBranchId();
		req.query.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcDashboard(cmd, req.query, req, res, t);
		svc.selStudentAll();
	});

	/*
	학생들 이벤트
	*/
	app.get('/v1/lastStudentStaus', function (req, res) {
		let cmd = '/v1/lastStudentStaus';
		_logger.debug(`GET == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.query.session_branchid = svcSession.getBranchId();
		req.query.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.query));

		let svc = new SvcDashboard(cmd, req.query, req, res, t);
		svc.lastStudentStaus();
	});

	/*
	사이트 SSL 인증서 상태 (본사 관리자만)
	로그인과 분리된 별도 요청이다. 확인에 실패해도 예외 없이 'unknown'으로 응답한다.
	*/
	app.get('/v1/certStatus', function (req, res) {
		let cmd = '/v1/certStatus';
		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		if (!svcSession.isLogin()) {
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}
		if (svcSession.getBranchId() !== 'BR00000000') {
			res.json(new Response(cmd, '403', {}, t).build());
			return;
		}

		CertStatus.checkAll()
			.then(function (list) {
				res.json(new Response(cmd, '0', { list: list, warnDays: CertStatus.WARN_DAYS, dangerDays: CertStatus.DANGER_DAYS }, t).build());
			})
			.catch(function (e) {
				_logger.error(`${cmd} ${e && e.message}`);
				res.json(new Response(cmd, '0', { list: [] }, t).build());
			});
	});
};
