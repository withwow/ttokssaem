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

    await this.insNotice(connection, param, true);
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

        await this.insNotice(connection, param, true);
      }

    }    


  }
}

module.exports = SvcNotice;
