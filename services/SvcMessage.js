var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var FireBase = require('../common/FireBaseAdmin.js');
// var IosApn = require('../common/IosApn.js');

var util = require('util');

class SvcMessage {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async sendmessage() {
		let resdata = {};
		let code = Code.Api.OK.value;

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async readInstantMessage() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {};

		var sql = MysqlConn.mapper.getStatement(
			'message',
			'readInstantMessage',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('message', 'readInstantMessage', sql);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			// transaction
			//connection.beginTransaction();

			let rs = await connection.query(sql);
			if (rs[0].length >= 1) {
				rs[0].forEach(async element => {
					_logger.debug(util.inspect(element));
					// 보내고
					var msgparam = {
						sendid: element.sendid,
						title: element.title,
						message: element.message,
						linkurl: element.linkurl,
						os: element.os,
						pushtoken: element.pushtoken,
						reserved: element.reserved,
						senddate: element.senddate,
						response: '',
					};

					// _logger.debug(`OS: ${msgparam.os.toUpperCase()}`);
					let payload = FireBase.MAKEPAYLOAD(
						msgparam.pushtoken,
						msgparam.title,
						msgparam.message,
						msgparam.linkurl,
					);

					try {
						msgparam.response = await FireBase.SEND(payload);
						_logger.debug(util.inspect(msgparam.response));
					} catch (e) {
						_logger.error(e);
						msgparam.response = e;
					}

					// if (msgparam.os.toUpperCase() == 'ANDROID') {
					// 	let payload = FireBase.MAKEPAYLOAD(
					// 		msgparam.pushtoken,
					// 		msgparam.title,
					// 		msgparam.message,
					// 		msgparam.linkurl,
					// 	);

					// 	try {
					// 		msgparam.response = await FireBase.SEND(payload);
					// 		_logger.debug(util.inspect(msgparam.response));
					// 	} catch (e) {
					// 		_logger.error(e);
					// 		msgparam.response = e;
					// 	}
					// } else {
					// 	let payload = IosApn.MAKEPAYLOAD(
					// 		msgparam.pushtoken,
					// 		msgparam.title,
					// 		msgparam.message,
					// 		msgparam.linkurl,
					// 	);

					// 	try {
					// 		msgparam.response = await IosApn.SEND(
					// 			msgparam.pushtoken,
					// 			payload,
					// 		);
					// 		_logger.debug(util.inspect(msgparam.response));
					// 	} catch (e) {
					// 		_logger.error(e);
					// 		msgparam.response = e;
					// 	}
					// }

					// 삭제 하고
					var delsql = MysqlConn.mapper.getStatement(
						'message',
						'delMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('message', 'delMessage', delsql);
					await connection.query(delsql);

					// 보낸 메시지에 결과와 함께 넣고
					var inssql = MysqlConn.mapper.getStatement(
						'message',
						'insSentMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('message', 'insSentMessage', inssql);
					await connection.query(inssql);
				});
			}

			// commit
			//connection.commit();
		} catch (err) {
			// rollback
			//connection.rollback();

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
			'message',
			'readReservedMessage',
			param,
			_SqlFormat,
		);
		MysqlConn.SQL('message', 'readReservedMessage', sql);

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
						title: element.title,
						message: element.message,
						linkurl: element.linkurl,
						os: element.os,
						pushtoken: element.pushtoken,
						reserved: element.reserved,
						senddate: element.senddate,
						response: '',
					};

					// _logger.debug(`OS: ${msgparam.os.toUpperCase()}`);
					let payload = FireBase.MAKEPAYLOAD(
						msgparam.pushtoken,
						msgparam.title,
						msgparam.message,
						msgparam.linkurl,
					);

					try {
						msgparam.response = await FireBase.SEND(payload);
						_logger.debug(util.inspect(msgparam.response));
					} catch (e) {
						_logger.error(e);
						msgparam.response = e;
					}

					// if (msgparam.os.toUpperCase() == 'ANDROID') {
					// 	let payload = FireBase.MAKEPAYLOAD(
					// 		msgparam.pushtoken,
					// 		msgparam.title,
					// 		msgparam.message,
					// 		msgparam.linkurl,
					// 	);

					// 	try {
					// 		msgparam.response = await FireBase.SEND(payload);
					// 		_logger.debug(util.inspect(msgparam.response));
					// 	} catch (e) {
					// 		_logger.error(e);
					// 		msgparam.response = e;
					// 	}
					// } else {
					// 	let payload = IosApn.MAKEPAYLOAD(
					// 		msgparam.pushtoken,
					// 		msgparam.title,
					// 		msgparam.message,
					// 		msgparam.linkurl,
					// 	);

					// 	try {
					// 		msgparam.response = await IosApn.SEND(
					// 			msgparam.pushtoken,
					// 			payload,
					// 		);
					// 		_logger.debug(util.inspect(msgparam.response));
					// 	} catch (e) {
					// 		_logger.error(e);
					// 		msgparam.response = e;
					// 	}
					// }

					// 삭제 하고
					var delsql = MysqlConn.mapper.getStatement(
						'message',
						'delMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('message', 'delMessage', delsql);
					await connection.query(delsql);

					// 보낸 메시지에 결과와 함께 넣고
					var inssql = MysqlConn.mapper.getStatement(
						'message',
						'insSentMessage',
						msgparam,
						_SqlFormat,
					);
					MysqlConn.SQL('message', 'insSentMessage', inssql);
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

module.exports = SvcMessage;
