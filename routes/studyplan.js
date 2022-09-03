var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcStudyPlan = require('../services/SvcStudyPlan');

module.exports = function (app) {

	/*
	학습계획 읽기
	*/
	app.all('/api/v1/todayStudyPlanList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/todayStudyPlanList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.todayStudyPlanList();
	});

	/*
	학습계획 읽기
	*/
	app.all('/api/v1/studyPlanList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/studyPlanList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		if(req.body.targetid != ''){
			req.body.memberid = req.body.targetid;
		}

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.studyPlanList();
	});

	/*

	/*
	학습계획 읽기(부모가)
	*/
	app.all('/api/v1/todayStudyPlanListByParent', function (req, res) {
		let cmd = '/api/v1/todayStudyPlanListByParent';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.todayStudyPlanList();
	});

	/*
	학습계획 결과 - 일자별
	*/
	app.all('/api/v1/achiveStudyPlanList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/achiveStudyPlanList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.achiveStudyPlanList();
	});


	/*
	학습계획 결과 - 일자별(부모가)
	*/
	app.all('/api/v1/achiveStudyPlanListByParent', function (req, res) {
		let cmd = '/api/v1/achiveStudyPlanListByParent';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.achiveStudyPlanList();
	});

	/*
	학습계획 결과 - 대시보드
	*/
	app.all('/api/v1/dashboardStudyPlan', JwtAuth, function (req, res) {
		let cmd = '/api/v1/dashboardStudyPlan';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.dashboardStudyPlan();
	});

	/*
	학습계획 결과 - 대시보드
	*/
	app.all('/api/v2/dashboardStudyPlan', JwtAuth, function (req, res) {
		let cmd = '/api/v2/dashboardStudyPlan';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.v2_dashboardStudyPlan();
	});

	/*
	학습계획 결과 - 대시보드(부모가)
	*/
	app.all('/api/v1/dashboardStudyPlanByParent', function (req, res) {
		let cmd = '/api/v1/dashboardStudyPlanByParent';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.dashboardStudyPlan();
	});

	/*
	학습계획 결과 - 대시보드(부모가)
	*/
	app.all('/api/v2/dashboardStudyPlanByParent', function (req, res) {
		let cmd = '/api/v2/dashboardStudyPlanByParent';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.v2_dashboardStudyPlan();
	});

	/*
	학습계획 저장
	*/
	app.all('/api/v1/regStudyPlanList', JwtAuth, function (req, res) {
		let cmd = '/api/v1/regStudyPlanList';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcStudyPlan(cmd, req.body, req, res, t);
		svc.regStudyPlanList();
	});
};
