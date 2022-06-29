var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var SvcSession = require('../services/SvcSession');

class SvcCommon {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async getMax(table, prefix, length) {
		let ret = '';
		var param = {
			table: table,
		};

		// assign
		var sql = MysqlConn.MAKESQL('common', 'getMax', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 정상
				var s = rs[0][0].max + '';
				while (s.length < length) s = '0' + s;
				let pad = s;
				ret = `${prefix}${pad}`;
			}
		} catch (err) {
			// code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		return ret;
	}

	async login() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			userpw: this._body.userpw,
		};

		var sql = MysqlConn.MAKESQL('common', 'login', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 정상
				resdata.branchid = rs[0][0].branchid;
				resdata.branchname = rs[0][0].branchname;
				resdata.userid = rs[0][0].userid;
				resdata.username = rs[0][0].username;
				resdata.auth_id = rs[0][0].auth_id;
				resdata.auth = rs[0][0].auth;
				resdata.level = rs[0][0].level;

				// menulist
				var menuparam = {
					auth_id: resdata.auth_id,
				};
				var menusql = MysqlConn.MAKESQL(
					'common',
					'menu',
					menuparam,
					_SqlFormat,
				);

				let menurs = await connection.query(menusql);
				let menulist = menurs[0];

				// create session
				let svcSession = new SvcSession(this._req);
				svcSession.login(resdata.branchid, resdata.branchname, resdata.userid, resdata.username, resdata.auth_id, resdata.auth, resdata.level, menulist);
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


	async checkMemberId() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
		};

		var sql = MysqlConn.MAKESQL('common', 'checkMemberId', param, _SqlFormat);

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


	async logininfo() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let svcSession = new SvcSession(this._req);

		resdata.userid = svcSession.getUserId();
		resdata.username = svcSession.getUserName();
		resdata.permission = svcSession.getPermission();
		resdata.pwnotify = svcSession.getPwNotify();

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async logout() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let svcSession = new SvcSession(this._req);
		svcSession.logout();

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async changeCenterCode() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let svcSession = new SvcSession(this._req);
		svcSession.changeCenterCode(this._body.centercode);

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}
}

module.exports = SvcCommon;
