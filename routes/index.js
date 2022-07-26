var express = require('express');
var router = express.Router();
var util = require('util');

const title = 'TTOKSSAEM';
var SvcSession = require('../services/SvcSession');

/**
 * 처음화면
 */
router.get('/', async function (req, res, next) {
	res.render('index', {title: title + ' > 홈페이지'});
});

module.exports = router;
