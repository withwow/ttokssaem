var Response = require('../common/Response');
var Code = require('../common/Code');
var MysqlConn = require('../common/MysqlConn.js');
var _SqlFormat = { language: 'sql', indent: '  ' };

var util = require('util');
var { RemoteIp } = require('../common/MyUtil');

const IAP_VALID_CHECK = require('in-app-purchase');
IAP_VALID_CHECK.config({
	appleExcludeOldTransactions: true,
	applePassword: 'applepassword',
	googlePublicKeyStrSandbox:
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEGxiHSdK/qDqe0kZJLi+xyC286ll2vnKVAaa5z/fh2yNiJcFfOwO06vzaJu2M/X4qaS1gfM9gM3A6jr+7ZuOF0dxLdilbUhpIMKRNub153IlhTsCAwbOUqV8tLuPJvGb5yVnNrrN6zghsz/5m8i2yIXMNsift+FyX7QD65Vka/r1ho7IT8OxfuMY3HvBaxKmXSIz+4W6VoDVEN4q4O7l2Ff4muz+G6gR+e8+PdwgL/zdrO/GJ2ElutKVx4cSLC70iTzFDFMqMHY4BmBANL0f4ec+NEO4uSjOI05U1lh5w4vrlImK+kFeu3Zr2zqrsr9NhbT6sXrAOcxE9V9mAhn3wIDAQAB',
	googlePublicKeyStrLive:
		'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEGxiHSdK/qDqe0kZJLi+xyC286ll2vnKVAaa5z/fh2yNiJcFfOwO06vzaJu2M/X4qaS1gfM9gM3A6jr+7ZuOF0dxLdilbUhpIMKRNub153IlhTsCAwbOUqV8tLuPJvGb5yVnNrrN6zghsz/5m8i2yIXMNsift+FyX7QD65Vka/r1ho7IT8OxfuMY3HvBaxKmXSIz+4W6VoDVEN4q4O7l2Ff4muz+G6gR+e8+PdwgL/zdrO/GJ2ElutKVx4cSLC70iTzFDFMqMHY4BmBANL0f4ec+NEO4uSjOI05U1lh5w4vrlImK+kFeu3Zr2zqrsr9NhbT6sXrAOcxE9V9mAhn3wIDAQAB',
});

class SvcIap {
	constructor(cmd, body, req, res, t) {
		(this._cmd = cmd), (this._body = body);
		this._req = req;
		this._res = res;
		this._t = t;
	}

}

module.exports = SvcIap;
