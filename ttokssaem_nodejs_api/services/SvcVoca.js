var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');
var SvcNotice = require('../services/SvcNotice');

class SvcVoca {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selVocaMemoList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			page: this._body.page,
			length: this._body.length,			
		};

		// paging
		if (this._body.page != undefined) {
			param.start = this._body.page * param.length;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL(
			'voca',
			'totCntVocaMemo',
			param,
			_SqlFormat,
		);
		var sql = MysqlConn.MAKESQL('voca', 'selVocaMemoList', param, _SqlFormat);

		var flagsql = MysqlConn.MAKESQL('voca', 'selVocaPlanFlag', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let flagrs = await connection.query(flagsql);
			let totcntrs = await connection.query(sqltotcnt);

			if(flagrs[0].length > 0)
				resdata.examflag = flagrs[0][0].examflag;
			else
				resdata.examflag = 'A';

			if(resdata.examflag == 'C'){
				// 시험중일때만
				resdata.totcnt = 0;
				resdata.remain = 0;
				resdata.lists = [];
			} else {
				let rs = await connection.query(sql);

				resdata.totcnt = totcntrs[0][0].totcnt;
				if((param.start + param.length) >= resdata.totcnt){
					resdata.remain = 0;
				} else {
					resdata.remain = 1;
				}
				resdata.lists = rs[0];
			}

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


	async selVocaTestList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			page: this._body.page,
			length: this._body.length,			
		};

		// paging
		if (this._body.page != undefined) {
			param.start = this._body.page * param.length;
		}

		_logger.debug(`${util.inspect(param)}`);

		var flagsql = MysqlConn.MAKESQL('voca', 'selVocaPlanFlag', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			// 현재 차수 구하기
			var degreesql = MysqlConn.MAKESQL('voca', 'getVocaExamDegree', param, _SqlFormat);
			let degreers = await connection.query(degreesql);

			param.degree = degreers[0][0].degree;
			resdata.degree = param.degree;

			var sql = MysqlConn.MAKESQL('voca', 'selVocaTestList', param, _SqlFormat);
			let flagrs = await connection.query(flagsql);
			if(flagrs[0].length > 0)
				resdata.examflag = flagrs[0][0].examflag;
			else
				resdata.examflag = 'A';

			if(resdata.examflag == 'C'){
				// 시험중일때만
				let rs = await connection.query(sql);

				resdata.totcnt = rs[0].length;
				resdata.remain = 0;
				resdata.lists = rs[0];
			} else {
				resdata.totcnt = 0;
				resdata.remain = 0;
				resdata.lists = [];
			}


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


	async selVocaSolveList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			page: this._body.page,
			length: this._body.length,			
		};

		// paging
		if (this._body.page != undefined) {
			param.start = this._body.page * param.length;
		}

		_logger.debug(`${util.inspect(param)}`);

		var flagsql = MysqlConn.MAKESQL('voca', 'selVocaPlanFlag', param, _SqlFormat);
		var degreesql = MysqlConn.MAKESQL('voca', 'selVocaExamDegree', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let flagrs = await connection.query(flagsql);
			let degreers = await connection.query(degreesql);


			if(flagrs[0].length > 0)
				resdata.examflag = flagrs[0][0].examflag;
			else
				resdata.examflag = 'A';

			param.degree = degreers[0][0].degree;

			if(resdata.examflag == 'D' || resdata.examflag == 'E'){
				// 시험중이 아닐때만
				var sqltotcnt = MysqlConn.MAKESQL(
					'voca',
					'totCntVocaSolve',
					param,
					_SqlFormat,
				);
				var sql = MysqlConn.MAKESQL('voca', 'selVocaSolveList', param, _SqlFormat);
	
				let totcntrs = await connection.query(sqltotcnt);
				let rs = await connection.query(sql);
	
				resdata.totcnt = totcntrs[0][0].totcnt;
				if((param.start + param.length) >= resdata.totcnt){
					resdata.remain = 0;
				} else {
					resdata.remain = 1;
				}
				resdata.lists = rs[0];
			} else {
				resdata.totcnt = 0;
				resdata.remain = 0;
				resdata.lists = [];
			}

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


	async selVocaHistList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			targetid: this._body.targetid, // 부모가 학생꺼 요청할때
			memberid: this._body.memberid, // 학생이 요청할때
			page: this._body.page,
			length: this._body.length,			
		};

		// paging
		if (this._body.page != undefined) {
			param.start = this._body.page * param.length;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL(
			'voca',
			'totCntVocaHist',
			param,
			_SqlFormat,
		);
		var sql = MysqlConn.MAKESQL('voca', 'selVocaHistList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let totcntrs = await connection.query(sqltotcnt);
			let rs = await connection.query(sql);

			resdata.totcnt = totcntrs[0][0].totcnt;
			if((param.start + param.length) >= resdata.totcnt){
				resdata.remain = 0;
			} else {
				resdata.remain = 1;
			}
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

	async requestVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			membername: '',
		};

		_logger.debug(`${util.inspect(param)}`);
	
		var studentsql = MysqlConn.MAKESQL('member', 'searchStudentById', param, _SqlFormat);

		var sql = MysqlConn.MAKESQL('voca', 'requestVocaTest', param, _SqlFormat);
	
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let studentrs = await connection.query(studentsql);
			if (studentrs[0].length == 1) {
				param.membername = studentrs[0][0].membername;
			}

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
       
				// 관리자에게 알림
				let notice = {
					branchid: param.branchid,
					membername: param.membername,
					message: `${param.memodate} - 단어장 테스트 요청합니다. `,
				};

				let svcNotice = new SvcNotice();
				await svcNotice.requestVocaTestToAdmin(connection, notice);

			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
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

	async finishVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			degree: this._body.degree,
			lists: this._body.lists,
			finishflag: 'D', // D: 완료, E: 재시험
			membername: '',
		};

		_logger.debug(`${util.inspect(param)}`);
	
		var studentsql = MysqlConn.MAKESQL('member', 'searchStudentById', param, _SqlFormat);
	
		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let studentrs = await connection.query(studentsql);
			if (studentrs[0].length == 1) {
				param.membername = studentrs[0][0].membername;

				// 정답 검사
				for(let i = 0; i < param.lists.length; i++) {
					let id = param.lists[i].id;
					let vocalevel = param.lists[i].vocalevel;
					let vocano = param.lists[i].vocano;
					let answer = param.lists[i].answer.split('\n');

					var chkparam = {
						id: id,
						vocalevel: vocalevel,
						vocano: vocano,
						answer: param.lists[i].answer,
					};

					_logger.debug(`정답체크 : 학생 - ${util.inspect(answer)}`);

					let result = 'O';
					var vocasql = MysqlConn.MAKESQL('voca', 'selVocaAnswer', chkparam, _SqlFormat);
					let vocars = await connection.query(vocasql);
					if (vocars[0].length == 1) {
						let voca_answer = vocars[0][0].answer.split(',');

						
						_logger.debug(`단어장 - ${util.inspect(voca_answer)}`);

						if(answer.length == voca_answer.length) {
							for(let j = 0; j < answer.length; j++) {
								let stop = true
								for(let k = 0; k < voca_answer.length; k++) {
									if(answer[j].replace(/\s/g, '') == voca_answer[k].replace(/\s/g, ''))
										stop = false;
								}
	
								if(stop == true){
									_logger.debug(`break : 답이 틀려서 멈춤. ${util.inspect(stop)}`);
									result = 'X';
									break;
								}
							}
						} else {
							_logger.debug(`result : 정답 개수가 맞지 않아 틀림`);
							result = 'X';
						}

					} else {
						_logger.debug(`result : 단어장에 없는 단어이거나 단어가 여러개일 경우로 틀림`);
						result = 'X';
					}

					_logger.debug(`result : ${util.inspect(result)}`);
					chkparam.result = result;

					var updatesql = MysqlConn.MAKESQL('voca', 'updateVocaTestResult', chkparam, _SqlFormat);
					await connection.query(updatesql);
				}

				// 점수 계산
				var solvesql = MysqlConn.MAKESQL('voca', 'solveVocaTestResult', param, _SqlFormat);
				let solvers = await connection.query(solvesql);
				
				// 완료, 재시험 여부
				let per =  Math.floor(( Number(solvers[0][0].total) - Number(solvers[0][0].wrong) ) / Number(solvers[0][0].total) * 100);
				if(per >= solvers[0][0].passrate){
					// 완료
					param.finishflag = 'D';
				} else {
					// 재시험
					param.finishflag = 'E';
				}

				_logger.debug(`결과 : ${util.inspect(per)}% ${( param.finishflag == 'D' ? '통과' : '재시험' )}`);

				resdata.total = param.total = solvers[0][0].total;
				resdata.wrong = param.wrong = solvers[0][0].wrong;
				resdata.per = per;
				resdata.finishflag = param.finishflag;
				
				// score update
				var scoresql = MysqlConn.MAKESQL('voca', 'finishVocaExam', param, _SqlFormat);
				await connection.query(scoresql);

				// flag update
				var flagsql = MysqlConn.MAKESQL('voca', 'finishVocaTest', param, _SqlFormat);
				await connection.query(flagsql);

				// 관리자에게 알림
				let notice = {
					branchid: param.branchid,
					membername: param.membername,
					message: param.memodate + ' 풀이결과 알림 - ' + ( param.finishflag == 'D' ? '통과' : '재시험' ),
				};

				let svcNotice = new SvcNotice();
				await svcNotice.requestVocaTestToAdmin(connection, notice);	

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

module.exports = SvcVoca;
