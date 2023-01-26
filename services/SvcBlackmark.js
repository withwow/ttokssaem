var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcNotice = require('../services/SvcNotice');

class SvcBlackmark {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selBlackmarkList() {
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

		var sqltotcnt = MysqlConn.MAKESQL('blackmark', 'totCntBlackmark', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('blackmark', 'selBlackmarkList', param, _SqlFormat);

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


	async loadLastBlackmarks() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('blackmark', 'loadLastBlackmarks', param, _SqlFormat);

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

	async blackmark() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			blackmark: this._body.blackmark,
			blackmarkname: this._body.blackmarkname,
			point: this._body.point,
			reason: this._body.reason,
			memberid: this._body.memberid,
			membername: this._body.membername,
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
				var inssql = MysqlConn.MAKESQL('blackmark', 'insBlackmark', param, _SqlFormat);
				await connection.query(inssql);

				// 부모에게 알림
				let notice = {
					branchid: param.session_branchid,
					memberid: param.memberid,
					studentname: param.membername,
					blackmarkname: param.blackmarkname,
					point: param.point,
				};

				let svcNotice = new SvcNotice();

				await svcNotice.addBlackmarkToSelf(connection, notice);
				await svcNotice.addBlackmarkToParents(connection, notice);
				await svcNotice.addBlackmarkToAdmin(connection, notice);

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


	async cancelblackmark() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			blackmarkid: this._body.blackmarkid,
			memberid: this._body.memberid,
			membername: this._body.membername,
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

				var selsql = MysqlConn.MAKESQL('blackmark', 'selBlackmark', param, _SqlFormat);
				let selrs = await connection.query(selsql);
				if (selrs[0].length == 1) {

					//벌점 이력 취소
					var cancelsql = MysqlConn.MAKESQL('blackmark', 'cancelBlackmark', param, _SqlFormat);
					await connection.query(cancelsql);

					// 부모에게 알림
					let notice = {
						branchid: param.session_branchid,
						memberid: param.memberid,
						studentname: param.membername,
						blackmarkname: selrs[0][0].blackmarkname,
						point: selrs[0][0].point,
					};

					let svcNotice = new SvcNotice();

					await svcNotice.cancelBlackmarkToSelf(connection, notice);
					await svcNotice.cancelBlackmarkToParents(connection, notice);
					await svcNotice.cancelBlackmarkToAdmin(connection, notice);

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
}

module.exports = SvcBlackmark;
