var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('./SvcRedis');

class SvcAuth {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async signin() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			mobilephone: this._body.mobilephone,
			password: this._body.password,
		};

		var sql = MysqlConn.mapper.getStatement('auth', 'login', param, _SqlFormat);
		MysqlConn.SQL('auth', 'login', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			// transaction
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 있으면 로그인
				resdata = rs[0];

				// 업데이트 os, 토큰
				var updParam = {
					mobilephone: rs[0][0].mobilephone,
					os: this._body.os,
					pushtoken: this._body.pushtoken,
				};
				var updSql = MysqlConn.mapper.getStatement(
					'user',
					'upd_user',
					updParam,
					_SqlFormat,
				);
				MysqlConn.SQL('user', 'upd_user', updSql);
				await connection.query(updSql);
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
