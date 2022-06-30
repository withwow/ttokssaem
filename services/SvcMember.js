var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcMember {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async searchStudent() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			membername: this._body.membername,
		};

		var sql = MysqlConn.MAKESQL('member', 'searchStudent', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				resdata = rs[0];
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

	async userinfo() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			email: this._body.email,
			nickname: this._body.nickname,
		};

		var sql = MysqlConn.MAKESQL('member', 'userinfo', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				resdata.userid = rs[0][0].userid;
				resdata.nickname = rs[0][0].nickname;
				resdata.email = rs[0][0].email;
				resdata.uuid = rs[0][0].uuid;
				resdata.exp_robot = rs[0][0].exp_robot;
				resdata.exp_castle = rs[0][0].exp_castle;
				resdata.gold = rs[0][0].gold;
				resdata.gem = rs[0][0].gem;

				// Levels
				var levelsql = MysqlConn.MAKESQL(
					'level',
					'selLevelList',
					param,
					_SqlFormat,
				);
				let levels = await connection.query(levelsql);
				resdata.levels = levels[0];

				resdata.robot = [];
				resdata.castle = [];
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

	async updateuserinfo() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			nickname: this._body.nickname,
			email: this._body.email,
		};

		_logger.debug(`${util.inspect(param)}`);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			// 재화 증감
			var inssql = MysqlConn.MAKESQL(
				'member',
				'upd_userinfo',
				param,
				_SqlFormat,
			);
			await connection.query(inssql);

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


	async usecoupon() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			coupon: this._body.coupon,
		};

		_logger.debug(`${util.inspect(param)}`);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			connection.beginTransaction();

			let usecount = 'P';
			let gold = 0;
			let gem = 0;

			// 쿠폰 검사
			var selsql = MysqlConn.MAKESQL(
				'coupon',
				'selCoupon',
				param,
				_SqlFormat,
			);
			let rs = await connection.query(selsql);
			if (rs[0].length == 1) {
				
				gold = rs[0][0].gold;
				gem = rs[0][0].gem;

				// 쿠폰 종류 : 0 (무기간, 1회)
				if(rs[0][0].coupontype == '0'){
					if( rs[0][0].usecount != 0 ) {
						code = Code.Api.COUPON_ALREADY_USE.value;
					}
				}

				// 쿠폰 종류 : 1 (기간, 1회)
				if(rs[0][0].coupontype == '1'){
					if( rs[0][0].usecount != 0 ) {
						code = Code.Api.COUPON_ALREADY_USE.value;
					} else {
						// 기간중 인지
						let todaydate = new Date()
							.toISOString()
							.slice(0, 10)
							.replace(/-|:|T/g, '');

							_logger.debug(`${rs[0][0].edate} < ${util.inspect(todaydate)}`);
							_logger.debug(`${util.inspect(todaydate)} < ${rs[0][0].sdate}`);

						if( Number(rs[0][0].sdate) <= Number(todaydate) && Number(todaydate) <= Number(rs[0][0].edate))	{
							_logger.debug(`YYYYY`);
						} else {
							code = Code.Api.COUPON_NOT_PERIOD.value;
							_logger.debug(`NNNNN`);
						}						
					}
				}

				if(code == Code.Api.OK.value) {

						param.usecount = usecount;

						if(gold != 0){
							param.gold = gold;
						} else {
							param.gem = gem;
						}

						_logger.debug(`${util.inspect(param)}`);

						// 쿠폰 사용
						var usesql = MysqlConn.MAKESQL(
							'coupon',
							'useCoupon',
							param,
							_SqlFormat,
						);
						await connection.query(usesql);			
						
						var histsql = MysqlConn.MAKESQL(
							'coupon',
							'histCoupon',
							param,
							_SqlFormat,
						);
						await connection.query(histsql);			
						

					// 재화 증감
					var inssql = MysqlConn.MAKESQL(
						'member',
						'add_property',
						param,
						_SqlFormat,
					);
					await connection.query(inssql);
		
					// 이력 등록
					var histparam = {};
					histparam.userid = this._body.userid;
					if (param.gold != undefined) {
						histparam.method = 'coupongold';
						histparam.amount = param.gold;
					}
					if (param.gem != undefined) {
						histparam.method = 'coupongem';
						histparam.amount = param.gem;
					}
		
					var histsql = MysqlConn.MAKESQL(
						'member',
						'ins_hist_property',
						histparam,
						_SqlFormat,
					);
					await connection.query(histsql);
		
					// 유저 정보 읽어 반환
					var sql = MysqlConn.MAKESQL('member', 'userinfo', param, _SqlFormat);
					let rs = await connection.query(sql);
					if (rs[0].length == 1) {
						resdata.exp_robot = rs[0][0].exp_robot;
						resdata.exp_castle = rs[0][0].exp_castle;
						resdata.gold = rs[0][0].gold;
						resdata.gem = rs[0][0].gem;
					}				
				}
					
			} else {
				code = Code.Api.COUPON_NOT_FOUND.value;
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

module.exports = SvcMember;
