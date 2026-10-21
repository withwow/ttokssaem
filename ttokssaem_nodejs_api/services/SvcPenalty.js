var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

class SvcPenalty {
	constructor(cmd, body, req, res, t) {
		this._cmd = cmd;
		this._body = body;
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selPenaltyDetail() {
		let resdata = {};
		let code = Code.Api.OK.value;
		const page = Math.max(Number(this._body.page) || 0, 0);
		const length = Math.min(Math.max(Number(this._body.length) || 20, 1), 50);
		const requester = {
			memberid: this._body.memberid,
			branchid: this._body.branchid,
		};
		const requestedTargetId = String(this._body.targetid || '');

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			const requesterRs = await connection.query(MysqlConn.MAKESQL(
				'penalty', 'selRequester', requester, _SqlFormat,
			));
			if (requesterRs[0].length !== 1) {
				code = Code.Api.NOT_ACCESS.value;
				return;
			}

			const requesterInfo = requesterRs[0][0];
			let studentRs;
			if (requesterInfo.type === 'S') {
				if (requestedTargetId !== '' && requestedTargetId !== requester.memberid) {
					code = Code.Api.NOT_ACCESS.value;
					return;
				}
				studentRs = await connection.query(MysqlConn.MAKESQL(
					'penalty', 'selStudent', requester, _SqlFormat,
				));
			} else if (requesterInfo.type === 'P' && requestedTargetId !== '') {
				studentRs = await connection.query(MysqlConn.MAKESQL('penalty', 'selStudentForParent', {
					parentid: requester.memberid,
					targetid: requestedTargetId,
					branchid: requester.branchid,
				}, _SqlFormat));
			} else {
				code = Code.Api.NOT_ACCESS.value;
				return;
			}

			if (studentRs[0].length !== 1) {
				code = Code.Api.NOT_ACCESS.value;
				return;
			}

			const student = studentRs[0][0];
			const param = {
				memberid: student.memberid,
				branchid: requester.branchid,
				start: page * length,
				length: length,
			};
			const monthRs = await connection.query(MysqlConn.MAKESQL(
				'penalty', 'selMonthPenalty', param, _SqlFormat,
			));
			const cumulativeRs = await connection.query(MysqlConn.MAKESQL(
				'penalty', 'selCumulativePenalty', param, _SqlFormat,
			));
			const countRs = await connection.query(MysqlConn.MAKESQL(
				'penalty', 'totCntPenaltyHistory', param, _SqlFormat,
			));
			const historyRs = await connection.query(MysqlConn.MAKESQL(
				'penalty', 'selPenaltyHistory', param, _SqlFormat,
			));

			resdata.student = student;
			resdata.currentMonthPenalty = monthRs[0][0].monthpenalty;
			resdata.cumulativePenalty = cumulativeRs[0][0].cumulativePenalty;
			// 기존 앱 응답 호환성: 신규 필드 적용 전 버전은 monthpenalty를 사용한다.
			resdata.monthpenalty = resdata.currentMonthPenalty;
			resdata.totcnt = countRs[0][0].totcnt;
			resdata.remain = param.start + length >= resdata.totcnt ? 0 : 1;
			resdata.lists = historyRs[0];
		} catch (err) {
			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try { connection.release(); } catch (err) {}
			this._res.json(new Response(this._cmd, code, resdata, this._t).build());
		}
	}
}

module.exports = SvcPenalty;
