var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');
var SvcNotice = require('../services/SvcNotice');

class SvcPush {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async sendPushMessage() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			session_userid: this._body.session_userid,
      target: this._body.target,
			memberid: this._body.memberid,
      message: this._body.message,
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

        if( param.target == 'A' ) {
          // 전부
          let notice = {
            branchid: param.session_branchid,
            message: param.message,
          };

          let svcNotice = new SvcNotice();
          await svcNotice.SendMeaageToAll(connection, notice);  
        } else if( param.target == 'E' ) {
          // 개별
          let notice = {
            branchid: param.session_branchid,
            memberid: param.memberid,
            message: param.message,
          };

          let svcNotice = new SvcNotice();
          await svcNotice.SendMeaageToEach(connection, notice);      
        } else if( param.target == 'P' ) {
          // 부모님들
          let notice = {
            branchid: param.session_branchid,
            message: param.message,
          };

          let svcNotice = new SvcNotice();
          await svcNotice.SendMeaageToParents(connection, notice);  
        } else if( param.target == 'S' ) {
          // 학생들
          let notice = {
            branchid: param.session_branchid,
            message: param.message,
          };

          let svcNotice = new SvcNotice();
          await svcNotice.SendMeaageToStudents(connection, notice);  
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

module.exports = SvcPush;
