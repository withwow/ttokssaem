var express = require('express');
var router = express.Router();
var util = require('util');

const title = 'ROBO CASTLE';
var SvcSession = require('../services/SvcSession');

/**
 * 일반회원
 */
router.get('/member', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();

		res.render('membership/member', {
			title: title + ' > 일반회원',
			userinfo: userinfo,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 일반회원 정보
 */
router.get('/member/memberinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();

		const param = {};
		param.userid = req.query.userid;

		res.render('membership/memberinfo', {
			title: title + ' > 일반회원',
			userinfo: userinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
