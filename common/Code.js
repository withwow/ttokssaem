var Enum = require('enum');

module.exports.Api = new Enum({
	// COMMON
	OK: 0,

	// SYSTEM
	FAIL: -1,
	UNKNOWN_COMMAND: 1,

	// AUTH
	BAD_REQUEST: 2,
	EXPIRED_TOKEN: 3,
	INVALID_TOKEN: 4,

	// IAP
	ERROR_SETUP: 11,
	ERROR_VALIDATE: 12,
	ERROR_RESPONSE: 13,

	// DATA BASE
	DB_ERROR: 100, // 디비 시스템 에러
	DB_ERROR_COMMAND: 101, // 명령 없음

	// 
	ALREDY_EXIST: 401, // 이미 있음
	NOT_FOUND: 404, // 찾을수 없음, 비밀번호 불일치등

	FORMAT_ERROR: 500, // 찾을수 없음, 비밀번호 불일치등

	API_SERVER_ERROR: 700, // API 서버내 오류

	// FILE UPLOAD
	FILE_UPLOAD_ERROR: 200, // FAIL

	// SESSION-TIMEOUT
	SESSION_TIMEOUT: 999, // SESSION-TIMEOUT
});
