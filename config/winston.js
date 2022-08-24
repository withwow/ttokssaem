const appRoot = require('app-root-path'); // app root 경로를 가져오는 lib
const winston = require('winston'); // winston lib
const process = require('process');

const { combine, timestamp, label, printf } = winston.format;

const timezoned = () => {

	let d = new Date();
  let month = (d.getMonth() + 1).toString();
  let day = d.getDate().toString();
  let year = d.getFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
	let dateString = [year, month, day].join('-');
 
	let hour = d.getHours().toString();
	let min = d.getMinutes().toString();
	let sec = d.getSeconds().toString();
  if (hour.length < 2) {
    hour = '0' + hour;
  }
  if (min.length < 2) {
    min = '0' + min;
  }
  if (sec.length < 2) {
    sec = '0' + sec;
  }
	let timeString = [hour, min, sec].join(':');
 
	let ms = d.getMilliseconds().toString();
  if (ms.length < 2) {
    ms = '00' + ms;
  }
  if (ms.length < 3) {
    ms = '0' + ms;
  }
	timeString = [timeString, ms].join('.');

	return [dateString, timeString].join(' ');
}

const timezoned_utc = () => {

	let d = new Date();
  let month = (d.getUTCMonth() + 1).toString();
  let day = d.getUTCDate().toString();
  let year = d.getUTCFullYear();
  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
	let dateString = [year, month, day].join('-');
 
	let hour = d.getUTCHours().toString();
	let min = d.getUTCMinutes().toString();
	let sec = d.getUTCSeconds().toString();
  if (hour.length < 2) {
    hour = '0' + hour;
  }
  if (min.length < 2) {
    min = '0' + min;
  }
  if (sec.length < 2) {
    sec = '0' + sec;
  }
	let timeString = [hour, min, sec].join(':');

	let ms = d.getMilliseconds().toString();
  if (ms.length < 2) {
    ms = '00' + ms;
  }
  if (ms.length < 3) {
    ms = '0' + ms;
  }
	timeString = [timeString, ms].join('.');

 
	return [dateString, timeString].join(' ');
}


const myFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${level}] ${message}`; // log 출력 포맷 정의
});

const options = {
	// log파일
	file: {
		level: 'debug',
		filename: `${appRoot}/logs/trace.log`, // 로그파일을 남길 경로
		handleExceptions: true,
		json: false,
		maxsize: 5242880, // 5MB
		maxFiles: 5,
		colorize: false,
		format: combine(
			label({ label: 'log' }),
			timestamp({ format: timezoned_utc }),
			myFormat, // log 출력 포맷
		),
	},
	// 개발 시 console에 출력
	console: {
		level: 'debug',
		handleExceptions: true,
		json: false, // 로그형태를 json으로도 뽑을 수 있다.
		colorize: true,
		format: combine(label({ label: 'console' }), timestamp({ format: timezoned }), myFormat),
	},
};

let logger = new winston.createLogger({
	transports: [
		new winston.transports.File(options.file), // 중요! 위에서 선언한 option으로 로그 파일 관리 모듈 transport
	],
	exitOnError: false,
});

if (process.env.NODE_ENV !== 'production') {
	logger.add(new winston.transports.Console(options.console)); // 개발 시 console로도 출력
}

global._logger = logger;

module.exports = logger;
