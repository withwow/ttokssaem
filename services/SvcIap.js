var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var { RemoteIp } = require('../common/MyUtil');

const IAP_VALID_CHECK = require('in-app-purchase');
IAP_VALID_CHECK.config({
	appleExcludeOldTransactions: true,
	applePassword: 'applepassword',
	googlePublicKeyStrSandbox:
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEGxiHSdK/qDqe0kZJLi+xyC286ll2vnKVAaa5z/fh2yNiJcFfOwO06vzaJu2M/X4qaS1gfM9gM3A6jr+7ZuOF0dxLdilbUhpIMKRNub153IlhTsCAwbOUqV8tLuPJvGb5yVnNrrN6zghsz/5m8i2yIXMNsift+FyX7QD65Vka/r1ho7IT8OxfuMY3HvBaxKmXSIz+4W6VoDVEN4q4O7l2Ff4muz+G6gR+e8+PdwgL/zdrO/GJ2ElutKVx4cSLC70iTzFDFMqMHY4BmBANL0f4ec+NEO4uSjOI05U1lh5w4vrlImK+kFeu3Zr2zqrsr9NhbT6sXrAOcxE9V9mAhn3wIDAQAB',
	googlePublicKeyStrLive:
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEGxiHSdK/qDqe0kZJLi+xyC286ll2vnKVAaa5z/fh2yNiJcFfOwO06vzaJu2M/X4qaS1gfM9gM3A6jr+7ZuOF0dxLdilbUhpIMKRNub153IlhTsCAwbOUqV8tLuPJvGb5yVnNrrN6zghsz/5m8i2yIXMNsift+FyX7QD65Vka/r1ho7IT8OxfuMY3HvBaxKmXSIz+4W6VoDVEN4q4O7l2Ff4muz+G6gR+e8+PdwgL/zdrO/GJ2ElutKVx4cSLC70iTzFDFMqMHY4BmBANL0f4ec+NEO4uSjOI05U1lh5w4vrlImK+kFeu3Zr2zqrsr9NhbT6sXrAOcxE9V9mAhn3wIDAQAB',
});

class SvcIap {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async iapcheck() {
		let resdata = {};
		resdata.gem = 0;
		let code = Code.Api.OK.value;

		let res = this._res;
		let cmd = this._cmd;
		let t = this._t;

		let order = {};
		order.userid = this._body.userid;
		order.receipt = this._body.receipt;
		order.productid = this._body.productid;
		order.quantity = this._body.quantity;
		_logger.error(`${util.inspect(order)}`);

		IAP_VALID_CHECK.setup(async function (err) {
			if (err) {
				// Failed to validate
				_logger.error('1:Receipt error for Setup');
				code = Code.Api.ERROR_SETUP.value;
				res.json(new Response(cmd, code, resdata, t).build());

				// 기록
				order.result = code;

				var sql = MysqlConn.mapper.getStatement(
					'iap',
					'ins_hist_order',
					order,
					_SqlFormat,
				);
				MysqlConn.SQL('iap', 'ins_hist_order', sql);
				let connection = null;
				try {
					connection = await MysqlConn.pool.getConnection(async conn => conn);
					let rs = await connection.query(sql);
				} catch (err) {
					code = Code.Api.DB_ERROR.value;
					_logger.error(err.stack);
				} finally {
					try {
						connection.release();
					} catch (err) {}
				}
			} else {
				IAP_VALID_CHECK.validate(order.receipt, async function (err, response) {
					if (err) {
						// Failed to validate
						_logger.error('2:Receipt error for validate');
						code = Code.Api.ERROR_VALIDATE.value;
						res.json(new Response(cmd, code, resdata, t).build());

						// 가록
						order.result = code;

						var sql = MysqlConn.mapper.getStatement(
							'iap',
							'ins_hist_order',
							order,
							_SqlFormat,
						);
						MysqlConn.SQL('iap', 'ins_hist_order', sql);
						let connection = null;
						try {
							connection = await MysqlConn.pool.getConnection(
								async conn => conn,
							);
							await connection.query(sql);
						} catch (err) {
							code = Code.Api.DB_ERROR.value;
							_logger.error(err.stack);
						} finally {
							try {
								connection.release();
							} catch (err) {}
						}
					} else {
						if (IAP_VALID_CHECK.isValidated(response)) {
							// Succuessful validation

							// 기록
							order.result = code;

							var sql = MysqlConn.mapper.getStatement(
								'iap',
								'ins_hist_order',
								order,
								_SqlFormat,
							);
							MysqlConn.SQL('iap', 'ins_hist_order', sql);
							let connection = null;
							try {
								connection = await MysqlConn.pool.getConnection(
									async conn => conn,
								);
								await connection.query(sql);

								let updparam = {};
								updparam.userid = order.userid;
								updparam.gem = order.quantity;

								var updsql = MysqlConn.mapper.getStatement(
									'member',
									'upd_property',
									updparam,
									_SqlFormat,
								);
								MysqlConn.SQL('member', 'upd_property', updsql);
								await connection.query(updsql);

								var selsql = MysqlConn.mapper.getStatement(
									'member',
									'userinfo',
									updparam,
									_SqlFormat,
								);
								MysqlConn.SQL('member', 'userinfo', selsql);
								let rs = await connection.query(updsql);
								if (rs[0].length == 1) {
									resdata.gem = rs[0][0].gem;
								}
							} catch (err) {
								code = Code.Api.DB_ERROR.value;
								_logger.error(err.stack);
							} finally {
								try {
									connection.release();
								} catch (err) {}
							}

							res.json(new Response(cmd, code, resdata, t).build());
						} else {
							_logger.error('3:Receipt error on response');
							code = Code.Api.ERROR_RESPONSE.value;
							res.json(new Response(cmd, code, resdata, t).build());

							// 기록
							order.result = code;

							var sql = MysqlConn.mapper.getStatement(
								'iap',
								'ins_hist_order',
								order,
								_SqlFormat,
							);
							MysqlConn.SQL('iap', 'ins_hist_order', sql);
							let connection = null;
							try {
								connection = await MysqlConn.pool.getConnection(
									async conn => conn,
								);
								await connection.query(sql);
							} catch (err) {
								code = Code.Api.DB_ERROR.value;
								_logger.error(err.stack);
							} finally {
								try {
									connection.release();
								} catch (err) {}
							}
						}
					}
				});
			}
		});
	}
}

module.exports = SvcIap;
