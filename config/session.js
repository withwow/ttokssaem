var redis = require('redis');
var redisConf = require('./redis');
var expressSession = require('express-session');
var redisStore = require('connect-redis')(expressSession);
var client = redis.createClient({
	host: redisConf.host,
	port: redisConf.port,
	db: 1,
	password: redisConf.password,
});


module.exports = function (app) {
	const session = expressSession({
		secret: 'ttok!@#$7451!35',
		resave: true,
		store: new redisStore({
			client: client,
			ttl: 86400, // 1시간 3600초
		}),
		saveUninitialized: false,
		cookie: {
			//			maxAge: 1000 * 60 * 60 * 1,
		},
	});
	app.use(session);
};
