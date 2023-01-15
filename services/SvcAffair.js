var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var axios = require('axios');

class SvcAffair {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async affair() {

		if(this._body.affairid === 'A') {

			// 출결
			await this.attendance();
		}


	}

	async attendanceByPass() {

			// 출결
			await this.attendanceByPass();

	}

	async attendanceByPass() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			memberno: this._body.memberno,
			userid: this._body.userid,
		};

		_logger.debug(`${util.inspect(param)}`);

		// let connection = null;
		try {
			// connection = await MysqlConn.pool.getConnection(async conn => conn);
			// connection.beginTransaction();

			var axiosparam = {
				branchid: param.session_branchid,
				memberno: param.memberno,
				via: 'admin',
				userid: param.userid,
			};

			var config = {
				headers: { 'Content-Type': 'application/json' },
				responseType: 'json'
			};
			
			axios.post(`${process.env.API_HOST}/api/v1/verifyID`, axiosparam, config)
			.then(response => {
				console.log('Response', response.data)
			})
			.catch(e => {
				console.log('Error: ', e.message)
			});
      
			// connection.commit();
		} catch (err) {
			// connection.rollback();

			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				// connection.release();
			} catch (err) {}
		}

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}


	async attendance() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			affairid: this._body.affairid,
			memberno: this._body.memberno,
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

				var axiosparam = {
					branchid: param.session_branchid,
					memberno: param.memberno,
					via: 'admin',
					userid: param.userid,
				};

				var config = {
					headers: { 'Content-Type': 'application/json' },
					responseType: 'json'
				};
				
				axios.post(`${process.env.API_HOST}/api/v1/verifyID`, axiosparam, config)
        .then(response => {
					console.log('Response', response.data)
				})
				.catch(e => {
					console.log('Error: ', e.message)
				});

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

module.exports = SvcAffair;