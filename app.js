var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');


var dotenv = require('dotenv');
dotenv.config();

var app = express();

// logger - winston, morgan
require('./config/winston');
require('./config/morgan')(app);

// session
require('./config/session')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//route
var indexRouter = require('./routes/index');
var cmmRouter = require('./routes/cmm');

var branchRouter = require('./routes/branch');
var userRouter = require('./routes/user');
var memberRouter = require('./routes/member');
var goodsRouter = require('./routes/goods');
var studentRouter = require('./routes/student');
var parentsRouter = require('./routes/parents');
var scheduleRouter = require('./routes/schedule');
var popupRouter = require('./routes/popup');
var noticeRouter = require('./routes/notice');
var blackmarkRouter = require('./routes/blackmark');
var paymentRouter = require('./routes/payment');
var attendanceRouter = require('./routes/attendance');

app.use('/', indexRouter);
require('./routes/indexapi')(app);

require('./routes/auth')(app);

app.use('/', cmmRouter);
require('./routes/cmmapi')(app);

app.use('/', branchRouter);
require('./routes/branchapi')(app);

app.use('/', userRouter);
require('./routes/userapi')(app);

app.use('/', memberRouter);
require('./routes/memberapi')(app);

app.use('/', goodsRouter);
require('./routes/goodsapi')(app);

app.use('/', studentRouter);
require('./routes/studentapi')(app);

app.use('/', parentsRouter);
require('./routes/parentsapi')(app);

app.use('/', scheduleRouter);
require('./routes/scheduleapi')(app);

app.use('/', popupRouter);
require('./routes/popupapi')(app);

require('./routes/studyplanapi')(app);

app.use('/', noticeRouter);
require('./routes/noticeapi')(app);

app.use('/', blackmarkRouter);
require('./routes/blackmarkapi')(app);

app.use('/', paymentRouter);
require('./routes/paymentapi')(app);

app.use('/', attendanceRouter);
require('./routes/attendanceapi')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

require('./cron/cronJob');

module.exports = app;
