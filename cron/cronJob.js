const cron = require('node-cron');
const redis = require('redis');
const redisconfig = require('../config/redis.js');
const { promisify } = require('util');
const SvcMessage = require('../services/SvcMessage');
const SvcWebHook = require('../services/SvcWebHook');

// Redis 클라이언트
const redisClient = redis.createClient({
	host: redisconfig.host,
	port: redisconfig.port,
	db: redisconfig.db,
});

const setAsync = promisify(redisClient.set).bind(redisClient);
const delAsync = promisify(redisClient.del).bind(redisClient);

// 🔐 락 설정
async function tryLock(lockKey, ttlSec = 30) {
	const result = await setAsync(lockKey, 'locked', 'NX', 'EX', ttlSec);
	return result === 'OK';
}

async function releaseLock(lockKey) {
	await delAsync(lockKey);
}

function dateFormat(date, fstr, utc) {
	utc = utc ? 'getUTC' : 'get';
	return fstr.replace(/%[YmdHMS]/g, function (m) {
		switch (m) {
			case '%Y':
				return date[utc + 'FullYear'](); // no leading zeros required
			case '%m':
				m = 1 + date[utc + 'Month']();
				break;
			case '%d':
				m = date[utc + 'Date']();
				break;
			case '%H':
				m = date[utc + 'Hours']();
				break;
			case '%M':
				m = date[utc + 'Minutes']();
				break;
			case '%S':
				m = date[utc + 'Seconds']();
				break;
			default:
				return m.slice(1); // unknown code, remove %
		}
		// add leading zero if required
		return ('0' + m).slice(-2);
	});
}

function printTimeStamp(name) {
	var d = new Date(); // Today!
	let date = dateFormat(d, `${name} %Y-%m-%d %H:%M:%S`, false);
	_logger.debug(date);
}

// 🕒 즉시 메시지 검사 (5초 간격)
cron.schedule('*/5 * * * * *', async () => {
	// printTimeStamp('5 SECONDS');

	const lockKey = 'cron:instantJob:lock';
	const locked = await tryLock(lockKey, 3); // 3초 TTL

	if (!locked) return; // 다른 인스턴스에서 실행 중이면 스킵

	try {
		const svcMessage = new SvcMessage();
		await svcMessage.readInstantMessage();

		const svcWebHook = new SvcWebHook();
		await svcWebHook.readInstantMessage();
	} catch (err) {
		console.error('instantJob error:', err);
	} finally {
		await releaseLock(lockKey);
	}
});

// 🕒 예약 메시지 검사 (60초 간격)
cron.schedule('0 * * * * *', async () => {
	const lockKey = 'cron:reservedJob:lock';
	const locked = await tryLock(lockKey, 30); // 30초 TTL

	if (!locked) return;

	try {
		const svcMessage = new SvcMessage();
		await svcMessage.readReservedMessage();

		const svcWebHook = new SvcWebHook();
		await svcWebHook.readReservedMessage();
	} catch (err) {
		console.error('reservedJob error:', err);
	} finally {
		await releaseLock(lockKey);
	}
});
