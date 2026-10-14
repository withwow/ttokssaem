var morgan = require('morgan');
const appRoot = require('app-root-path'); // app root 경로를 가져오는 lib
var rfs = require('rotating-file-stream'); // version 2.x

module.exports = function (app) {
	// create a rotating write stream
	var accessLogStream = rfs.createStream('access.log', {
		interval: '1d', // rotate daily
		path: `${appRoot}/logs`,
	});

	// Measured from middleware entry, including session loading and response completion.
	morgan.token('request-total-ms', function (req) {
		const elapsed = process.hrtime(req._accessStartedAt);
		return (elapsed[0] * 1000 + elapsed[1] / 1e6).toFixed(3);
	});
	app.use(function (req, res, next) {
		req._accessStartedAt = process.hrtime();
		next();
	});
	app.use(morgan(morgan.common + ' response_ms=:response-time total_ms=:request-total-ms', { stream: accessLogStream }));
};
