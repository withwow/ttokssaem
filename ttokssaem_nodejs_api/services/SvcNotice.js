var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");
var moment = require("moment");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcNotice {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selNoticeList() {
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
			'notice',
			'totCntNotice',
			param,
			_SqlFormat,
		);
		var sql = MysqlConn.MAKESQL('notice', 'selNoticeList', param, _SqlFormat);

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

	async todayNoticeList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('notice', 'todayNoticeList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

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

	async noticeAgree() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			noticeid: this._body.noticeid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('notice', 'noticeAgree', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
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



	/*

	*/

  /*
  알림 등록
  - 푸시전송 : sendpush --> true
  */
  async insNotice(connection, param, sendpush){
    // var param = {
    //   branchid: branchid,
    //   memberid: memberid,
    //   category: category,
    //   title: title
    //   message: message,
    // }

    if(param.category === 'A') {
      param.title = '출입관리';
    } else if(param.category === 'B') {
      param.title = '공지';
    } else if(param.category === 'C') {
      param.title = '문의사항';
    } else { // Z
      param.title = '기타';
    }

    var inssql = MysqlConn.MAKESQL('notice', 'insNotice', param, _SqlFormat);
    await connection.query(inssql);

    if(sendpush === true) {
      // token
      var sql = MysqlConn.MAKESQL('member', 'getMemberToken', param, _SqlFormat);
      let rs = await connection.query(sql);
      if(rs[0].length == 1) {

        _logger.debug(`TOKEN=[${rs[0][0].pushtoken}}]`);

        if(rs[0][0].pushtoken !== '') {

          var pushparam = {
            title: param.title,
            message: param.message,
            pushtoken: rs[0][0].pushtoken,
            linkurl: '',
            os: rs[0][0].os,
            reserved: 'I',
          }
          var pushsql = MysqlConn.MAKESQL('push', 'insPushsendmsg', pushparam, _SqlFormat);
          await connection.query(pushsql);
        }
      }
    }
  }

	

	async AttendanceToSelf(connection, args) {
    // 알림 등록

		// 시간
		var stamp = moment().format('HH시 mm분');

    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'A',
      message: `${stamp}에 ${args.enterance} 하였습니다.`,
    };

    await this.insNotice(connection, param, false);
  }

  async AttendanceToParents(connection, args) {


    var parentparam = {
      memberid: args.memberid,
    }

    // 부모 목록 구하기
    var sql = MysqlConn.MAKESQL('parents', 'selParentsAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

			// 시간
			var stamp = moment().format('HH시 mm분');

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록

        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'A',
          message: `${args.studentname} 학생이 ${stamp}에 ${args.enterance} 하였습니다.`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async AttendanceToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,			
      memberid: args.memberid,
    }

    // 부모 목록 구하기
		var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

			// 시간
			var stamp = moment().format('HH시 mm분');

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록

        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'A',
          message: `${args.studentname} 학생이 ${stamp}에 ${args.enterance} 하였습니다.`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async newMemberToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      membername: args.membername,
    }

    // 관리자 목록 구하기
    var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `신규로 ${args.membername} 회원가입 하였습니다.`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async M2MToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      message: args.message,
    }

    // 관리자 목록 구하기
    var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'C',
          message: `${args.membername} : ${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async requestVocaTestToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      message: args.message,
    }

    // 관리자 목록 구하기
    var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.membername} : ${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async finishVocaTestToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      message: args.message,
    }

    // 관리자 목록 구하기
    var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.membername} : ${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }
}

module.exports = SvcNotice;
