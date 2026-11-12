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
    } else if(param.category === 'C') {
      param.title = '문의사항';
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
  알림
  */
  async SendMeaageToEach(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'B',
      message: `${args.message}`,
    };

    await this.insNotice(connection, param, true);
  }

  async SendMeaageToParents(connection, args) {

    var parentparam = {
      branchid: args.branchid
    }

    // 부모회원 목록 구하기
    var sql = MysqlConn.MAKESQL('member', 'selParentsMember', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async SendMeaageToStudents(connection, args) {

    var parentparam = {
      branchid: args.branchid
    }

    // 학생 목록 구하기
    var sql = MysqlConn.MAKESQL('member', 'selStudentsMember', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }

  async SendMeaageToAll(connection, args) {

    var parentparam = {
      branchid: args.branchid
    }

    // 부모 목록 구하기
    var sql = MysqlConn.MAKESQL('member', 'selAllMember', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록
        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `${args.message}`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
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


  async addBlackmarkToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      memberid: args.memberid,
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
          message: `${args.studentname} 학생에게 벌점(${args.blackmarkname}, ${args.point}점)이 부가되었습니다.`,
        };

        await this.insNotice(connection, param, true);
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

    await this.insNotice(connection, param, true);
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

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async cancelBlackmarkToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,
      memberid: args.memberid,
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
          message: `${args.studentname} 학생의 벌점(${args.blackmarkname}, ${args.point}점)이 취소되었습니다.`,
        };

        await this.insNotice(connection, param, true);
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

  

  async beforeDaysToParents(connection, args) {


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
          // message: `(알림) ${args.studentname} 학생 만료일은 ${args.schdate}이며 ${args.beforedays}일전입니다.`,
          message: `(알림) ${args.studentname} 학생 ${args.schdate} 만료일입니다. 결제부탁드립니다. 좋은하루 되세요^^`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }


  async beforeDaysToAdmin(connection, args) {

    var parentparam = {
      branchid: args.branchid,			
      memberid: args.memberid,
    }

    // 부모 목록 구하기
		var sql = MysqlConn.MAKESQL('common', 'selAdminAll', parentparam, _SqlFormat);
    let rs = await connection.query(sql);
    if(rs[0].length > 0) {

      for(let i = 0; i < rs[0].length; i++){
        // 알림 등록

        var param = {
          branchid: args.branchid,
          memberid: rs[0][i].memberid,
          category: 'B',
          message: `(알림) ${args.studentname} 학생 ${args.schdate} 만료일입니다. 결제부탁드립니다. 좋은하루 되세요^^`,
        };

        await this.insNotice(connection, param, true);
      }

    }    
  }

  /*
  학습계획 등록
  */
  async starVocaTestToStudent(connection, args) {
    // 알림 등록
    var param = {
      branchid: args.branchid,
      memberid: args.memberid,
      category: 'B',
      message: `${args.memodate} - 테스트 요청이 승인되었습니다. 테스트를 진행하시기 바랍니다.`,
    };

    await this.insNotice(connection, param, true);
  }


  /*
  새벽 스케줄 초기화 결과를 운영자에게 푸시로 알림
  - 수신자: 환경변수 SCHEDULE_ALERT_MEMBERIDS (콤마 구분 memberid)
  - 알림 목록(notice)에는 남기지 않고 푸시 큐(pushsendmsg)에만 넣는다.
  - 초기화 트랜잭션과 분리된 별도 커넥션을 사용하므로, 초기화가 롤백돼도 실패 알림은 발송된다.
  - 예외를 밖으로 던지지 않는다.
  */
  async scheduleInitToOperator(result) {
    const memberids = String(process.env.SCHEDULE_ALERT_MEMBERIDS || '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '');

    if (memberids.length === 0) {
      _logger.warn('SCHEDULE INIT ALERT : SCHEDULE_ALERT_MEMBERIDS is not set, skip push');
      return 0;
    }

    const title = result.ok ? '스케줄 초기화 성공' : '스케줄 초기화 실패';
    const message = SvcNotice.makeScheduleInitMessage(result);

    let sent = 0;
    let connection = null;
    try {
      connection = await MysqlConn.pool.getConnection();

      for (const memberid of memberids) {
        var tokensql = MysqlConn.MAKESQL('member', 'getMemberToken', { memberid: memberid }, _SqlFormat);
        let rs = await connection.query(tokensql);
        if (rs[0].length !== 1 || rs[0][0].pushtoken === '') {
          _logger.warn(`SCHEDULE INIT ALERT : no push token for ${memberid}`);
          continue;
        }

        var pushparam = {
          title: title,
          message: message,
          pushtoken: rs[0][0].pushtoken,
          linkurl: '',
          os: rs[0][0].os,
          reserved: 'I',
        };
        var pushsql = MysqlConn.MAKESQL('push', 'insPushsendmsg', pushparam, _SqlFormat);
        await connection.query(pushsql);
        sent++;
      }
    } catch (err) {
      _logger.error(`SCHEDULE INIT ALERT ERROR : ${err && err.stack ? err.stack : err}`);
    } finally {
      if (connection) {
        try {
          connection.release();
        } catch (err) {}
      }
    }

    _logger.info(`SCHEDULE INIT ALERT : queued ${sent} push(es)`);
    return sent;
  }

  static makeScheduleInitMessage(result) {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const day = days[result.dayofweek] !== undefined ? `${days[result.dayofweek]}요일` : `요일(${result.dayofweek})`;
    const target = result.schdate ? `${result.schdate} ${day}` : day;

    if (!result.ok) {
      const error = String(result.error || '알 수 없는 오류').slice(0, 80);
      return `${target} 실행플랜 복구 실패. 확인이 필요합니다. (${error})`;
    }

    let message = `${target} 실행플랜 복구 완료 (삭제 ${result.deleted}건, 복사 ${result.inserted}건)`;
    if (result.inserted !== result.master) {
      message += ` - 마스터 ${result.master}건과 복사 건수가 다릅니다. 확인이 필요합니다.`;
    }
    return message;
  }

}

module.exports = SvcNotice;
