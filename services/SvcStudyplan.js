var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

const appRoot = require('app-root-path'); // app root 경로를 가져오는 lib
const exceljs = require("exceljs");

var util = require('util');
var moment = require('moment');

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
			classyn: this._body.classyn,
			study: this._body.study,
			goalnum: this._body.goalnum,
			achievenum: this._body.achievenum,
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

        // 학습계획 등록
				for(let i = 0; i < param.studyplanid.length; i++){
					if( param.classyn[i] === 'Y') {
						if( param.studyplanid[i] !== '') {
							// 기존값 수정의 경우
							console.log (`${i} : ${param.studyplanid[i]}`) 
							let updparam = {
								studyplanid: param.studyplanid[i],
								study: param.study[i],
								goalnum: param.goalnum[i],
								achievenum: param.achievenum[i],
							};
							var updsql = MysqlConn.MAKESQL('studyplan', 'updStudyplan', updparam, _SqlFormat);
							await connection.query(updsql);
						} else {
							// 신규등록의 경우
							let insparam = {
								branchid: param.session_branchid,
								memberid: param.memberid,
								class: Number(i+1),
								study: param.study[i],
								goalnum: param.goalnum[i],
								achievenum: param.achievenum[i],
								plandate: param.plandate,
							};
							var inssql = MysqlConn.MAKESQL('studyplan', 'insStudyplanEx', insparam, _SqlFormat);
							await connection.query(inssql);
						}
					} else {
						if( param.studyplanid[i] !== '') {
							// 삭제의 경우
							let delparam = {
								studyplanid: param.studyplanid[i],
							};
							// var delsql = MysqlConn.MAKESQL('studyplan', 'delStudyplan', delparam, _SqlFormat);
							// await connection.query(delsql);
						}
					}
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


	async downloadStudyplan() {

		var param = {
			branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			plandate: String(this._body.plandate).replace(/-/gi, ''),
		};

		var fileName = `${appRoot}/public/forms/OOO_StudyPlan.xlsx`;
		var workbook = new exceljs.Workbook();

		let self = this;

		workbook.xlsx.readFile(fileName)
    .then(async () => {

			// 학생 정보
			var studentsql = MysqlConn.MAKESQL('member', 'selMember', param, _SqlFormat);
			var plansql = MysqlConn.MAKESQL('studyplan', 'selStudyplan', param, _SqlFormat);

			let connection = null;
			try {
				connection = await MysqlConn.pool.getConnection(async conn => conn);
	
				const worksheet = workbook.getWorksheet("Sheet1");

				// 학생 정보
				let studentrs = await connection.query(studentsql);
				
				let dayofweek = ['일','월','화','수','목','금','토'];
				let today = moment(param.plandate, 'YYYYMMDD');
				let day = today.day();

				worksheet.getCell('A3').value = `이름: ${studentrs[0][0].membername}          학교:  ${studentrs[0][0].schoolname}          날짜: ${today.format('MM-DD')}(${dayofweek[day]})`;
				let downloadFileName = encodeURIComponent(`${studentrs[0][0].membername}_${param.plandate}`);
				downloadFileName += '.xlsx';
				// 학습계획 정보
				let planrs = await connection.query(plansql);
				for(let i = 0; i < planrs[0].length; i++) {

					let cell = `C${Number(5) + Number(planrs[0][i].class)}`;

					worksheet.getCell(cell).value = planrs[0][i].study;
					worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
				}

				self._res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
				self._res.setHeader("Content-Disposition", "attachment; filename=" + downloadFileName);
			
				workbook.xlsx.write(self._res).then(function(){

					self._res.end();
				});

			} catch (err) {
				_logger.error(err.stack);
			} finally {
				try {
					connection.release();
				} catch (err) {}
			}
			//

		}).catch(err => {
			_logger.error(err.stack);
			self._res.status(500).send(err);
		});

	}


	async downloadStudyplanEx() {

		var param = {
			branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			plandate: String(this._body.plandate).replace(/-/gi, ''),
		};

		var fileName = `${appRoot}/public/forms/OOO_StudyPlanEx.xlsx`;
		var workbook = new exceljs.Workbook();

		let self = this;

		workbook.xlsx.readFile(fileName)
    .then(async () => {

			// 학생 정보
			var studentsql = MysqlConn.MAKESQL('member', 'selMember', param, _SqlFormat);
			var plansql = MysqlConn.MAKESQL('studyplan', 'selStudyplan', param, _SqlFormat);

			let connection = null;
			try {
				connection = await MysqlConn.pool.getConnection(async conn => conn);
	
				const worksheet = workbook.getWorksheet("Sheet1");

				// 학생 정보
				let studentrs = await connection.query(studentsql);
				
				let dayofweek = ['일','월','화','수','목','금','토'];
				let today = moment(param.plandate, 'YYYYMMDD');
				let day = today.day();

				worksheet.getCell('A3').value = `이름: ${studentrs[0][0].membername}          학교:  ${studentrs[0][0].schoolname}          날짜: ${today.format('MM-DD')}(${dayofweek[day]})`;
				let downloadFileName = encodeURIComponent(`${studentrs[0][0].membername}_${param.plandate}`);
				downloadFileName += '.xlsx';
				// 학습계획 정보
				let planrs = await connection.query(plansql);
				for(let i = 0; i < planrs[0].length; i++) {

					let cell = `C${Number(5) + Number(planrs[0][i].class)}`;

					worksheet.getCell(cell).value = planrs[0][i].study;
					worksheet.getCell(cell).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
				}

				self._res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
				self._res.setHeader("Content-Disposition", "attachment; filename=" + downloadFileName);
			
				workbook.xlsx.write(self._res).then(function(){

					self._res.end();
				});

			} catch (err) {
				_logger.error(err.stack);
			} finally {
				try {
					connection.release();
				} catch (err) {}
			}
			//

		}).catch(err => {
			_logger.error(err.stack);
			self._res.status(500).send(err);
		});

	}
}

module.exports = SvcStudyplan;
