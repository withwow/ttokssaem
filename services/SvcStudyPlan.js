var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcStudyPlan {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async todayStudyPlanList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			plandate: this._body.plandate,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('studyplan', 'todayStudyPlanList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.totcnt = rs[0].length;
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


	async studyPlanList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			plandate: String(this._body.plandate).replace(/-/gi, ''),
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('studyplan', 'studyPlanList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.totcnt = rs[0].length;
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

	async achiveStudyPlanList() {
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
			'studyplan',
			'totCntAchiveStudyPlan',
			param,
			_SqlFormat,
		);		
		var sql = MysqlConn.MAKESQL('studyplan', 'achiveStudyPlanList', param, _SqlFormat);

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


	async dashboardStudyPlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql3 = MysqlConn.MAKESQL('studyplan', 'last3StudyPlan', param, _SqlFormat);
		var sql7 = MysqlConn.MAKESQL('studyplan', 'last7StudyPlan', param, _SqlFormat);
		var sql30 = MysqlConn.MAKESQL('studyplan', 'last30StudyPlan', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs3 = await connection.query(sql3);
			let rs7 = await connection.query(sql7);
			let rs30 = await connection.query(sql30);

			let last3 = {};
			last3.plancount = rs3[0][0].plancount;
			last3.achievecount = rs3[0][0].achievecount;

			let last7 = {};
			last7.plancount = rs7[0][0].plancount;
			last7.achievecount = rs7[0][0].achievecount;

			let last30 = {};
			last30.plancount = rs30[0][0].plancount;
			last30.achievecount = rs30[0][0].achievecount;

			resdata.last3 = last3;
			resdata.last7 = last7;
			resdata.last30 = last30;

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

	async regStudyPlanList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			plandate: this._body.plandate,
		};

		_logger.debug(`${util.inspect(param)}`);

		var delsql = MysqlConn.MAKESQL(
			'studyplan',
			'delStudyPlanList',
			param,
			_SqlFormat,
		);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			await connection.query(delsql);

			var objs = [];
			for (let i = 0; i < this._body.lists.length; i++) {
				let obj = {};
				obj.branchid = this._body.branchid;
				obj.memberid = this._body.memberid;
				obj.class = this._body.lists[i].class;
				obj.study = this._body.lists[i].study;
				obj.plandate = this._body.plandate;

				objs.push(obj);
			}

			if(objs.length > 0) {
				let insparam = {
					objs: objs,
				};
	
				var inssql = MysqlConn.MAKESQL(
					'studyplan',
					'regStudyPlanList',
					insparam,
					_SqlFormat,
				);
	
				await connection.query(inssql);
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

module.exports = SvcStudyPlan;
