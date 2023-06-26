var redis = require('redis');
var redisconfig = require('../config/redis.js');
var redisClient = redis.createClient({
	host: redisconfig.host,
	port: redisconfig.port,
	db: redisconfig.db,
	password: redisconfig.password,
});
var CronJob = require('cron-cluster')(redisClient).CronJob;

var SvcSchedule = require('../services/SvcSchedule');
var SvcPayment = require('../services/SvcPayment');
var SvcVocaPlan = require('../services/SvcVocaPlan');

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


// 스케줄 초기화
// 3시 20분(서울시간))
var everyDayScheduleJob = new CronJob('0 20 3 * * *', async function () {
	var d = new Date(); // Today!
	let date = dateFormat(d, 'EVERYDAY %Y-%m-%d %H:%M:%S', false);
	_logger.debug(date);

	d.setDate(d.getDate() - 1); // Yesterday!
	let schdate = dateFormat(d, '%Y%m%d', false);
	let dayofweek = d.getDay();

	_logger.debug(`CRONJOB : ${schdate}`);
	_logger.debug(`DAYOFWEEK : ${dayofweek}`);

	let svcSchedule = new SvcSchedule('', '', '', '', '');
	svcSchedule.initialization(dayofweek);
});

// 알림
// 14시 20분(서울시간))
var everyDayJob = new CronJob('0 20 14 * * *', async function () {
	var d = new Date(); // Today!
	let date = dateFormat(d, 'EVERYDAY %Y-%m-%d %H:%M:%S', false);
	_logger.debug(date);

	d.setDate(d.getDate()); // Today!
	let schdate = dateFormat(d, '%Y-%m-%d', false);
	_logger.debug(`CRONJOB : ${schdate}`);

  let svcPayment = new SvcPayment('', '', '', '', '');
  svcPayment.before3Days(schdate);
  svcPayment.before0Days(schdate);
});

// 0초 마다
var oneMinJob = new CronJob('0 * * * * *', async function () {
	var d = new Date(); // Today!
	let date = dateFormat(d, 'EVERY MINUTE %Y-%m-%d %H:%M:%S', false);
	_logger.debug(date);

	d.setHours(d.getHours() - 2); // 02시까지 영업이니
	let memodate = dateFormat(d, '%Y%m%d', false);
	let dayofweek = d.getDay();

	_logger.debug(`CRONJOB : ${memodate}`);
	_logger.debug(`DAYOFWEEK : ${dayofweek}`);

  let svcVocaPlan = new SvcVocaPlan('', '', '', '', '');
  svcVocaPlan.setMemoPlan(memodate, dayofweek);

});


// 10초 마다
var tenSecJob = new CronJob('*/10 * * * * *', async function () {

});

everyDayScheduleJob.start();
everyDayJob.start();

oneMinJob.start();

// tenSecJob.start();
