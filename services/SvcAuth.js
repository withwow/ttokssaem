var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcAuth {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async login() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
			memberpw: this._body.memberpw,
			os: this._body.os,
			pushtoken: this._body.pushtoken,
		};

		var sql = MysqlConn.MAKESQL('auth', 'login', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				if(rs[0][0].accessyn !== 'Y'){
					// 실패
					code = Code.Api.NOT_ACCESS.value;
				} else {
					// Update os and pushtokoen to member 
					if(param.os !== 'editor'){
						var updsql = MysqlConn.MAKESQL('auth', 'updatePushToken', param, _SqlFormat);
						await connection.query(updsql);
					}

					// 있으면 로그인
					let user = {};
					user.branchid = rs[0][0].branchid;
					user.memberid = rs[0][0].memberid;
					let jwtToken = await Jwt.sign(user);
					resdata = jwtToken;
					resdata.type = rs[0][0].type;

					// 부모면 학생 리스트
					if(rs[0][0].type === 'P') {
						var studentsql = MysqlConn.MAKESQL('student', 'selStudentList', user, _SqlFormat);
						let studentrs = await connection.query(studentsql);
						resdata.students = studentrs[0];
					}
				}

			} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
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

	async logout() {
		let resdata = {};
		let code = Code.Api.OK.value;
		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async authcheck() {
		let resdata = {};
		let code = Code.Api.OK.value;
		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async version() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			os: this._body.os,
			version: this._body.version,
		};

		var sql = MysqlConn.MAKESQL('auth', 'version', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			// transaction
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 있으면 로그인

				let dbversion = rs[0][0].version.split('.');
				let reviewversion = rs[0][0].reviewversion;

				if (param.version == reviewversion) {
					resdata.version = 3; // 리뷰 버전
				} else {
					let argversion = param.version.split('.');

					resdata.version = 0;
					if (Number(dbversion[0]) > Number(argversion[0])) {
						resdata.version = 2; // Major
					} else if (Number(dbversion[1]) > Number(argversion[1])) {
						resdata.version = 2; // Major
					} else if (Number(dbversion[2]) > Number(argversion[2])) {
						resdata.version = 1; // Minor
					}
				}
			} else {
				// 없으면
				code = Code.Api.USER_NOT_FOUND.value;
			}

			// commit
			connection.commit();
		} catch (err) {
			// rollback
			connection.rollback();

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

module.exports = SvcAuth;
