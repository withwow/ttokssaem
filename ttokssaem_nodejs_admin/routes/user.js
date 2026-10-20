var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 선생님
 */
router.get('/user', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/user');

		res.render('user/user', {
			title: title + ' > 일반회원',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
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
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/user');

		const param = {};
		param.userid = req.query.userid;

		let svcCode = new SvcCode();
		const authlist = await svcCode.selAuthAll();
		const branchlist = await svcCode.selBranchAll();

		res.render('user/userinfo', {
			title: title + ' > 선생님 정보',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
			authlist: authlist,
			branchlist: branchlist,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
