var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcAuthMenu {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selAuthMenuList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			auth_id: this._body.auth_id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL(
			'authmenu',
			'selAuthMenuList',
			param,
			_SqlFormat,
		);

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

	async regAuthMenu() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			auth_id: this._body.auth_id,
		};

		var delsql = MysqlConn.MAKESQL(
			'authmenu',
			'delAuthMenuList',
			param,
			_SqlFormat,
		);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			await connection.query(delsql);

			var objs = [];
			for (let i = 0; i < this._body.menu_id.length; i++) {
				let obj = {};
				obj.auth_id = this._body.auth_id;
				obj.menu_id = this._body.menu_id[i];
				obj.btn_read = this._body.btn_read[i];
				obj.btn_reg = this._body.btn_reg[i];
				obj.btn_upd = this._body.btn_upd[i];
				obj.btn_del = this._body.btn_del[i];
				obj.btn_xlsd = this._body.btn_xlsd[i];
				obj.btn_xlsu = this._body.btn_xlsu[i];

				objs.push(obj);
			}

			let insparam = {
				objs: objs,
			};

			var inssql = MysqlConn.MAKESQL(
				'authmenu',
				'regAuthMenuList',
				insparam,
				_SqlFormat,
			);

			await connection.query(inssql);

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

module.exports = SvcAuthMenu;
