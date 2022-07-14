const bodyParser = {
	convBody: async (req, res, next) => {
		req.body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
		next();
	},
};
module.exports = bodyParser;
