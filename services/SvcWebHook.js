var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var { WebHook } = require('../common/SlackWebHook');

class SvcWebHook {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async sendwebhook() {
		let resdata = {};
		let code = Code.Api.OK.value;

		let ret = await WebHook('text', 'title', 'value');

		console.log(ret);

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async readInstantMessage() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {};

		var sql = MysqlConn.mapper.getStatement(
			'webhook',
			'readInstantMessage',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('webhook', 'readInstantMessage', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			// transaction
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length >= 1) {
				rs[0].forEach(async element => {
					_logger.debug(util.inspect(element));
					// 보내고
					var msgparam = {
						sendid: element.sendid,
						text: element.text,
						title: element.title,
						message: element.message,
						reserved: element.reserved,
						senddate: element.senddate,
						response: '',
					};

					// _logger.debug(`OS: ${msgparam.os.toUpperCase()}`);

					try {
						msgparam.response = await WebHook(
							msgparam.text,
							msgparam.title,
							msgparam.message,
						);
						_logger.debug(util.inspect(msgparam.response));
					} catch (e) {
						_logger.error(e);
						msgparam.response = e;
					}

					// 삭제 하고
					var delsql = MysqlConn.mapper.getStatement(
						'webhook',
						'delMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('webhook', 'delMessage', delsql);
					await connection.query(delsql);

					// 보낸 메시지에 결과와 함께 넣고
					var inssql = MysqlConn.mapper.getStatement(
						'webhook',
						'insSentMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('webhook', 'insSentMessage', inssql);
					await connection.query(inssql);
				});
			}

			// commit
			connection.commit();
		} catch (err) {
			// rollback
			connection.rollback();

			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}
	}

	async readReservedMessage() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {};

		var sql = MysqlConn.mapper.getStatement(
			'webhook',
			'readReservedMessage',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('webhook', 'readReservedMessage', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			// transaction
			connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length >= 1) {
				rs[0].forEach(async element => {
					console.log(element);
					// 보내고
					var msgparam = {
						sendid: element.sendid,
						text: element.text,
						title: element.title,
						message: element.message,
						reserved: element.reserved,
						senddate: element.senddate,
						response: '',
					};

					try {
						msgparam.response = await WebHook(
							msgparam.text,
							msgparam.title,
							msgparam.message,
						);
						_logger.debug(util.inspect(msgparam.response));
					} catch (e) {
						_logger.error(e);
						msgparam.response = e;
					}

					// 삭제 하고
					var delsql = MysqlConn.mapper.getStatement(
						'webhook',
						'delMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('webhook', 'delMessage', delsql);
					await connection.query(delsql);

					// 보낸 메시지에 결과와 함께 넣고
					var inssql = MysqlConn.mapper.getStatement(
						'webhook',
						'insSentMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('webhook', 'insSentMessage', inssql);
					await connection.query(inssql);
				});
			}

			// commit
			connection.commit();
		} catch (err) {
			// rollback
			connection.rollback();

			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}
	}
}

module.exports = SvcWebHook;
