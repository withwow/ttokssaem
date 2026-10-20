var Enum = require('enum');

module.exports.Api = new Enum({
	// COMMON
	OK: 200,

	// SYSTEM
	FAIL: -1,
	UNKNOWN_COMMAND: 1,

	// AUTH
	INVALID_PASSWORD: 401, // 비밀번호 오류
	USER_NOT_FOUND: 404, // 없음
	ALREADY_EXIST: 409, //  이미 있음

	// IAP
	ERROR_SETUP: 11,
	ERROR_VALIDATE: 12,
	ERROR_RESPONSE: 13,

	// DATA BASE
	DB_ERROR: 100, // 디비 시스템 에러
	DB_ERROR_COMMAND: 101, // 명령 없음

	// FILE UPLOAD
	FILE_UPLOAD_ERROR: 200, // FAIL

	// SESSION-TIMEOUT
	SESSION_TIMEOUT: 999, // SESSION-TIMEOUT
});
