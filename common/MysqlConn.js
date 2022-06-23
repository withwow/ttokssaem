var mysql = require('mysql2/promise');
var mysqlconfig = require('../config/mysql.js');
var pool = mysql.createPool(mysqlconfig);
var mybatismapper = require('mybatis-mapper');

// create the myBatisMapper from xml file
mybatismapper.createMapper([
	'xml/common.xml',
	'xml/gameauth.xml',
	'xml/member.xml',
	'xml/iap.xml',
]);

function SQL(namespace, id, query) {
	if (namespace == '') {
		_logger.debug(`== SQL ${namespace}:${id}`);
		_logger.debug(`\n${query}`);
	}
}

module.exports = {
	mapper: mybatismapper,
	pool: pool,
	SQL: SQL,
};
