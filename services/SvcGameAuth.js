var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var randomstring = require("randomstring");

var util = require('util');
const Jwt = require('../common/Jwt');

var { RemoteIp } = require('../common/MyUtil');
var SvcRedis = require('../services/SvcRedis');

class SvcGameAuth {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

	async login() {
		let resdata = {};
		let code = Code.Api.OK.value;

		var param = {
			userid: this._body.userid,
			email: this._body.email,
			nickname: this._body.nickname,
		};

		var sql = MysqlConn.MAKESQL('gameauth', 'login', param, _SqlFormat);

		let connection = null;
		try {
			let method = 'Join';

			connection = await MysqlConn.pool.getConnection(async conn => conn);
			let rs = await connection.query(sql);
			if (rs[0].length == 1) {
				// 있으면 로그인
				method = 'Login';

				let svcRedis = new SvcRedis();
				let user = await svcRedis.getMember(this._body.userid);
				//_logger.debug(`UESR == ${util.inspect(user)}`);
			} else {
				// 없으면 회원가입
				param.uuid = randomstring.generate({
					length: 16,
					charset: 'alphanumeric',
					capitalization: 'uppercase'
				});				
				let sql_ins_member = MysqlConn.MAKESQL(
					'gameauth',
					'ins_member',
					param,
					_SqlFormat,
				);
				await connection.query(sql_ins_member);

				// REDIS 유저키 생성
				let svcRedis = new SvcRedis();
				svcRedis.setMember(this._body.userid);
			}

			// 로그인, 회원가입 이력
			var hist_param = {
				userid: this._body.userid,
				method: method,
				ip: RemoteIp(this._req),
			};
			let sql_ins_hist_member = MysqlConn.MAKESQL(
				'gameauth',
				'ins_hist_member',
				hist_param,
				_SqlFormat,
			);
			await connection.query(sql_ins_hist_member);

			let user = {};
			user.id = this._body.userid;
			user.email = this._body.email;
			let jwtToken = await Jwt.sign(user);
			resdata = jwtToken;
		} catch (err) {
			code = Code.Api.DB_ERROR.value;
			_logger.error(err.stack);
		} finally {
			try {
				connection.release();
			} catch (err) {}
		}

		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async logout() {
		let resdata = {};
		let code = Code.Api.OK.value;
		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}

	async authcheck() {
		let resdata = {};
		let code = Code.Api.OK.value;
		this._res.json(new Response(this._cmd, code, resdata, this._t).build());
	}
}

module.exports = SvcGameAuth;
