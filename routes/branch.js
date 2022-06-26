var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 지점
 */
router.get('/branch', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/branch');

		res.render('branch/branch', {
			title: title + ' > 지점',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 지점 정보
 */
router.get('/branch/branchinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/auth');

		const param = {};
		param.branchid = req.query.branchid;

		res.render('branch/branchinfo', {
			title: title + ' > 지점 정보',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
