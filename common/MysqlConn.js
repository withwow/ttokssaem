var mysql = require('mysql2/promise');
var mysqlconfig = require('../config/mysql.js');
var pool = mysql.createPool(mysqlconfig);
var mybatismapper = require('mybatis-mapper');

// create the myBatisMapper from xml file
mybatismapper.createMapper([
	'xml/common.xml',
	'xml/auth.xml',
	'xml/authmenu.xml',
	'xml/menu.xml',
	'xml/user.xml',
	'xml/member.xml',
	'xml/branch.xml',
	'xml/goods.xml',
	'xml/code.xml',
	'xml/payment.xml',
	'xml/blackmark.xml',
	'xml/parents.xml',
	'xml/notice.xml',
	'xml/push.xml',
]);

function MAKESQL(namespace, id, param, _sqlformat) {
	var sql = mybatismapper.getStatement(namespace, id, param, _sqlformat);
	SQL(namespace, id, sql);
	return sql;
}

function SQL(namespace, id, query) {
	if (namespace != '') {
		_logger.debug(`== SQL ${namespace}:${id}`);
		_logger.debug(`\n${query}`);
	}
}

module.exports = {
	mapper: mybatismapper,
	pool: pool,
	MAKESQL: MAKESQL,
	SQL: SQL,
};

