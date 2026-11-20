var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');

var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcTimetable = require('../services/SvcTimetable');

module.exports = function (app) {

	/*
	날짜별 시간표 (수능/평시)
	앱의 오늘 계획 입력, 홈, 학부모 오늘, 지난 계획 화면이 교시 이름을 그릴 때 사용
	*/
	app.all('/api/v1/timetable', JwtAuth, function (req, res) {
		let cmd = '/api/v1/timetable';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcTimetable(cmd, req.body, req, res, t);
		svc.timetable();
	});
};
