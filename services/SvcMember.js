var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
const Jwt = require('../common/Jwt');

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

}

module.exports = SvcMember;
