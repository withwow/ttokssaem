var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 학교 목록
 */
router.get('/popup/schoollist', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};

		res.render('popup/schoollist', {
			title: title + ' > 학교목록',
			userinfo: userinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
