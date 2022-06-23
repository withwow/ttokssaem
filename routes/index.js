var express = require('express');
var router = express.Router();

const title = 'ROBO CASTLE';

/**
 * 처음화면
 */
router.get('/', async function (req, res, next) {
	res.render('index', {
		title: title,
	});
});

module.exports = router;
