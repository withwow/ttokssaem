var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcMenu {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selMenuList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			query: this._body.search.value,
		};

		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL('menu', 'totCntMenu', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('menu', 'selMenuList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let totcntrs = await connection.query(sqltotcnt);
			if (totcntrs[0].length == 1) {
				// 정상
				resdata.draw = this._body.draw;
				resdata.totcnt = totcntrs[0][0].totcnt;
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
			}

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

	async selMenu() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			menu_id: this._body.menu_id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('menu', 'selMenu', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 정상
				resdata = rs[0][0];
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
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

	async insMenu() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			menu_id: this._body.menu_id,
			menu: this._body.menu,
			premenuid: this._body.premenuid,
			menusort: this._body.menusort,
			uri: this._body.uri,
			menulev: this._body.menulev,
			icon: this._body.icon,
			useyn: this._body.useyn,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('menu', 'insMenu', param, _SqlFormat);

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

	async updMenu() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			menu_id: this._body.menu_id,
			menu: this._body.menu,
			premenuid: this._body.premenuid,
			menusort: this._body.menusort,
			uri: this._body.uri,
			menulev: this._body.menulev,
			icon: this._body.icon,
			useyn: this._body.useyn,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('menu', 'updMenu', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
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

	async delMenu() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			menu_id: this._body.menu_id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('menu', 'delMenu', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
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
}

module.exports = SvcMenu;
