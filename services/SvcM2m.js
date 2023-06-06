var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');
var SvcNotice = require('../services/SvcNotice');

class SvcM2m {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}


	async selM2mList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			query: this._body.search.value,
      sortorder: '',
      dir: ''
		};

    // order
		if (this._body.order != undefined) {
			if(this._body.columns[this._body.order[0].column].name !== '')
				param.sortorder = this._body.columns[this._body.order[0].column].name;
			else
				param.sortorder = this._body.columns[this._body.order[0].column].data;
			param.dir = this._body.order[0].dir;
		}
		
		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL('m2m', 'totCntM2m', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('m2m', 'selM2mList', param, _SqlFormat);

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


	async selM2m() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			m2mid: this._body.m2mid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('m2m', 'selM2m', param, _SqlFormat);

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


	async answerM2M() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			m2mid: this._body.m2mid,
			answer: this._body.message,
			status: 'Y',
			answerid: this._body.userid,
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
				var checkesql = MysqlConn.MAKESQL('m2m', 'checkStatusM2M', param, _SqlFormat);
				let checkrs = await connection.query(checkesql);
				if (checkrs[0].length == 1) {
					var updatesql = MysqlConn.MAKESQL('m2m', 'answerM2M', param, _SqlFormat);
					await connection.query(updatesql);

					// 알림 보내기
					let notice = {
						branchid: param.branchid,
						memberid: param.memberid,
						message: param.answer,
					};

					let svcNotice = new SvcNotice();
					await svcNotice.SendMeaageToEach(connection, notice);
				} else {
					code = Code.Api.ALREDY_EXIST.value;
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


  async checkM2M() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
      session_branchid: this._body.session_branchid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('m2m', 'checkM2M', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.count = rs[0].length;
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

}

module.exports = SvcM2m;
