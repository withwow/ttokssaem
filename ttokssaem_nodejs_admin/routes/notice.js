var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 알림
 */
router.get('/notice', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/user');

		res.render('notice/notice', {
			title: title + ' > 알림',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
