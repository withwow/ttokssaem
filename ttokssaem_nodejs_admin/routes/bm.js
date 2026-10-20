var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 벌점
 */
router.get('/bm', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/bm');

		res.render('bm/bm', {
			title: title + ' > 벌점',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 벌점 정보
 */
router.get('/bm/bminfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/bm');

		const param = {};
		param.codeid = req.query.codeid;

		let svcCode = new SvcCode();
		const branchlist = await svcCode.selBranchAll();

		res.render('bm/bminfo', {
			title: title + ' > 벌점 정보',
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
