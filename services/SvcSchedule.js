var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

const exceljs = require("exceljs");
var util = require('util');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

var SvcNotice = require('../services/SvcNotice');

class SvcSchedule {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	getMethod(method) {
		if(method === '입실') return 0;
		if(method === '퇴실') return 1;
		if(method === '중식') return 2;
		if(method === '석식') return 3;
		if(method === '외출') return 4;
		if(method === '복귀') return 5;
		return -1;
	}

	checkDayOfWeek(dow) {
		if(dow >= 0 && dow < 7) return dow;
		return -1;
	}

	checkHour(hour) {
		if(hour >= 0 && hour < 24) return hour;
		return -1;
	}

	checkMinute(minute) {
		if(minute >= 0 && minute < 60) return minute;
		return -1;
	}

	checkDigit(digit) {
		if (typeof digit === 'number'){
			return digit
		}
		return -1;
	}

	async createMasterplan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			userid: this._body.userid,
			userpw: this._body.userpw,
			uploadfile: this._body.uploadfile,
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

				resdata.errormsg = '';
				let self = this;

				let rows = [];
				let dayofweek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
				const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(param.uploadfile).then(function( ) {
					const worksheet = workbook.getWorksheet("Sheet1");
					worksheet.eachRow( { includeEmpty:true }, function( row, rowNumber ) {
						if(rowNumber > 12){
							console.log( "Row " + rowNumber + " = " + JSON.stringify( row.values ) );

							for(let col = 0, d = 0; col < 28; col += 4, d++) {
								if(row.values[col + 1] !== undefined){
									let day = {};
									day.branchid = param.session_branchid;
									day.memberid = param.memberid;
									day.dayofweek = d;
	
									let method = self.getMethod(row.values[col + 1]);
									if(method == -1)
									{
										resdata.errormsg += `${dayofweek[d]} ${rowNumber} 행 상태[${row.values[col + 1]}] 오류, `;
									}
									day.method = method;
	
									let hour = self.checkHour(row.values[col + 2]);
									if(hour == -1)
									{
										resdata.errormsg += `${dayofweek[d]} ${rowNumber} 행 시간[${row.values[col + 2]}] 오류, `;
									}
									day.hour = hour;
	
									let minute = self.checkMinute(row.values[col + 3]);
									if(minute == -1)
									{
										resdata.errormsg += `${dayofweek[d]} ${rowNumber} 행 분[${row.values[col +3]}] 오류, `;
									}
									day.minute = minute;

									let sortorder = self.checkDigit(row.values[col + 4]);
									if(sortorder == -1)
									{
										resdata.errormsg += `${dayofweek[d]} ${rowNumber} 행 순서[${row.values[col + 4]}] 오류, `;
									}
									day.sortorder = sortorder;
	
									rows.push(day);
								}
							}

						}
					});
				}); 

				if(resdata.errormsg !== '') {
					code = Code.Api.FORMAT_ERROR.value;
				} else {

					var delsql = MysqlConn.MAKESQL('schedule', 'delMasterPlanList', param, _SqlFormat);
					await connection.query(delsql);
			
					let insparam = {
						objs: rows,
					};

					var inssql = MysqlConn.MAKESQL(
						'schedule',
						'insMasterPlanList',
						insparam,
						_SqlFormat,
					);
		
					await connection.query(inssql);

					resdata.lists = rows;

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
				unlinkAsync(param.uploadfile);
				connection.release();
			} catch (err) {}
		}


		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}


	async updateRuntimeplan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			userid: this._body.userid,
			userpw: this._body.userpw,
			uploadfile: this._body.uploadfile,
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

				resdata.errormsg = '';
				let self = this;

				let rows = [];
				let dayofweek = 0;
				const workbook = new exceljs.Workbook();
        await workbook.xlsx.readFile(param.uploadfile).then(function( ) {
					const worksheet = workbook.getWorksheet("Sheet1");
					worksheet.eachRow( { includeEmpty:true }, function( row, rowNumber ) {
						if(rowNumber == 12){
							let dow = self.checkDayOfWeek(row.values[1]);
							if(dow == -1)
							{
								resdata.errormsg += `${rowNumber} 행 요일[${row.values[1]}] 오류, `;
							}
							dayofweek = dow;
						}
						if(resdata.errormsg === '' && rowNumber > 12){
							console.log( "Row " + rowNumber + " = " + JSON.stringify( row.values ) );
							let col = 0;
							if(row.values[col + 1] !== undefined){
								let day = {};
								day.branchid = param.session_branchid;
								day.memberid = param.memberid;
								day.dayofweek = dayofweek;

								let method = self.getMethod(row.values[col + 1]);
								if(method == -1)
								{
									resdata.errormsg += `${rowNumber} 행 상태[${row.values[col + 1]}] 오류, `;
								}
								day.method = method;

								let hour = self.checkHour(row.values[col + 2]);
								if(hour == -1)
								{
									resdata.errormsg += `${rowNumber} 행 시간[${row.values[col + 2]}] 오류, `;
								}
								day.hour = hour;

								let minute = self.checkMinute(row.values[col + 3]);
								if(minute == -1)
								{
									resdata.errormsg += `${rowNumber} 행 분[${row.values[col + 3]}] 오류, `;
								}
								day.minute = minute;

								let sortorder = self.checkDigit(row.values[col + 4]);
								if(sortorder == -1)
								{
									resdata.errormsg += `${rowNumber} 행 순서[${row.values[col + 4]}] 오류, `;
								}
								day.sortorder = sortorder;

								rows.push(day);
							}

						}
					});
				}); 

				if(resdata.errormsg !== '') {
					code = Code.Api.FORMAT_ERROR.value;
				} else {

					param.dayofweek = dayofweek;
					var delsql = MysqlConn.MAKESQL('schedule', 'delRuntimePlanListByMemberidAndDayOfWeek', param, _SqlFormat);
					await connection.query(delsql);
			
					let insparam = {
						objs: rows,
					};

					var inssql = MysqlConn.MAKESQL(
						'schedule',
						'insRuntimePlanList',
						insparam,
						_SqlFormat,
					);
		
					await connection.query(inssql);


					var selsql = MysqlConn.MAKESQL('schedule', 'selRuntimePlan', param, _SqlFormat);
					let rs = await connection.query(selsql);
					resdata.lists = rs[0];

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
				unlinkAsync(param.uploadfile);
				connection.release();
			} catch (err) {}
		}


		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async copyMasterToRuntimePlan() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
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

				var delsql = MysqlConn.MAKESQL('schedule', 'delRuntimePlanList', param, _SqlFormat);
				await connection.query(delsql);

				var copysql = MysqlConn.MAKESQL('schedule', 'copyMasterToRuntimePlanByMemberid', param, _SqlFormat);
				await connection.query(copysql);

				var selsql = MysqlConn.MAKESQL('schedule', 'selRuntimePlan', param, _SqlFormat);
				let rs = await connection.query(selsql);
				resdata.lists = rs[0];

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


	async initialization(dayofweek) {

		var param = {
			dayofweek: dayofweek,
		}

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			var delsql = MysqlConn.MAKESQL('schedule', 'delRuntimePlanListByDayOfWeek', param, _SqlFormat);
			await connection.query(delsql);

			var copysql = MysqlConn.MAKESQL('schedule', 'copyMasterToRuntimePlanByDayOfWeek', param, _SqlFormat);
			await connection.query(copysql);

			connection.commit();
		} catch (err) {
			connection.rollback();

			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}
	}
}

module.exports = SvcSchedule;
