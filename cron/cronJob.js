var redis = require('redis');
var redisconfig = require('../config/redis.js');
var redisClient = redis.createClient({
	host: redisconfig.host,
	port: redisconfig.port,
	db: 0,
	password: redisconfig.password,
});
var CronJob = require('cron-cluster')(redisClient).CronJob;
var SvcMessage = require('../services/SvcMessage');
var SvcWebHook = require('../services/SvcWebHook');

// 10초 마다 즉시 요청온 메시지 검사
var instantJob = new CronJob('*/10 * * * * *', function () {
	let svcMessage = new SvcMessage();
	svcMessage.readInstantMessage();

	let svcWebHook = new SvcWebHook();
	svcWebHook.readInstantMessage();
});

// 60초 마다 예약 요청온 메시지 검사
var reservedJob = new CronJob('0 * * * * *', function () {
	let svcMessage = new SvcMessage();
	svcMessage.readReservedMessage();

	let svcWebHook = new SvcWebHook();
	svcWebHook.readReservedMessage();
});

instantJob.start();
reservedJob.start();
