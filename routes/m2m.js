var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');


/**
 * 1:1 문의
 */
 router.get('/m2m', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/m2m');

		res.render('m2m/m2m', {
			title: title + ' > 1:1 문의',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});


/**
 * 1:1 문의 상세
 */

router.get('/m2m/m2minfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/m2m');

		const param = {};
		param.m2mid = req.query.m2mid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());

		res.render('m2m/m2minfo', {
			title: title + ' > 1:1 문의 상세',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
			userlist: userlist,
		});
	} else {
		res.redirect('/login');
	}
});




module.exports = router;
