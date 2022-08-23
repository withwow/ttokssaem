var redis = require('redis');
var redisconfig = require('../config/redis.js');
var redisClient = redis.createClient({
	host: redisconfig.host,
	port: redisconfig.port,
	db: 2,
	password: redisconfig.password,
});

class SvcRedis {
	async setMember(userid) {
		let user = {};
		user.userid = userid;

		redisClient.hmset(`{user:${userid}}`, user);
	}

	async getMember(userid) {
		return new Promise((resolve, reject) => {
			redisClient.hgetall(`{user:${userid}}`, (err, object) => {
				if (err) {
					reject(err);
				} else {
					resolve(object);
				}
			});
		});
	}
}

module.exports = SvcRedis;
