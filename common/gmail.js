var nodemailer = require('nodemailer');

module.exports = {
  sendID: function (to, memberid) {
	  var smtpTransport = nodemailer.createTransport({  
		    service: 'gmail',
		    host:'smtp.gmail.com',
		    auth: {
		        user: 'withwow@gmail.com',
		        pass: 'xjxhycrkdweopryx'
		    }
		});

		var mailOptions = {  
		    from: '똑소리나는쌤 관리형 독서실 <noreply@gmail.com>',
		    to: to,
		    subject: '[똑소리나는쌤 관리형 독서실] 아이디 찾기',
		    text: '찾는 아이디는 [  ' + memberid + '  ] 입니다' 
		};

		smtpTransport.sendMail(mailOptions, function(err, res){
		    if (err){
		    	logger.error(err);
		    } else {
		    	logger.info("Message sent : " + response.message);
		    }
		    smtpTransport.close();
		});	  
  },
  sendTempPassword: function (to, pwd) {
	  var smtpTransport = nodemailer.createTransport({  
		    service: 'gmail',
		    host:'smtp.gmail.com',
		    auth: {
					user: 'withwow@gmail.com',
					pass: 'xjxhycrkdweopryx'
		    }
		});

		var mailOptions = {  
			from: '똑소리나는쌤 관리형 독서실 <noreply@gmail.com>',
			to: to,
			subject: '[똑소리나는쌤 관리형 독서실] 비밀번호 찾기',
			text: '임시 비밀번호 [  ' + pwd + '  ] 입니다'  
		};

		smtpTransport.sendMail(mailOptions, function(err, res){
		    if (err){
		    	logger.error(err);
		    } else {
		    	logger.info("Message sent : " + response.message);
		    }
		    smtpTransport.close();
		});	  
  } 
}