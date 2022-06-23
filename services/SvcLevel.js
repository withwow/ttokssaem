var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcLevel {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selLevelList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('level', 'selLevelList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			// 레벨 list
			let rs = await connection.query(sql);
			resdata.levels = rs[0];

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

	async levelclear() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			level: this._body.level,
			score: this._body.score,
		};

		_logger.debug(`${util.inspect(param)}`);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			// 레벨 찾기
			var sql = MysqlConn.MAKESQL('level', 'selLevel', param, _SqlFormat);

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 업데이트
				if (rs[0][0].score < param.score) {
					var updsql = MysqlConn.MAKESQL(
						'level',
						'updLevel',
						param,
						_SqlFormat,
					);
					await connection.query(updsql);
				}
			} else {
				// 신규 등록
				var inssql = MysqlConn.MAKESQL('level', 'insLevel', param, _SqlFormat);
				await connection.query(inssql);
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

	async userinfo() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			email: this._body.email,
			nickname: this._body.nickname,
		};

		var sql = MysqlConn.MAKESQL('member', 'userinfo', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				resdata.userid = rs[0][0].userid;
				resdata.nickname = rs[0][0].nickname;
				resdata.email = rs[0][0].email;
				resdata.exp_robot = rs[0][0].exp_robot;
				resdata.exp_castle = rs[0][0].exp_castle;
				resdata.gold = rs[0][0].gold;
				resdata.gem = rs[0][0].gem;

				resdata.level = [];
				resdata.robot = [];
				resdata.castle = [];
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
}

module.exports = SvcLevel;
