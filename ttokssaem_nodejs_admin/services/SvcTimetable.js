var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var moment = require('moment');

/*
 * 수능/평시 시간표
 *  - mode 는 "학습계획 날짜(plandate)" 기준으로 판정한다. (studyplan.class 의미가 mode 마다 다름)
 *  - timetable_period 에 plandate 를 포함하는 사용 중인 기간이 있으면 그 mode, 없으면 NORMAL
 *  - 테이블이 아직 없거나 조회에 실패해도 화면이 뜨도록 내장 평시 시간표로 대체한다.
 */

const MODE_NORMAL = 'NORMAL';
const BRANCH_ALL = 'ALL';

// DB 시드와 동일. DB 조회 실패 시에만 사용
const DEFAULT_SLOTS = {
	NORMAL: [
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
	],
};

// 02시까지 전날 영업 (앱/어드민 공통 규칙)
function businessToday() {
	return moment().subtract(2, 'hours').format('YYYYMMDD');
}

// 'YYYY-MM-DD' | 'YYYYMMDD' -> 'YYYYMMDD', 잘못된 날짜면 null
function normalizeDate(value) {
	if (value === undefined || value === null) return null;
	let str = String(value).replace(/-/gi, '').trim();
	if (!/^\d{8}$/.test(str)) return null;
	if (!moment(str, 'YYYYMMDD', true).isValid()) return null;
	return str;
}

function toInt(value) {
	let n = parseInt(value, 10);
	return isNaN(n) ? null : n;
}

/*
 * plandate 의 시간표 조회 (다른 서비스에서도 사용)
 * return { plandate, mode, title, startdate, enddate, periodid, slots: [...] }
 */
async function resolveTimetable(connection, plandate, branchid) {
	let result = {
		plandate: plandate,
		mode: MODE_NORMAL,
		title: '',
		startdate: '',
		enddate: '',
		periodid: null,
		slots: DEFAULT_SLOTS.NORMAL,
	};

	if (!plandate) return result;

	try {
		let param = { plandate: plandate, branchid: branchid || BRANCH_ALL };
		let periodrs = await connection.query(MysqlConn.MAKESQL('timetable', 'selPeriodByDate', param, _SqlFormat));
		if (periodrs[0].length == 1) {
			let period = periodrs[0][0];
			result.mode = period.mode;
			result.title = period.title;
			result.startdate = period.startdate;
			result.enddate = period.enddate;
			result.periodid = period.periodid;
		}

		let slotrs = await connection.query(MysqlConn.MAKESQL('timetable', 'selSlotList', { mode: result.mode }, _SqlFormat));
		if (slotrs[0].length > 0) {
			result.slots = slotrs[0];
		} else {
			// 정의 안 된 mode 면 평시로
			result.mode = MODE_NORMAL;
			result.slots = DEFAULT_SLOTS.NORMAL;
		}
	} catch (err) {
		_logger.error(`resolveTimetable fallback NORMAL : ${err.message}`);
		result.mode = MODE_NORMAL;
		result.slots = DEFAULT_SLOTS.NORMAL;
	}

	return result;
}

/*
 * 기간 변경으로 "교시 표시가 바뀌는 날짜" 중 가장 이른 날짜
 * before/after : { startdate, enddate, useyn } (없으면 null)
 */
function firstChangedDate(before, after) {
	let b = before && before.useyn === 'Y' ? before : null;
	let a = after && after.useyn === 'Y' ? after : null;

	if (!b && !a) return null;
	if (!b) return a.startdate;
	if (!a) return b.startdate;

	if (b.startdate !== a.startdate) return b.startdate < a.startdate ? b.startdate : a.startdate;
	if (b.enddate !== a.enddate) {
		let earlierEnd = b.enddate < a.enddate ? b.enddate : a.enddate;
		return moment(earlierEnd, 'YYYYMMDD').add(1, 'days').format('YYYYMMDD');
	}
	return null;
}

class SvcTimetable {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	/*
	 * 날짜별 시간표 (학습계획 팝업)
	 */
	async selTimetable() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let plandate = normalizeDate(this._body.plandate) || businessToday();

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			resdata = await resolveTimetable(connection, plandate, this._body.session_branchid);
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

