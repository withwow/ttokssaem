var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 학생
 */
router.get('/student', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/branch');

		res.render('student/student', {
			title: title + ' > 학생',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 학생 정보
 */
router.get('/student/studentinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/branch');

		const param = {};
		param.userid = req.query.userid;

		res.render('student/studentinfo', {
			title: title + ' > 학생 정보',
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
