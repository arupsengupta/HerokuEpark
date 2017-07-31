var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res){

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer({
		host : 'smtp.gmail.com',
		port : 465,
		secure : true, // secure:true for port 465, secure:false for port 587
		auth : {
			user: 'arupsenmail@gmail.com',
			pass: 'sen3basu#'
		}
	});

	// setup email data with unicode symbols
	var mailOptions = {
		from : '"Arup Sengupta" <arupsenmail@gmail.com"',
		to : 'arup.asg@gmail.com',
		subject : 'Hello',
		text : 'Hello World',
		html : '<b>Hello World</b>'
	};

	// send mail with defined transporter object
	transporter.sendMail(mailOptions, (error, info) => {
		if(error){
			return console.log(error);
		}
		console.log('Message %s sent %s', info.messageId, info.response);
	});
});

module.exports = router;
