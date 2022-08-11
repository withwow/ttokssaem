var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcStudent {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}


	async selStudentList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('student', 'selStudentList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let list = [];
			let parentsrs = await connection.query(sql);
			for (let i = 0; i < parentsrs[0].length; i++) {
				let student = {}
				student = parentsrs[0][i];

				var studentparam = {
					memberid: parentsrs[0][i].memberid,
				}
				var sql0 = MysqlConn.MAKESQL('studyplan', 'last0StudyPlan', studentparam, _SqlFormat);
				var sql1 = MysqlConn.MAKESQL('studyplan', 'last1StudyPlan', studentparam, _SqlFormat);

				let rs0 = await connection.query(sql0);
				let rs1 = await connection.query(sql1);
	
				let last0 = {};
				last0.plancount = rs0[0][0].plancount;
				last0.achievecount = rs0[0][0].achievecount;

				let last1 = {};
				last1.plancount = rs1[0][0].plancount;
				last1.achievecount = rs1[0][0].achievecount;

				student.last0 = last0;
				student.last1 = last1;
	
				list.push(student);
			}
			resdata.totcnt = list.length
			resdata.lists = list;

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

module.exports = SvcStudent;
