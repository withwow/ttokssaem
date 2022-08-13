var express = require('express');
var router = express.Router();
var util = require('util');

const title = '똑소리나는샘 관리형 독서실';
var SvcCode = require('../services/SvcCode');
var SvcSession = require('../services/SvcSession');

/**
 * 회원목록
 */
 router.get('/popup/memberlist', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.type = req.query.type;

		res.render('popup/memberlist', {
			title: title + ' > 학부모 목록',
			userinfo: userinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});


/**
 * 학교 목록
 */
router.get('/popup/schoollist', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};

		res.render('popup/schoollist', {
			title: title + ' > 학교목록',
			userinfo: userinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 결제
 */
 router.get('/popup/payment', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const goodslist = await svcCode.selGoodsAll(svcSession.getBranchId());
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/payment', {
			title: title + ' > 결제',
			userinfo: userinfo,
			userlist: userlist,
			goodslist: goodslist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});


/**
 * 벌점
 */
 router.get('/popup/blackmark', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const blackmarklist = await svcCode.selCode('BLACKMARK');
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/blackmark', {
			title: title + ' > 벌점',
			userinfo: userinfo,
			userlist: userlist,
			blackmarklist: blackmarklist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 학사
 */
 router.get('/popup/affair', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const affairlist = await svcCode.selCode('AFFAIR');
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/affair', {
			title: title + ' > 학사',
			userinfo: userinfo,
			userlist: userlist,
			affairlist: affairlist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});


/**
 * 학부모
 */
 router.get('/popup/parents', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const parentslist = await svcCode.selParentsAll(req.query.memberid);
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/parents', {
			title: title + ' > 학부모',
			userinfo: userinfo,
			userlist: userlist,
			parentslist: parentslist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 스케쥴
 */
router.get('/popup/schedule', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const masterplanlist = await svcCode.selMasterPlan(req.query.memberid);
		const runtimeplanlist = await svcCode.selRuntimePlan(req.query.memberid);
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/schedule', {
			title: title + ' > 스케쥴',
			userinfo: userinfo,
			userlist: userlist,
			masterplanlist: masterplanlist,
			runtimeplanlist: runtimeplanlist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});

/**
 * 학습계획
 */
 router.get('/popup/studyplan', async function (req, res, next) {
	let svcSession = new SvcSession(req);
	let islogin = svcSession.isLogin();

	if (islogin) {
		const userinfo = svcSession.getUserInfo();
		const param = {};
		param.memberid = req.query.memberid;

		let svcCode = new SvcCode();
		const userlist = await svcCode.selUserAll(svcSession.getBranchId());
		const memberinfo = await svcCode.selMemberInfo(req.query.memberid);

		res.render('popup/studyplan', {
			title: title + ' > 학습계획',
			userinfo: userinfo,
			userlist: userlist,
			memberinfo: memberinfo,
			param: param,
		});
	} else {
		res.redirect('/login');
	}
});


module.exports = router;
