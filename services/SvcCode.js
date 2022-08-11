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

	async selMemberInfo(memberid) {
		let resdata = {};

		var param = {
			memberid: memberid,
		};
		var sql = MysqlConn.MAKESQL('member', 'selMember', param, _SqlFormat);

		let connection = null;
		try {
			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if(rs[0].length == 1) {
				resdata = rs[0][0];
			}
		} catch (err) {
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		return resdata;
	}

	async selGoodsAll(branchid) {
		let resdata = {};

		var param = {
			branchid: branchid,
		};
		var sql = MysqlConn.MAKESQL('goods', 'selGoodsAll', param, _SqlFormat);

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


	async selUserAll(branchid) {
		let resdata = {};

		var param = {
			branchid: branchid,
		};
		var sql = MysqlConn.MAKESQL('user', 'selUserAll', param, _SqlFormat);

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


	async selParentsAll(memberid) {
		let resdata = {};

		var param = {
			memberid: memberid,
		};
		var sql = MysqlConn.MAKESQL('parents', 'selParentsAll', param, _SqlFormat);

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



	async selCode(codetype) {
		let resdata = {};

		var param = {
			codetype: codetype,
		};
		var sql = MysqlConn.MAKESQL('code', 'selCode', param, _SqlFormat);

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
