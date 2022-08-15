var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');

var SvcSession = require('../services/SvcSession');

class SvcPayment {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async selPaymentList() {
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

		var sqltotcnt = MysqlConn.MAKESQL('payment', 'totCntPayment', param, _SqlFormat);
		var sql = MysqlConn.MAKESQL('payment', 'selPaymentList', param, _SqlFormat);

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

	async payment() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			session_branchid: this._body.session_branchid,
			goodsid: this._body.goodsid,
			type: this._body.type,
			startdate: this._body.startdate,
			enddate: this._body.enddate,
			price: this._body.price,
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

        // 결제 이력 등록
				var paymentsql = MysqlConn.MAKESQL('payment', 'insPayment', param, _SqlFormat);
				await connection.query(paymentsql);
        // 기간형 상품의 만료기간 업데이트
        if(param.type == 'P'){
					let updparam = {
						branchid: param.session_branchid,
						memberid: param.memberid,
						classexpiredate: param.enddate,
					};
					var updatesql = MysqlConn.MAKESQL('member', 'updMember', updparam, _SqlFormat);
					await connection.query(updatesql);
				}
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

module.exports = SvcPayment;
