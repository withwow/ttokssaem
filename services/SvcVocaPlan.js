var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcVocaPlan {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selVocaPlanList() {
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
			param.sortorder = this._body.columns[this._body.order[0].column].data;
			param.dir = this._body.order[0].dir;
		}
		
		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL('vocaplan', 'totCntVocaPlan', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('vocaplan', 'selVocaPlanList', param, _SqlFormat);

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


	async loadVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'loadVocaPlan', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 정상
				resdata = rs[0][0];
			} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
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


	async saveVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			vocaplanid: this._body.vocaplanid,
			vocalevel: this._body.vocalevel,
			dayofweek: this._body.dayofweek,
			passrate: this._body.passrate,
			targetcount: this._body.targetcount,	
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

				var execsql = '';
				if(param.vocaplanid == '') {
					execsql = MysqlConn.MAKESQL('vocaplan', 'insVocaPlan', param, _SqlFormat);
				} else {
					execsql = MysqlConn.MAKESQL('vocaplan', 'updVocaPlan', param, _SqlFormat);
				}

				let rs = await connection.query(execsql);
				if (rs[0].affectedRows == 1) {
					// 정상
					if(param.vocaplanid == '') {
						resdata.lastid = rs[0].insertId;
					}
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

	async selVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			vocaplanid: this._body.vocaplanid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'selVocaPlan', param, _SqlFormat);

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

	async insVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			vocalevel: this._body.vocalevel,
			dayofweek: this._body.dayofweek,
			passrate: this._body.passrate,
			targetcount: this._body.targetcount,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'insVocaPlan', param, _SqlFormat);

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

	async updVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			vocaplanid: this._body.vocaplanid,
			vocalevel: this._body.vocalevel,
			dayofweek: this._body.dayofweek,
			passrate: this._body.passrate,
			targetcount: this._body.targetcount,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'updVocaPlan', param, _SqlFormat);

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

	async delVocaPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			vocaplanid: this._body.vocaplanid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'delVocaPlan', param, _SqlFormat);

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


	async setMemoPlan(memodate, dayofweek) {

		var param = {
			memodate : memodate,
			dayofweek : dayofweek
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocaplan', 'allVocaPlan', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length > 0) {
				// 정상
				_logger.debug(`LENGTH : ${rs[0].length}`);

				for(let i = 0; i < rs[0].length; i++) {
					// 오늘 것이 있다면 스킵
					param.memberid = rs[0][i].memberid;

					var checksql = MysqlConn.MAKESQL('vocaplan', 'checkVocaPlan', param, _SqlFormat);
					let checkrs = await connection.query(checksql);

					// 단어장 레벨, 목표개수
					let vocalevel = rs[0][i].vocalevel;
					let targetcount = rs[0][i].targetcount;
					let vocano = 0;

					if(checkrs[0].length == 0) {
						// 한번도 등록한 적 없음
						vocano = 1;
					} else {
						// 이미 있으면 오늘 날짜인지 보자고
						if (checkrs[0][0].memodate != param.memodate) {
							// 마지막 단어장 번호
							vocano = Number(checkrs[0][0].vocano) + Number(targetcount);
						}
					}

					if(vocano != 0) {

						var copyparam = {
							memberid : param.memberid,
							memodate : param.memodate,
							vocalevel : vocalevel,
							vocano : vocano,
							lastvocano : Number(vocano) + Number(targetcount),
						}
						var copysql = MysqlConn.MAKESQL('vocaplan', 'copyVocaToVocaMemo', copyparam, _SqlFormat);
						let copyrs = await connection.query(copysql);

						// 정상
						_logger.debug(`AFFECTED ROWS : ${copyrs[0].affectedRows}`);

						let lastyn = 'N';
						if(copyrs[0].affectedRows < targetcount)
							lastyn = 'Y';

						var insparam = {
							memberid : param.memberid,
							memodate : param.memodate,
							vocalevel : vocalevel,
							vocano : vocano,
							targetcount : targetcount,
							lastyn : lastyn
						};
						var inssql = MysqlConn.MAKESQL('vocaplan', 'insCheckVocaPlan', insparam, _SqlFormat);
						let insrs = await connection.query(inssql);
					}
				}

			}

			connection.commit();
		} catch (err) {
			connection.rollback();

			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

	}
}

module.exports = SvcVocaPlan;
