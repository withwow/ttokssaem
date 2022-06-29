var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 일반회원
 */
router.get('/member', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/member');

		res.render('member/member', {
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
 * 일반회원 정보
 */
router.get('/member/memberinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/member');

		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const branchlist = await svcCode.selBranchAll();

		res.render('member/memberinfo', {
			title: title + ' > 일반회원',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
			branchlist: branchlist,			
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
