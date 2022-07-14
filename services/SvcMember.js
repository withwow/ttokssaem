var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
const Jwt = require('../common/Jwt');

var gmail = require('../common/gmail');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcMember {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async searchStudent() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			membername: this._body.membername,
		};

		var sql = MysqlConn.MAKESQL('member', 'searchStudent', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length > 0) {
				resdata = rs[0];
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

	async verifyID() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberno: this._body.memberno,
		};

		var sql = MysqlConn.MAKESQL('member', 'verifyID', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				resdata = rs[0];
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

	async checkMemberID() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
		};

		var sql = MysqlConn.MAKESQL('member', 'checkMemberId', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			resdata.length = rs[0].length;
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


	async joinMember() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memberpw: this._body.memberpw,
			type: this._body.type,
			membername: this._body.membername,
			schoolcode: '',
			schoolname: this._body.schoolname,
			grade: this._body.grade,
			gender: this._body.gender,
			contact: this._body.contact,
			email: this._body.email,
			marketing: 'Y',
			push: 'Y',
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('member', 'joinMember', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				resdata.lastid = rs[0].insertId;
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
			}

			connection.commit();
		} catch (err) {
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


	async findID() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			membername: this._body.membername,
			contact: this._body.contact,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('member', 'findID', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {

					let findID = rs[0][0].memberid.substr(0, 2) + '**' + rs[0][0].memberid.substr(4);

					_logger.debug(`FINDID == ${util.inspect(findID)}`);
					gmail.sendID(rs[0][0].email, findID);

   		} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
			}

			connection.commit();
		} catch (err) {
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

	async findPW() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
			membername: this._body.membername,
			contact: this._body.contact,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('member', 'findPW', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length > 0) {
				let newPassword = Math.floor(Math.random() * (9999 - 1000) + 1000);

				var setparam = {
					memberid: rs[0][0].memberid,
					memberpw: newPassword,
				};
	
				var inssql = MysqlConn.MAKESQL('member', 'setTempPassword', setparam, _SqlFormat);
				let insrs = await connection.query(inssql);
				if (insrs[0].affectedRows == 1) {
					_logger.debug(`NEW PASSWORD == ${util.inspect(newPassword)}`);
					gmail.sendTempPassword(rs[0][0].email, newPassword);
				} else {
					// 실패
					code = Code.Api.DB_ERROR_COMMAND.value;
				}

   		} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
			}

			connection.commit();
		} catch (err) {
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

module.exports = SvcMember;
