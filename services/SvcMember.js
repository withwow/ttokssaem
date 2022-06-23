var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcMember {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selMemberList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			usertype: this._body.usertype,
			query: '',
		};

		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.mapper.getStatement(
			'member',
			'totCntMember',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'totCntMember', sqltotcnt);
		var sql = MysqlConn.mapper.getStatement(
			'member',
			'selMemberList',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'selMemberList', sql);

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

	async selMember() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.mapper.getStatement(
			'member',
			'selMember',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'selMember', sql);

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

	async insMember() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.mapper.getStatement(
			'member',
			'insMember',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'insMember', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				resdata.lastid = rs[0].insertId;
				connection.commit();
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
				connection.rollback();
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

	async updMember() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			nickname: this._body.nickname,
			email: this._body.email,
			exp_robot: this._body.exp_robot,
			exp_castle: this._body.exp_castle,
			gold: this._body.gold,
			gem: this._body.gem,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.mapper.getStatement(
			'member',
			'updMember',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'updMember', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				connection.commit();
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
				connection.rollback();
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

	async delMember() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			mobilephone: this._body.mobilephone,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.mapper.getStatement(
			'member',
			'delMember',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('member', 'delMember', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				connection.commit();
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
				connection.rollback();
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

module.exports = SvcMember;
