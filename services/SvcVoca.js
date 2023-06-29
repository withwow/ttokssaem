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

class SvcVoca {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async requestVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			membername: this._body.membername,
			memodate: this._body.memodate,
		};

		_logger.debug(`${util.inspect(param)}`);
	
		var sql = MysqlConn.MAKESQL('voca', 'requestVocaTest', param, _SqlFormat);
	
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
       
				// 관리자에게 알림
				let notice = {
					branchid: param.branchid,
					membername: param.membername,
					message: '단어장 테스트 요청합니다',
				};

				let svcNotice = new SvcNotice();
				await svcNotice.requestVocaTestToAdmin(connection, notice);

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

module.exports = SvcVoca;
