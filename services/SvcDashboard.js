var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var moment = require('moment');

var SvcNotice = require('../services/SvcNotice');

class SvcDashboard {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selStudentAll() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			type: 'S',
			classyn: 'Y',
			sortorder: '',
			dir: ''
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('member', 'selStudentList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.lists = rs[0];
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


	async lastStudentStaus() {
		let resdata = {};
		let code = Code.Api.OK.value;

		// 2시간 빼서 새벽 2시까지 대응하자
		let today = moment().add(-2, 'hours');
		let lastdate = today.format('YYYYMMDD060000');

		var param = {
			session_branchid: this._body.session_branchid,
			lastdate: lastdate,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('attendance', 'lastAttendanceStaus', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.attendance = rs[0];

			let runtimeplans = [];
			let dayofweek = today.day();

			var studentparam = {
				session_branchid: param.session_branchid,
				type: 'S',
				classyn: 'Y',
				sortorder: '',
				dir: ''
			};
			var studentsql = MysqlConn.MAKESQL('member', 'selStudentList', studentparam, _SqlFormat);
			let studentrs = await connection.query(studentsql);
			for(let i = 0; i < studentrs[0].length; i++) {

				var planparam = {
					branchid: param.session_branchid,
					dayofweek: dayofweek,
					memberid: studentrs[0][i].memberid,
				};
				var plansql = MysqlConn.MAKESQL('attendance', 'lastRuntimePlanStaus', planparam, _SqlFormat);
				let planrs = await connection.query(plansql);
				for(let j = 0; j < planrs[0].length; j++) {
					let obj = {};
					obj.idx = j;
					obj.memberid = planrs[0][j].memberid;
					obj.method = planrs[0][j].method;
					obj.hour = planrs[0][j].hour;
					obj.status = planrs[0][j].status;
					runtimeplans.push(obj);
				}
			}

			resdata.runtimeplans = runtimeplans;

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

module.exports = SvcDashboard;
