var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var SvcTimetable = require('../services/SvcTimetable');
var SvcSession = require('../services/SvcSession');

module.exports = function (app) {
	function checkLogin(cmd, req, res, t) {
		let svcSession = new SvcSession(req);
		if (!svcSession.isLogin()) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return null;
		}
		return svcSession;
	}

	/*
	날짜별 시간표 (학습계획 팝업에서 plandate 기준 수능/평시 판정)
	*/
	app.post('/v1/selTimetable', function (req, res) {
		let cmd = '/v1/selTimetable';
		_logger.debug(`POST == ${cmd}`);
		var t = new ElapsedTimer();

		let svcSession = checkLogin(cmd, req, res, t);
		if (!svcSession) return;
		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcTimetable(cmd, req.body, req, res, t);
		svc.selTimetable();
	});

	/*
	시간표 기간 목록
	*/
	app.get('/v1/selTimetablePeriodList', function (req, res) {
		let cmd = '/v1/selTimetablePeriodList';
		_logger.debug(`GET == ${cmd}`);
		var t = new ElapsedTimer();

		let svcSession = checkLogin(cmd, req, res, t);
		if (!svcSession) return;

		let svc = new SvcTimetable(cmd, req.query, req, res, t);
		svc.selPeriodList();
	});

	/*
	시간표 기간 등록/수정
	*/
	app.post('/v1/saveTimetablePeriod', function (req, res) {
		let cmd = '/v1/saveTimetablePeriod';
		_logger.debug(`POST == ${cmd}`);
		var t = new ElapsedTimer();

		let svcSession = checkLogin(cmd, req, res, t);
		if (!svcSession) return;
		let permission = svcSession.getPermission('/timetable');
		let isupdate = req.body.periodid !== undefined && req.body.periodid !== '';
		if ((isupdate && permission.upd !== 'Y') || (!isupdate && permission.reg !== 'Y')) {
			res.json(new Response(cmd, '404', { message: '권한이 없습니다.' }, t).build());
			return;
		}
		req.body.session_userid = svcSession.getUserId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcTimetable(cmd, req.body, req, res, t);
		svc.savePeriod();
	});

	/*
	시간표 기간 삭제
	*/
	app.post('/v1/delTimetablePeriod', function (req, res) {
		let cmd = '/v1/delTimetablePeriod';
		_logger.debug(`POST == ${cmd}`);
		var t = new ElapsedTimer();

		let svcSession = checkLogin(cmd, req, res, t);
		if (!svcSession) return;
		if (svcSession.getPermission('/timetable').del !== 'Y') {
			res.json(new Response(cmd, '404', { message: '권한이 없습니다.' }, t).build());
			return;
		}

		_logger.debug(util.inspect(req.body));

		let svc = new SvcTimetable(cmd, req.body, req, res, t);
		svc.delPeriod();
	});
};
