var redis = require('redis');
var redisConf = require('./redis');
var expressSession = require('express-session');
var redisStore = require('connect-redis')(expressSession);
var client = redis.createClient({
	host: redisConf.host,
	port: redisConf.port,
	db: redisConf.db,
	password: redisConf.password,
});

module.exports = function (app) {
	const session = expressSession({
		secret: 'ttok!@#$7451!36',
		resave: false, // 바뀐 세션만 저장. 만료 연장은 connect-redis touch(EXPIRE)가 맡는다.
		store: new redisStore({
			client: client,
			ttl: 3600, // 1시간 3600초
		}),
		saveUninitialized: false,
		cookie: {
			//			maxAge: 1000 * 60 * 60 * 1,
		},
	});
	app.use(session);
};
