var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var moment = require('moment');

/*
 * 수능/평시 시간표 (앱용)
 *  - 학습계획 날짜(plandate) 기준으로 판정. studyplan.class 의미가 시간표마다 다르기 때문
 *  - timetable_period 에 plandate 를 포함하는 사용 중인 기간이 있으면 그 mode, 없으면 NORMAL
 *  - 지점 전용 기간(branchid)이 전 지점 공통(ALL)보다 우선
 *  - 테이블이 없거나 조회에 실패해도 평시 시간표를 돌려준다 (어드민 SvcTimetable 과 같은 규칙)
 */

const MODE_NORMAL = 'NORMAL';

const DEFAULT_NORMAL_SLOTS = [
	{ class: 1, code: 'P1', label: '1교시', shortlabel: '1교시', timetext: '08:00 ~ 09:50' },
	{ class: 2, code: 'P2', label: '2교시', shortlabel: '2교시', timetext: '10:00 ~ 11:50' },
	{ class: 3, code: 'LUNCH', label: '점심시간', shortlabel: '점  심', timetext: '11:50 ~ 12:59' },
	{ class: 4, code: 'P3', label: '3교시', shortlabel: '3교시', timetext: '13:00 ~ 14:50' },
	{ class: 5, code: 'P4', label: '4교시', shortlabel: '4교시', timetext: '15:00 ~ 16:50' },
	{ class: 6, code: 'DINNER', label: '저녁시간', shortlabel: '저  녁', timetext: '16:50 ~ 17:59' },
	{ class: 7, code: 'P5', label: '5교시', shortlabel: '5교시', timetext: '18:00 ~ 19:50' },
	{ class: 8, code: 'P6', label: '6교시', shortlabel: '6교시', timetext: '20:00 ~ 21:50' },
	{ class: 9, code: 'P7', label: '7교시', shortlabel: '7교시', timetext: '22:00 ~ 23:50' },
	{ class: 10, code: 'P8', label: '8교시', shortlabel: '8교시', timetext: '24:00 ~ 01:00' },
];

// 'YYYY-MM-DD' | 'YYYYMMDD' -> 'YYYYMMDD'. 없거나 잘못되면 02시 기준 오늘
function normalizePlandate(value) {
	let str = String(value === undefined || value === null ? '' : value).replace(/-/gi, '').trim();
	if (/^\d{8}$/.test(str) && moment(str, 'YYYYMMDD', true).isValid()) return str;
	return moment().subtract(2, 'hours').format('YYYYMMDD');
}

async function resolveTimetable(connection, plandate, branchid) {
	let result = {
		plandate: plandate,
		mode: MODE_NORMAL,
		title: '',
		startdate: '',
		enddate: '',
		slots: DEFAULT_NORMAL_SLOTS,
	};

	try {
		let param = { plandate: plandate, branchid: branchid || 'ALL' };
		let periodrs = await connection.query(MysqlConn.MAKESQL('timetable', 'selPeriodByDate', param, _SqlFormat));
		if (periodrs[0].length == 1) {
			result.mode = periodrs[0][0].mode;
			result.title = periodrs[0][0].title;
			result.startdate = periodrs[0][0].startdate;
			result.enddate = periodrs[0][0].enddate;
		}

		let slotrs = await connection.query(MysqlConn.MAKESQL('timetable', 'selSlotList', { mode: result.mode }, _SqlFormat));
		if (slotrs[0].length > 0) {
			result.slots = slotrs[0];
		} else {
			result.mode = MODE_NORMAL;
			result.slots = DEFAULT_NORMAL_SLOTS;
		}
	} catch (err) {
		_logger.error(`resolveTimetable fallback NORMAL : ${err.message}`);
		result.mode = MODE_NORMAL;
		result.slots = DEFAULT_NORMAL_SLOTS;
	}

	return result;
}

class SvcTimetable {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	/*
	 * 날짜별 시간표
	 * req  : plandate (YYYYMMDD | YYYY-MM-DD, 없으면 02시 기준 오늘)
	 * res  : { plandate, mode, title, startdate, enddate, slots: [{ class, code, label, shortlabel, timetext }] }
	 */
	async timetable() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let plandate = normalizePlandate(this._body.plandate);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			resdata = await resolveTimetable(connection, plandate, this._body.branchid);
		} catch (err) {
			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}
}

SvcTimetable.resolveTimetable = resolveTimetable;

module.exports = SvcTimetable;
