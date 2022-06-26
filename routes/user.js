var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 선생님
 */
router.get('/user', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();

		res.render('user/user', {
			title: title + ' > 일반회원',
			userinfo: userinfo,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 선생님 정보
 */
router.get('/user/userinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();

		const param = {};
		param.userid = req.query.userid;

		res.render('user/userinfo', {
			title: title + ' > 선생님 정보',
			userinfo: userinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