	/*
	 * 기간 목록 + 현재 상태 (시간표 기간 관리 화면)
	 */
	async selPeriodList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: BRANCH_ALL, // 1차: 전 지점 공통만 화면에 노출
		};
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		let today = businessToday();

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let totcntrs = await connection.query(MysqlConn.MAKESQL('timetable', 'totCntPeriod', param, _SqlFormat));
			resdata.draw = this._body.draw;
			resdata.totcnt = totcntrs[0][0].totcnt;

			let rs = await connection.query(MysqlConn.MAKESQL('timetable', 'selPeriodList', param, _SqlFormat));
			resdata.lists = rs[0].map(row => {
				let status = '종료';
				if (row.useyn !== 'Y') status = '사용안함';
				else if (today < row.startdate) status = '예정';
				else if (today <= row.enddate) status = '적용중';
				row.status = status;
				row.days = moment(row.enddate, 'YYYYMMDD').diff(moment(row.startdate, 'YYYYMMDD'), 'days') + 1;
				return row;
			});

			let current = await resolveTimetable(connection, today, BRANCH_ALL);
			let nextrs = await connection.query(
				MysqlConn.MAKESQL('timetable', 'selNextPeriod', { plandate: today, branchid: BRANCH_ALL }, _SqlFormat),
			);
			resdata.current = {
				today: today,
				mode: current.mode,
				title: current.title,
				startdate: current.startdate,
				enddate: current.enddate,
			};
			resdata.next = nextrs[0].length == 1 ? nextrs[0][0] : null;

			let slotrs = await connection.query(MysqlConn.MAKESQL('timetable', 'selSlotAll', {}, _SqlFormat));
			resdata.slots = slotrs[0];
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

	/*
	 * 입력 검증. 실패 시 메시지, 성공 시 null
	 */
	validate(param) {
		if (!param.title) return '제목을 입력해 주세요.';
		if (!param.startdate) return '시작일이 올바르지 않습니다.';
		if (!param.enddate) return '종료일이 올바르지 않습니다.';
		if (param.startdate > param.enddate) return '종료일은 시작일과 같거나 뒤여야 합니다.';
		if (param.useyn !== 'Y' && param.useyn !== 'N') return '사용여부가 올바르지 않습니다.';
		return null;
	}

	/*
	 * 기간 등록 / 수정 (periodid 있으면 수정)
	 *  - 같은 지점 범위에서 사용 중인 기간끼리 겹치면 거부
	 *  - 지난 날짜(오늘 포함)의 교시 표시가 바뀌면 confirm=Y 일 때만 저장
	 */
	async savePeriod() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let periodid = this._body.periodid !== undefined && this._body.periodid !== '' ? toInt(this._body.periodid) : null;
		var param = {
			periodid: periodid === null ? '' : String(periodid),
			branchid: BRANCH_ALL,
			mode: 'CSAT',
			title: String(this._body.title || '').trim().substring(0, 50),
			startdate: normalizeDate(this._body.startdate),
			enddate: normalizeDate(this._body.enddate),
			useyn: this._body.useyn || 'Y',
			memo: String(this._body.memo || '').substring(0, 200),
			reguserid: this._body.session_userid,
		};

		_logger.debug(`${util.inspect(param)}`);

		if (this._body.periodid !== undefined && this._body.periodid !== '' && periodid === null) {
			this._res.json(new Response(this._cmd, Code.Api.FORMAT_ERROR.value, { message: '잘못된 요청입니다.' }, this._t).build());
			return;
		}

		let message = this.validate(param);
		if (message) {
			this._res.json(new Response(this._cmd, Code.Api.FORMAT_ERROR.value, { message: message }, this._t).build());
			return;
		}

		let today = businessToday();

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let before = null;
			if (periodid !== null) {
				let beforers = await connection.query(MysqlConn.MAKESQL('timetable', 'selPeriod', param, _SqlFormat));
				if (beforers[0].length != 1 || beforers[0][0].branchid !== BRANCH_ALL) {
					code = Code.Api.NOT_FOUND.value;
					resdata.message = '기간을 찾을 수 없습니다.';
				} else {
					before = beforers[0][0];
				}
			}

			if (code == Code.Api.OK.value && param.useyn === 'Y') {
				let overlaprs = await connection.query(MysqlConn.MAKESQL('timetable', 'cntOverlapPeriod', param, _SqlFormat));
				if (overlaprs[0][0].cnt > 0) {
					code = Code.Api.ALREDY_EXIST.value;
					resdata.message = '사용 중인 다른 기간과 날짜가 겹칩니다.';
				}
			}

			if (code == Code.Api.OK.value) {
				let changed = firstChangedDate(before, param);
				if (changed && changed <= today && this._body.confirm !== 'Y') {
					code = Code.Api.NEED_CONFIRM.value;
					resdata.message =
						`${moment(changed, 'YYYYMMDD').format('YYYY-MM-DD')}부터 오늘까지 이미 입력된 학습계획의 교시 표시가 바뀝니다. 계속할까요?`;
				}
			}

			if (code == Code.Api.OK.value) {
				let sqlid = periodid === null ? 'insPeriod' : 'updPeriod';
				let rs = await connection.query(MysqlConn.MAKESQL('timetable', sqlid, param, _SqlFormat));
				if (rs[0].affectedRows == 1) {
					resdata.periodid = periodid === null ? rs[0].insertId : periodid;
				} else {
					code = Code.Api.DB_ERROR_COMMAND.value;
				}
			}
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

	/*
	 * 기간 삭제 : 지난 날짜에 영향을 주면 confirm=Y 필요
	 */
	async delPeriod() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let periodid = toInt(this._body.periodid);
		if (periodid === null) {
			this._res.json(new Response(this._cmd, Code.Api.FORMAT_ERROR.value, { message: '잘못된 요청입니다.' }, this._t).build());
			return;
		}

		var param = { periodid: String(periodid), branchid: BRANCH_ALL };
		let today = businessToday();

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let beforers = await connection.query(MysqlConn.MAKESQL('timetable', 'selPeriod', param, _SqlFormat));
			if (beforers[0].length != 1 || beforers[0][0].branchid !== BRANCH_ALL) {
				code = Code.Api.NOT_FOUND.value;
				resdata.message = '기간을 찾을 수 없습니다.';
			} else {
				let changed = firstChangedDate(beforers[0][0], null);
				if (changed && changed <= today && this._body.confirm !== 'Y') {
					code = Code.Api.NEED_CONFIRM.value;
					resdata.message = '이미 지난 날짜가 포함된 기간입니다. 삭제하면 그 날짜의 학습계획 교시 표시가 평시로 바뀝니다. 계속할까요?';
				}
			}

			if (code == Code.Api.OK.value) {
				let rs = await connection.query(MysqlConn.MAKESQL('timetable', 'delPeriod', param, _SqlFormat));
				if (rs[0].affectedRows != 1) code = Code.Api.DB_ERROR_COMMAND.value;
			}
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
SvcTimetable.normalizeDate = normalizeDate;
SvcTimetable.businessToday = businessToday;
SvcTimetable.firstChangedDate = firstChangedDate;

module.exports = SvcTimetable;
