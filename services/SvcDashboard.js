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
		let lastdate = today.format('YYYYMMDD030000');
		let dayofweek = today.day();

		var param = {
			session_branchid: this._body.session_branchid,
			type: 'S',
			classyn: 'Y',
			lastdate: lastdate,
			dayofweek: dayofweek
		};

		_logger.debug(`${util.inspect(param)}`);

		var ordersql = MysqlConn.MAKESQL('member', 'selStudentSortOrderList', param, _SqlFormat);
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let orderrs = await connection.query(ordersql);
			resdata.students = orderrs[0];
			
			var sql = MysqlConn.MAKESQL('attendance', 'lastAttendanceStaus', param, _SqlFormat);
			let rs = await connection.query(sql);
			resdata.attendance = rs[0];

			var runtimeplanparam = {
				branchid: param.session_branchid,
				dayofweek: dayofweek,				
			};

			var runtimeplansql = MysqlConn.MAKESQL('attendance', 'lastRuntimePlanStausEx', runtimeplanparam, _SqlFormat);
			let runtimeplanrs = await connection.query(runtimeplansql);

			let runtimeplans = [];
			let memberCountMap = {};
			for(let i = 0; i < runtimeplanrs[0].length; i++) {
				let row = runtimeplanrs[0][i];
				if (!memberCountMap[row.memberid]) {
					memberCountMap[row.memberid] = 0;
				}
				let obj = {};
				obj.idx = memberCountMap[row.memberid]++;
				obj.memberid = row.memberid;
				obj.method = row.method;
				obj.hour = row.hour;
				obj.minute = row.minute;
				obj.status = row.status;
				runtimeplans.push(obj);
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
