var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 단어장
 */
router.get('/voca', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/voca');

		res.render('voca/voca', {
			title: title + ' > 단어장',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 단어장 정보
 */
router.get('/voca/vocainfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/voca');

		const param = {};
		param.id = req.query.id;

		let svcCode = new SvcCode();
		const vocalevellist = await svcCode.selCode('VOCALEVEL');

		res.render('voca/vocainfo', {
			title: title + ' > 단어장 정보',
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
