var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcVocaExam {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selVocaExamList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.session_branchid,
			query: this._body.search.value,
      sortorder: '',
			dir: '',
		};

    // order
		if (this._body.order != undefined) {
			param.sortorder = this._body.columns[this._body.order[0].column].data == '' ? this._body.columns[this._body.order[0].column].name : this._body.columns[this._body.order[0].column].data;
			param.dir = this._body.order[0].dir;
		}

		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL('vocaexam', 'totCntVocaExam', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('vocaexam', 'selVocaExamList', param, _SqlFormat);

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

	async selVocaExam() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			examid: this._body.examid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaexam', 'selVocaExam', param, _SqlFormat);

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

	async insVocaExam() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaexam', 'insVocaExam', param, _SqlFormat);

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

	async updVocaExam() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaexam', 'updVocaExam', param, _SqlFormat);

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

	async delVocaExam() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaexam', 'delVocaExam', param, _SqlFormat);

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

module.exports = SvcVocaExam;
