var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
const Jwt = require('../common/Jwt');

var moment = require('moment');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');
var SvcNotice = require('../services/SvcNotice');

class SvcAttendance {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async verifyID() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberno: this._body.memberno,
		};

		var sql = MysqlConn.MAKESQL('member', 'verifyID', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
      connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				//resdata = rs[0];
        let enterance = 0;
        let branchid = param.branchid;
        let memberid = rs[0][0].memberid;
        let membername = rs[0][0].membername;
        /*
        입실/퇴실 처리
        */
        // 2시간 빼서 새벽 2시까지 대응하자
        let lastdate = moment().add(-2, 'hours').format('YYYYMMDD060000');
        let lastparam = {
          lastdate: lastdate,
          memberid: memberid,
        }
        var lastsql = MysqlConn.MAKESQL('attendance', 'lastAttendance', lastparam, _SqlFormat);
        let lastrs = await connection.query(lastsql);

        let attendparam = {
          branchid: branchid,
          memberid: memberid,
        };
        if(lastrs[0].length == 0){
          // 입장
          enterance = 0;
          attendparam.method = enterance;
            
        } else {
          if(lastrs[0][0].method === 0){
            // 퇴실
            enterance = 1;
            attendparam.method = enterance;
          } else {
            // 입실
            enterance = 0;
            attendparam.method = enterance;
          }
        }

        var inssql = MysqlConn.MAKESQL('attendance', 'insAttendance', attendparam, _SqlFormat);
        await connection.query(inssql);

        resdata.membername = membername;
        if(enterance === 0)
          resdata.enterance = '입실';
        else
          resdata.enterance = '퇴실';


				let notice = {
					branchid: branchid,
					memberid: memberid,
					studentname: membername,
					enterance: resdata.enterance
				};

				let svcNotice = new SvcNotice();
				await svcNotice.AttendanceToSelf(connection, notice);
				await svcNotice.AttendanceToParents(connection, notice);

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

module.exports = SvcAttendance;
