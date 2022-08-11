var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

class SvcParents {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}
	async addParents() {
		this.insParents();
	}

	async insParents() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			parentid: this._body.parentid,
			userid: this._body.userid,
			userpw: this._body.userpw,
		};

		_logger.debug(`${util.inspect(param)}`);


		var loginsql = MysqlConn.MAKESQL('common', 'confirm', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let loginrs = await connection.query(loginsql);
			if (loginrs[0].length == 1) {
				// 로그인 정상

        // 벌점 이력 등록
				var inssql = MysqlConn.MAKESQL('parents', 'insParents', param, _SqlFormat);
				await connection.query(inssql);

				// 부모에게 알림

				connection.commit();
			} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
			}
      
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

	async delParents() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			parentid: this._body.parentid,
			userid: this._body.userid,
			userpw: this._body.userpw,
		};

		_logger.debug(`${util.inspect(param)}`);


		var loginsql = MysqlConn.MAKESQL('common', 'confirm', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let loginrs = await connection.query(loginsql);
			if (loginrs[0].length == 1) {
				// 로그인 정상

        // 벌점 이력 등록
				var inssql = MysqlConn.MAKESQL('parents', 'delParents', param, _SqlFormat);
				await connection.query(inssql);

				// 부모에게 알림

				connection.commit();
			} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
			}
      
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

module.exports = SvcParents;
