var express = require('express');
var router = express.Router();
var util = require('util');

const title = 'TTOKSSAEM';
var SvcSession = require('../services/SvcSession');

/**
 * 처음화면
 */
router.get('/', async function (req, res, next) {
	res.render('index', {title: title});
});

router.get('/privacy', async function (req, res, next) {
	res.render('privacy', {title: title});
});

router.get('/service', async function (req, res, next) {
	res.render('service', {title: title});
});

module.exports = router;
