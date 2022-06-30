var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcGameAuth {
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
		};

		var sql = MysqlConn.MAKESQL('gameauth', 'login', param, _SqlFormat);

		let connection = null;
		try {
			let method = 'Join';

			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 있으면 로그인
				let user = {};
				user.branchid = rs[0][0].branchid;
				user.memberid = rs[0][0].memberid;
				let jwtToken = await Jwt.sign(user);
				resdata = jwtToken;
			} else {
				// 실패
				code = Code.Api.DB_ERROR.value;
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
}

module.exports = SvcGameAuth;
