var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 단어시험 이력 관리
 */
router.get('/vocaexam', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/vocaexam');

		res.render('vocaexam/vocaexam', {
			title: title + ' > 단어시험 이력 관리',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 단어시험 이력 정보
 */
router.get('/vocaexam/vocaexaminfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/vocaexam');

		const param = {};
		param.id = req.query.id;

		let svcCode = new SvcCode();
		const vocalevellist = await svcCode.selCode('VOCALEVEL');

		res.render('vocaexam/vocaexaminfo', {
			title: title + ' > 단어시험 이력 정보',
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
