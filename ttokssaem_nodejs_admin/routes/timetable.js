var express = require('express');
var router = express.Router();

const title = '똑소리나는샘 관리형 독서실';
var SvcSession = require('../services/SvcSession');

/**
 * 시간표 기간 관리 (수능/평시 자동 전환)
 */
router.get('/timetable', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const menulist = svcSession.getMenuList();
		const permission = svcSession.getPermission('/timetable');

		if (permission.read !== 'Y') {
			res.redirect('/');
			return;
		}

		res.render('timetable/timetable', {
			title: title + ' > 시간표 기간 관리',
			userinfo: userinfo,
			menulist: menulist,
			permission: permission,
		});
	} else {
		res.redirect('/login');
	}
});

module.exports = router;
