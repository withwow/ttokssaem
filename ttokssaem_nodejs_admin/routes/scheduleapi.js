var Response = require('../common/Response');
var ElapsedTimer = require('../common/ElapsedTimer');

var util = require('util');
var path = require('path');

const multer = require('multer');

var SvcSession = require('../services/SvcSession');
var SvcSchedule = require('../services/SvcSchedule');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let random = Math.floor(Math.random() * (1000000 - 1)) + 1;
     cb(null, Date.now() + "_" + random);
  },
});

const upload = multer({ storage: storage });

const masterplanXLSX = async (req, res, next) => {
  try {
    let path = req.file.path;

    return res.status(201).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = function (app) {

	/*
	upload 마스터 플랜
	*/
  app.post('/v1/masterplan', upload.single('masterplanfiles'), function (req, res) {
   	let cmd = '/v1/masterplan';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}


    const uploadfile = `${req.file.path}`;
    _logger.debug(`FILE == ${uploadfile}`);

    // [Object: null prototype] ==> 제거
    const obj = JSON.parse(JSON.stringify(req.body));
		obj.session_branchid = svcSession.getBranchId();
		obj.uploadfile = uploadfile;

    _logger.debug(`BODY == ${util.inspect(obj)}`);

		let svc = new SvcSchedule(cmd, obj, req, res, t);
		svc.createMasterplan();

	});

	/*
	upload 실행 플랜
	*/
  app.post('/v1/runtimeplan', upload.single('runtimeplanfiles'), function (req, res) {
		let cmd = '/v1/runtimeplan';
	 _logger.debug(`POST == ${cmd}`);

	 var t = new ElapsedTimer();

	 let svcSession = new SvcSession(req);
	 let islogin = svcSession.isLogin();
	 if (!islogin) {
		 _logger.debug(`SESSTION TIMEOUT`);
		 res.json(new Response(cmd, '999', {}, t).build());
		 return;
	 }


	 const uploadfile = `${req.file.path}`;
	 _logger.debug(`FILE == ${uploadfile}`);

	 // [Object: null prototype] ==> 제거
	 const obj = JSON.parse(JSON.stringify(req.body));
	 obj.session_branchid = svcSession.getBranchId();
	 obj.uploadfile = uploadfile;

	 _logger.debug(`BODY == ${util.inspect(obj)}`);

	 let svc = new SvcSchedule(cmd, obj, req, res, t);
	 svc.updateRuntimeplan();

 });

  /*
	마스터 플랜을 실행 플랜으로 복사
	*/
	app.post('/v1/copyMasterToRuntimePlan', function (req, res) {
		let cmd = '/v1/copyMasterToRuntimePlan';
		_logger.debug(`POST == ${cmd}`);

		var t = new ElapsedTimer();

		let svcSession = new SvcSession(req);
		let islogin = svcSession.isLogin();
		if (!islogin) {
			_logger.debug(`SESSTION TIMEOUT`);
			res.json(new Response(cmd, '999', {}, t).build());
			return;
		}

		req.body.session_branchid = svcSession.getBranchId();

		_logger.debug(util.inspect(req.body));

		let svc = new SvcSchedule(cmd, req.body, req, res, t);
		svc.copyMasterToRuntimePlan();
	});

};
