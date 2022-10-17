var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');
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
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			page: this._body.page,
			length: this._body.length,
		};

		// paging
		if (this._body.page != undefined) {
			param.start = this._body.page * param.length;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL(
			'm2m',
			'totCntM2m',
			param,
			_SqlFormat,
		);
		var sql = MysqlConn.MAKESQL('m2m', 'selM2mList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let totcntrs = await connection.query(sqltotcnt);
			if (totcntrs[0].length == 1) {
				// 정상
				resdata.totcnt = totcntrs[0][0].totcnt;
				if((param.start + param.length) >= resdata.totcnt){
					resdata.remain = 0;
				} else {
					resdata.remain = 1;
				}
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
			}

			// 읽음
			let readUpdate = false;
			let rs = await connection.query(sql);
			if(rs[0].length > 0) {
				for (let i = 0; i < rs[0].length; i++) {
					if(rs[0][i].readyn === 'N'){
						// 한번이라도 업데이트 되면 다시 읽기위하여 플래그 셋
						readUpdate = true;
						// 읽음 처리
						var updparam = {
							noticeid: rs[0][i].noticeid,
						};
						var updsql = MysqlConn.MAKESQL('notice', 'readNotice', updparam, _SqlFormat);
						await connection.query(updsql);
					}
				}
			}

			if(readUpdate)
				rs = await connection.query(sql);

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

	async requestM2M() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			message: this._body.message,
		};

		_logger.debug(`${util.inspect(param)}`);
	
		var sql = MysqlConn.MAKESQL('member', 'memberInfo', param, _SqlFormat);
	
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 1:1 문의 등록
        var insparam = {
          branchid: param.branchid,
          memberid: param.memberid,
          question: param.message,
          answer: '',
          status: 'N',
        };
        var inssql = MysqlConn.MAKESQL('m2m', 'insM2m', insparam, _SqlFormat);
				await connection.query(inssql);
        

				// 관리자에게 알림
				let notice = {
					branchid: param.branchid,
					membername: rs[0][0].membername,
					message: param.message,
				};

				let svcNotice = new SvcNotice();
				await svcNotice.M2MToAdmin(connection, notice);

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


	async updateM2M() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			m2mid: this._body.m2mid,
			question: this._body.question,
			method: this._body.method,
		};

		_logger.debug(`${util.inspect(param)}`);
	
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			if(param.method == 'update') {
        var updsql = MysqlConn.MAKESQL('m2m', 'updM2m', param, _SqlFormat);
				await connection.query(updsql);
			} else if(param.method == 'delete') {
        var delsql = MysqlConn.MAKESQL('m2m', 'delM2m', param, _SqlFormat);
				await connection.query(delsql);
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

module.exports = SvcM2m;
