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
	'xml/schedule.xml',
	'xml/studyplan.xml',
	'xml/attendance.xml',
	'xml/student.xml',
	'xml/memo.xml',
	'xml/m2m.xml',
	'xml/bm.xml',
	'xml/voca.xml',
	'xml/vocaplan.xml',
	'xml/vocatest.xml',
	'xml/vocaexam.xml',
	'xml/vocahist.xml',
	'xml/vocasolve.xml',
]);

// LIMIT ${length} OFFSET ${start}는 문자열 그대로 들어가므로, 정수 문자열만 통과시킨다(SQL 인젝션 방지).
// 빈 문자열/undefined는 그대로 두어 <if test="start != undefined and start !=''"> 판단을 바꾸지 않는다.
function toIntString(value, fallback) {
	var n = parseInt(value, 10);
	return String(isNaN(n) ? fallback : n);
}

function MAKESQL(namespace, id, param, _sqlformat) {
	if (param && typeof param === 'object' && !Array.isArray(param)) {
		if (param.start !== undefined && param.start !== '') param.start = toIntString(param.start, 0);
		if (param.length !== undefined && param.length !== '') param.length = toIntString(param.length, 10);
	}
	var sql = mybatismapper.getStatement(namespace, id, param, _sqlformat);
	SQL(namespace, id, sql);
	return sql;
}

function SQL(namespace, id, query) {
	if (namespace != '' 
		&& id != 'checkVocaPlan'
		&& id != 'checkRequestTest'
		&& id != 'checkM2M' 
		&& id != 'checkMemo' 
		&& id != 'allVocaPlan' 
		&& id != 'selStudentList' 
		&& id != 'lastRuntimePlanStaus' 
		&& id != 'lastAttendanceStaus' 
		&& id != 'selStudentSortOrderList'
	) {
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

