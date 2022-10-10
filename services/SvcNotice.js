var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

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

		var sqltotcnt = MysqlConn.MAKESQL('notice', 'totCntNotice', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('notice', 'selNoticeList', param, _SqlFormat);

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
    } else {
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


  async addParents(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.parentid,
      category: 'Z',
      message: `${args.studentname} 학생의 학부모로 등록되었습니다`,
    };

    await this.insNotice(connection, param, true);
  }

  /*
  학부모 해제
  */
  async delParents(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.parentid,
      category: 'Z',
      message: `${args.studentname} 학생의 학부모에서 해제되었습니다`,
    };

    await this.insNotice(connection, param, true);
  }

  /*
  학부모 해제
  */
  async sendMessage(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'C',
      message: `${args.message}`,
    };

    await this.insNotice(connection, param, true);
  }


  /*
  벌점 부과
  */
  async addBlackmarkToSelf(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'B',
      message: `벌점(${args.blackmarkname}, ${args.point}점)이 부가되었습니다.`,
    };

    await this.insNotice(connection, param, false);
  }

  async addBlackmarkToParents(connection, args) {

    var parentparam = {
      memberid: args.memberid,
    }

    // 부모 목록 구하기
    var sql = MysqlConn.MAKESQL('parents', 'selParentsAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.studentname} 학생에게 벌점(${args.blackmarkname}, ${args.point}점)이 부가되었습니다.`,
        };

        await this.insNotice(connection, param, false);
      }

    }    
  }

  /*
  벌점 부과 취소
  */
  async cancelBlackmarkToSelf(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'B',
      message: `벌점(${args.blackmarkname}, ${args.point}점)이 취소되었습니다.`,
    };

    await this.insNotice(connection, param, false);
  }

  async cancelBlackmarkToParents(connection, args) {

    var parentparam = {
      memberid: args.memberid,
    }

    // 부모 목록 구하기
    var sql = MysqlConn.MAKESQL('parents', 'selParentsAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.studentname} 학생의 벌점(${args.blackmarkname}, ${args.point}점)이 취소되었습니다.`,
        };

        await this.insNotice(connection, param, false);
      }

    }    
  }


  /*
  학습계획 등록
  */
  async updStudyplanToSelf(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'B',
      message: `${args.plandate} 학습계획 결과가 반영되었습니다.`,
    };

    await this.insNotice(connection, param, true);
  }

  async updStudyplanToParents(connection, args) {

    var parentparam = {
      memberid: args.memberid,
    }

    // 부모 목록 구하기
    var sql = MysqlConn.MAKESQL('parents', 'selParentsAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.studentname} 학생의 ${args.plandate} 학습계획 결과가 반영되었습니다.`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }

  


}

module.exports = SvcNotice;
