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

	async blackmark() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			goodsid: this._body.goodsid,
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


				connection.commit();
			} else {
				// 실패
				code = Code.Api.NOT_FOUND.value;
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

module.exports = SvcBlackmark;
