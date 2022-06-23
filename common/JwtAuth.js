var Response = require('../common/Response');
var Code = require('../common/Code');
var ElapsedTimer = require('../common/ElapsedTimer');
var url = require('url');
const Jwt = require('../common/Jwt');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const JwtAuth = {
	checkToken: async (req, res, next) => {
		var token = req.headers.accesstoken;
		var parsedUrl = url.parse(req.url);
		var cmd = parsedUrl.pathname;
		// 토큰 없음
		if (!token) {
			let t = new ElapsedTimer();
			return res.json(
				new Response(cmd, Code.Api.BAD_REQUEST.value, {}, t).build(),
			);
		}
		// decode
		const user = await Jwt.verify(token);
		// 유효기간 만료
		if (user === TOKEN_EXPIRED) {
			let t = new ElapsedTimer();
			return res.json(
				new Response(cmd, Code.Api.EXPIRED_TOKEN.value, {}, t).build(),
			);
		}
		// 유효하지 않는 토큰
		if (user === TOKEN_INVALID) {
			let t = new ElapsedTimer();
			return res.json(
				new Response(cmd, Code.Api.INVALID_TOKEN.value, {}, t).build(),
			);
		}
		if (user.id === undefined) {
			let t = new ElapsedTimer();
			return res.json(
				new Response(cmd, Code.Api.INVALID_TOKEN.value, {}, t).build(),
			);
		}
		req.body.userid = user.id;
		next();
	},
};

module.exports = JwtAuth;
