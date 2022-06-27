var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 상품
 */
router.get('/goods', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/branch');

		res.render('goods/goods', {
			title: title + ' > 상품',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 상품 정보
 */
router.get('/goods/goodsinfo', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/branch');

		const param = {};
		param.goodsid = req.query.goodsid;

		res.render('goods/goodsinfo', {
			title: title + ' > 상품 정보',
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
