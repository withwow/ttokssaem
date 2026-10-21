var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');
var JwtAuth = require('../common/JwtAuth').checkToken;
var SvcPenalty = require('../services/SvcPenalty');

module.exports = function (app) {
	app.all('/api/v1/selPenaltyDetail', JwtAuth, function (req, res) {
		let cmd = '/api/v1/selPenaltyDetail';
		let t = new ElapsedTimer();
		let svc = new SvcPenalty(cmd, req.body, req, res, t);
		svc.selPenaltyDetail();
	});
};
