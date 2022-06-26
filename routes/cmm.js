var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 권한관리
 */
router.get('/auth', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/auth');

		res.render('cmm/auth', {
			title: title + ' > 권한관리',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 권한 정보
 */
router.get('/auth/authinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/auth');

		const param = {};
		param.auth_id = req.query.auth_id;

		res.render('cmm/auth/authinfo', {
			title: title + ' > 권한정보',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 메뉴관리
 */
router.get('/menu', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/menu');

		res.render('cmm/menu', {
			title: title + ' > 메뉴관리',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 메뉴관리
 */
router.get('/menu/menuinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/menu');

		const param = {};
		param.menu_id = req.query.menu_id;

		res.render('cmm/menu/menuinfo', {
			title: title + ' > 메뉴정보',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 권한&메뉴 매핑
 */
router.get('/auth_menu', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/auth_menu');

		res.render('cmm/auth_menu', {
			title: title + ' > 권한&메뉴 매핑',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
