var redis = require('redis');
var mysqlconfig = require('../config/redis.js');
var redisClient = redis.createClient({
	host: mysqlconfig.host,
	port: mysqlconfig.port,
	db: 0,
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
