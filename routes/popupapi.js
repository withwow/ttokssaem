var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcPayment = require('../services/SvcPayment');
var SvcBlackmark = require('../services/SvcBlackmark');
var SvcSession = require('../services/SvcSession');
var SvcAffair = require('../services/SvcAffair');
var SvcSchedule = require('../services/SvcSchedule');
var SvcCalendar = require('../services/SvcCalendar');

module.exports = function (app) {

	/*
	스케쥴 상태 변경
	*/
	app.post('/v1/changeNextStatus', function (req, res) {
		let cmd = '/v1/changeNextStatus';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcSchedule(cmd, req.body, req, res, t);
		svc.changeNextStatus();
	});


	/*
	결제
	*/
	app.post('/v1/payment', function (req, res) {
		let cmd = '/v1/payment';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		let paymentdate = req.body.paymentdate.split(' - ');
		req.body.startdate = paymentdate[0].replace(/-/g, '');
		req.body.enddate = paymentdate[1].replace(/-/g, '');

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcPayment(cmd, req.body, req, res, t);
		svc.payment();
	});

	/*
	벌점
	*/
	app.post('/v1/blackmark', function (req, res) {
		let cmd = '/v1/blackmark';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcBlackmark(cmd, req.body, req, res, t);
		svc.blackmark();
	});


	/*
	벌점 취소
	*/
	app.post('/v1/cancelblackmark', function (req, res) {
		let cmd = '/v1/cancelblackmark';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcBlackmark(cmd, req.body, req, res, t);
		svc.cancelblackmark();
	});

	/*
	학사
	*/
	app.post('/v1/affair', function (req, res) {
		let cmd = '/v1/affair';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAffair(cmd, req.body, req, res, t);
		svc.affair();
	});

	app.post('/v1/attendanceByPass', function (req, res) {
		let cmd = '/v1/attendanceByPass';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcAffair(cmd, req.body, req, res, t);
		svc.attendanceByPass();
	});



	app.post('/v1/calendarEnterance', function (req, res) {
		let cmd = '/v1/calendarEnterance';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcCalendar(cmd, req.body, req, res, t);
		svc.calendarEnterance();
	});


	app.post('/v1/calendarMemo', function (req, res) {
		let cmd = '/v1/calendarMemo';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcCalendar(cmd, req.body, req, res, t);
		svc.calendarMemo();
	});	



	app.post('/v1/calendarPayment', function (req, res) {
		let cmd = '/v1/calendarPayment';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcCalendar(cmd, req.body, req, res, t);
		svc.calendarPayment();
	});	

	app.post('/v1/calendarInsMemo', function (req, res) {
		let cmd = '/v1/calendarInsMemo';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcCalendar(cmd, req.body, req, res, t);
		svc.calendarInsMemo();
	});	

	app.post('/v1/calendarDelMemo', function (req, res) {
		let cmd = '/v1/calendarDelMemo';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();
		req.body.userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcCalendar(cmd, req.body, req, res, t);
		svc.calendarDelMemo();
	});	
};
