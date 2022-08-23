var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcNotice = require('../services/SvcNotice');

class SvcStudyplan {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selStudyplan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
			plandate: String(this._body.plandate).replace(/-/gi, ''),
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('studyplan', 'selStudyplan', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

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

	async updStudyplan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			studyplanid: this._body.studyplanid,
			memberid: this._body.memberid,
			membername: this._body.membername,
			userid: this._body.userid,
			userpw: this._body.userpw,
			achieveyn: this._body.achieveyn,
			plandate: this._body.plandate,
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

        // 학습계획 등록
				for(let i = 0; i < param.studyplanid.length; i++){

					console.log (`${i} : ${param.studyplanid[i]}`) 
					let updparam = {
						studyplanid: param.studyplanid[i],
						achieveyn: param.achieveyn[i],
					};
					var updsql = MysqlConn.MAKESQL('studyplan', 'updStudyplan', updparam, _SqlFormat);
					await connection.query(updsql);
				}

				// 부모에게 알림
				// let notice = {
				// 	branchid: param.session_branchid,
				// 	memberid: param.memberid,
				// 	studentname: param.membername,
				// 	plandate: param.plandate
				// };

				// let svcNotice = new SvcNotice();

				// await svcNotice.updStudyplanToSelf(connection, notice);
				// await svcNotice.updStudyplanToParents(connection, notice);


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


	async insStudyplan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			userid: this._body.userid,
			userpw: this._body.userpw,
			plandate: String(this._body.plandate).replace(/-/gi, ''),
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
				var delsql = MysqlConn.MAKESQL(
					'studyplan',
					'delStudyPlanList',
					param,
					_SqlFormat,
				);
		
				await connection.query(delsql);

				var objs = [];
				for (let i = 0; i < this._body.classyn.length; i++) {
					let obj = {};
					obj.branchid = param.branchid;
					obj.memberid = param.memberid;
					obj.class = Number(i+1);
					obj.study = this._body.study[i];
					obj.plandate = param.plandate;

					if( this._body.classyn[i] === 'Y')
						objs.push(obj);
				}

				if(objs.length > 0) {
					let insparam = {
						objs: objs,
					};
		
					var inssql = MysqlConn.MAKESQL(
						'studyplan',
						'insStudyplan',
						insparam,
						_SqlFormat,
					);
		
					await connection.query(inssql);
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

module.exports = SvcStudyplan;
