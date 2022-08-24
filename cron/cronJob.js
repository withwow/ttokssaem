var redis = require('redis');
var redisconfig = require('../config/redis.js');
var redisClient = redis.createClient({
	host: redisconfig.host,
	port: redisconfig.port,
	db: 4,
	password: redisconfig.password,
});
var CronJob = require('cron-cluster')(redisClient).CronJob;

var SvcSchedule = require('../services/SvcSchedule');

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

// 정산
// 3시 20분(서울시간))
var everyDayIncomeJob = new CronJob('0 20 3 * * *', async function () {
	var d = new Date(); // Today!
	let date = dateFormat(d, 'EVERYDAY %Y-%m-%d %H:%M:%S', false);

	// d.setDate(d.getDate() - 1); // Yesterday!
	// let schdate = dateFormat(d, '%Y%m%d', false);
  // let dayofweek = d.getDay();

	// _logger.debug(`CRONJOB : ${schdate}`);
	// _logger.debug(`DAYOFWEEK : ${dayofweek}`);

  // let svcSchedule = new SvcSchedule('', '', '', '', '');
  // svcSchedule.initialization(dayofweek);
});

// everyDayIncomeJob.start();

// 한시간마다 마다
var oneHourJob = new CronJob('0 0 * * * *', async function () {
	var d = new Date(); // Today!

  let date = dateFormat(d, '1HOUR %Y-%m-%d %H:%M:%S', false);
	_logger.debug(date);

	if(d.getHours() === 3){
		// 새벽 3시에~
		
		d.setDate(d.getDate() - 1); // Yesterday!
		let schdate = dateFormat(d, '%Y%m%d', false);
		let dayofweek = d.getDay();
		_logger.debug(`CRONJOB : ${schdate}`);
		_logger.debug(`DAYOFWEEK : ${dayofweek}`);
	
		let svcSchedule = new SvcSchedule('', '', '', '', '');
	  svcSchedule.initialization(dayofweek);
	}

});

oneHourJob.start();

// 10초 마다
var tenSecJob = new CronJob('*/10 * * * * *', async function () {
	var d = new Date(); // Today!

  let date = dateFormat(d, '10SEC %Y-%m-%d %H:%M:%S', false);
	_logger.debug(date);

	d.setDate(d.getDate() - 1); // Yesterday!
	let schdate = dateFormat(d, '%Y%m%d', false);
  let dayofweek = d.getDay();
	// _logger.debug(`CRONJOB : ${schdate}`);
	// _logger.debug(`DAYOFWEEK : ${dayofweek}`);

  // let svcSchedule = new SvcSchedule('', '', '', '', '');
  // svcSchedule.initialization(dayofweek);

});

// tenSecJob.start();
