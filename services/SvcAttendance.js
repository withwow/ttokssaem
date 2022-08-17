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
      via: this._body.via,
      userid: this._body.userid,
		};

    if(param.via === undefined) {
      param.via = 'device';
    }

    if(param.userid === undefined) {
      param.userid = '';
    }

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
        let today = moment().add(-2, 'hours');
        let lastdate = today.format('YYYYMMDD060000');
        let dayofweek = today.day();
        let lastparam = {
          lastdate: lastdate,
          memberid: memberid,
        }
        var lastsql = MysqlConn.MAKESQL('attendance', 'lastAttendance', lastparam, _SqlFormat);
        let lastrs = await connection.query(lastsql);

        let attendparam = {
          branchid: branchid,
          memberid: memberid,
          via: param.via,
          userid: param.userid,
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

        /*
        status <> 3, 2건 조회

        method - 입실 A군  : 0. 입실, 5. 복귀
        method - 퇴실 B군  : 1. 퇴실, 2. 중식, 3. 석식, 4.외출

        입실일때 : A군  -  9 -> 0
                     -  0 -> 0
                 B군  -  9 -> 9
                     -  1 -> 3
        퇴실일때 : A군  -  9 -> 9             
                     -  0 -> 3
                 B군  -  9 -> 1
                     -  1 -> 1
        */

        let applyPlan = [];

        var planparam = {
          branchid: branchid,
          memberid: memberid,
          dayofweek: dayofweek,
        };

        var plansql = MysqlConn.MAKESQL('attendance', 'lastRuntimePlanStaus', planparam, _SqlFormat);
        let planrs = await connection.query(plansql);

        for(let i = 0; i < planrs[0].length; i++) {
          if(enterance === 0) {
            // 입실일때
            if(planrs[0][i].method === 0 || planrs[0][i].method === 5) {
              // A군
              if(planrs[0][i].status === 9){
                // 9 -> 0
                let plan = {
                  masterplanid: planrs[0][i].masterplanid,
                  status: 0,
                }
                applyPlan.push(plan);
              }
              if(planrs[0][i].status === 0){
                // 0 -> 0 - 유지
              }
            } else {
              // B군
              if(planrs[0][i].status === 9){
                // 9 -> 9 - 유지
              }
              if(planrs[0][i].status === 1){
                // 1 -> 3
                let plan = {
                  masterplanid: planrs[0][i].masterplanid,
                  status: 3,
                }
                applyPlan.push(plan);                
              }              
            }
          } else {
            // 퇴실일때
            if(planrs[0][i].method === 0 || planrs[0][i].method === 5) {
              // A군
              if(planrs[0][i].status === 9){
                // 9 -> 9 - 유지
              }
              if(planrs[0][i].status === 0){
                // 0 -> 3
                let plan = {
                  masterplanid: planrs[0][i].masterplanid,
                  status: 3,
                }
                applyPlan.push(plan);                
              }
            } else {
              // B군
              if(planrs[0][i].status === 9){
                // 9 -> 1
                let plan = {
                  masterplanid: planrs[0][i].masterplanid,
                  status: 1,
                }
                applyPlan.push(plan);                    
              }
              if(planrs[0][i].status === 1){
                // 1 -> 1           
              }              
            }
          }
        }

        if(applyPlan.length > 0) {
          for(let i = 0; i < applyPlan.length; i++) {
            var updateplanparam = {
              masterplanid: applyPlan[i].masterplanid,
              status: applyPlan[i].status,
            };
    
            var updateplansql = MysqlConn.MAKESQL('attendance', 'updateRuntimePlanStaus', updateplanparam, _SqlFormat);
            await connection.query(updateplansql);
          }
        }

        // 알림 전송
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
