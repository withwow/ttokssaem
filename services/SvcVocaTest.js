var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');
var SvcNotice = require('../services/SvcNotice');

class SvcVocaTest {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selVocaTestList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			branchid: this._body.session_branchid,
			memodate: this._body.memodate,
			query: this._body.search.value,
      sortorder: '',
			dir: '',
		};

    // order
		if (this._body.order != undefined) {
			param.sortorder = this._body.columns[this._body.order[0].column].data == '' ? this._body.columns[this._body.order[0].column].name : this._body.columns[this._body.order[0].column].data;
			param.dir = this._body.order[0].dir;
		}

		// paging
		if (this._body.start != undefined) {
			param.length = this._body.length;
			param.start = this._body.start;
		}

		_logger.debug(`${util.inspect(param)}`);

		var sqltotcnt = MysqlConn.MAKESQL('vocatest', 'totCntVocaTest', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('vocatest', 'selVocaTestList', param, _SqlFormat);

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

	async selVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'selVocaTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 정상
				resdata = rs[0][0];
			} else {
				// 실패
				code = Code.Api.DB_ERROR_COMMAND.value;
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

	async insVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'insVocaTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				resdata.lastid = rs[0].insertId;
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

	async updVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'updVocaTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
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

	async delVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'delVocaTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
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


	async startVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberid: this._body.memberid,
			memodate: this._body.memodate,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'startVocaTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
				// 차수 구하기
				var degreesql = MysqlConn.MAKESQL('vocatest', 'getVocaExamDegree', param, _SqlFormat);
				let degreers = await connection.query(degreesql);

				if(degreers[0].length == 1){
					param.degree = degreers[0][0].degree;

					// 단어시험 정보 생성 및 업데이트
					var examsql = MysqlConn.MAKESQL('vocatest', 'registVocaExam', param, _SqlFormat);
					let examrs = await connection.query(examsql);

					// 단어시험 문제풀이 생성
					var solvesql = MysqlConn.MAKESQL('vocatest', 'registVocaSolve', param, _SqlFormat);
					let solvers = await connection.query(solvesql);
	
					// 학생에게 알림
					let notice = {
						branchid: param.session_branchid,
						memberid: param.memberid,
						memodate: param.memodate,
					};
	
					let svcNotice = new SvcNotice();
					svcNotice.starVocaTestToStudent(connection, notice);
				} else {
					// 실패
					code = Code.Api.NOT_FOUND.value;
				}


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


	async selVocaSolveList() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			degree: this._body.degree,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'selVocaSolveList', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			// 정상
			resdata.draw = this._body.draw;
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

	async correctVocaSolve() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			id: this._body.id,
			result: this._body.result,
		};

		_logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'correctVocaSolve', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].affectedRows == 1) {
				// 정상
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

	
	async reCompute() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memberid: this._body.memberid,
			memodate: this._body.memodate,
			degree: this._body.degree,
		};

		_logger.debug(`${util.inspect(param)}`);


		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			// 점수 계산
			var solvesql = MysqlConn.MAKESQL('vocatest', 'solveVocaTestResult', param, _SqlFormat);
			let solvers = await connection.query(solvesql);
			
			// 완료, 재시험 여부
			let per =  ( Number(solvers[0][0].total) - Number(solvers[0][0].wrong) ) / Number(solvers[0][0].total) * 100;
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
			var scoresql = MysqlConn.MAKESQL('vocatest', 'finishVocaExam', param, _SqlFormat);
			await connection.query(scoresql);

			// flag update
			var flagsql = MysqlConn.MAKESQL('vocatest', 'finishVocaTest', param, _SqlFormat);
			await connection.query(flagsql);


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


	async deleteMemodateVocaTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			memodate: this._body.memodate,
			memberid: this._body.memberid,
		};

		_logger.debug(`${util.inspect(param)}`);


		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			// checkvocaplan - 단어장의 시작과 끝 번호
			var delsql1 = MysqlConn.MAKESQL('vocatest', 'delVocaTest', param, _SqlFormat);
			await connection.query(delsql1);

			// vocamemo - 암기해야할 단어(시작과 끝 전체)
			var delsql1 = MysqlConn.MAKESQL('vocatest', 'delVocaMemo', param, _SqlFormat);
			await connection.query(delsql1);

			// vocaexam - 시험 정보(여러 차수)
			var delsql1 = MysqlConn.MAKESQL('vocaexam', 'delVocaExam', param, _SqlFormat);
			await connection.query(delsql1);

			// vocasolve - 시험 풀이 정보(여러 차수)
			var delsql1 = MysqlConn.MAKESQL('vocasolve', 'delVocaSolve', param, _SqlFormat);
			await connection.query(delsql1);

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


  async checkRequestTest() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
      session_branchid: this._body.session_branchid,
      memodate: this._body.memodate,
		};

		// _logger.debug(`${util.inspect(param)}`);

		var sql = MysqlConn.MAKESQL('vocatest', 'checkRequestTest', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);

			let rs = await connection.query(sql);
			resdata.count = rs[0].length;
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

}

module.exports = SvcVocaTest;
