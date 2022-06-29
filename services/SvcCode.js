var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

class SvcCode {
	constructor() {}

	async selAuthAll() {
		let resdata = {};

		var param = {
			query: '',
		};
		var sql = MysqlConn.MAKESQL('auth', 'selAuthAll', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			resdata = rs[0];
		} catch (err) {
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		return resdata;
	}


	async selAuthAll() {
		let resdata = {};

		var param = {
			query: '',
		};
		var sql = MysqlConn.MAKESQL('auth', 'selAuthAll', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			resdata = rs[0];
		} catch (err) {
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		return resdata;
	}

	async selBranchAll() {
		let resdata = {};

		var param = {
			query: '',
		};
		var sql = MysqlConn.MAKESQL('branch', 'selBranchAll', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			resdata = rs[0];
		} catch (err) {
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		return resdata;
	}
}

module.exports = SvcCode;
