var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 테스트 관리
 */
router.get('/vocatest', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/vocatest');

		res.render('vocatest/vocatest', {
			title: title + ' > 테스트 관리',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 테스트 관리 정보
 */
router.get('/vocatest/vocatestinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/vocatest');

		const param = {};
		param.memberid = req.query.memberid;
		param.memodate = req.query.memodate;
		param.degree = req.query.degree;

		let svcCode = new SvcCode();
		const vocalevellist = await svcCode.selCode('VOCALEVEL');

		res.render('vocatest/vocatestinfo', {
			title: title + ' > 테스트 관리 정보',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
			param: param,
			vocalevellist: vocalevellist,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
