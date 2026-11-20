var mysql = require('mysql2/promise');
var mysqlconfig = require('../config/mysql.js');
var pool = mysql.createPool(mysqlconfig);
var mybatismapper = require('mybatis-mapper');

// create the myBatisMapper from xml file
mybatismapper.createMapper([
	'xml/common.xml',
	'xml/auth.xml',
	'xml/member.xml',
	'xml/withdraw.xml',
	'xml/notice.xml',
	'xml/studyplan.xml',
	'xml/student.xml',
	'xml/penalty.xml',
	'xml/attendance.xml',
	'xml/parents.xml',
	'xml/push.xml',
	'xml/m2m.xml',
	'xml/voca.xml',
	'xml/appchecker.xml',
	'xml/timetable.xml',
]);

// LIMIT ${length} OFFSET ${start}는 문자열 그대로 들어가므로, 정수 문자열만 통과시킨다(SQL 인젝션 방지).
// undefined, 빈 문자열은 그대로 두어 <if test="start != undefined and start !=''"> 판단을 바꾸지 않는다.
function toIntString(value, fallback) {
	var n = parseInt(value, 10);
	return String(isNaN(n) ? fallback : n);
}

function MAKESQL(namespace, id, param, _sqlformat) {
	// 호출한 쪽은 param.start + param.length로 남은 건수를 계산하므로 원본은 바꾸지 않는다.
	if (param && typeof param === 'object' && !Array.isArray(param)) {
		param = Object.assign({}, param);
		if (param.start !== undefined && param.start !== '' && param.start !== null) param.start = toIntString(param.start, 0);
		if (param.length !== undefined && param.length !== '' && param.length !== null) param.length = toIntString(param.length, 10);
	}
	var sql = mybatismapper.getStatement(namespace, id, param, _sqlformat);
	SQL(namespace, id, sql);
	return sql;
}

function SQL(namespace, id, query) {
	if (id != '') {
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
