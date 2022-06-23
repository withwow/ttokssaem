var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 처음화면
 */
router.get('/', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();

		res.render('index', {
			title: title + '',
			userinfo: userinfo,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 로그인
 */
router.get('/login', function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		res.redirect('/');
	} else {
		res.render('login', { title: title + '' });
	}
});

module.exports = router;
