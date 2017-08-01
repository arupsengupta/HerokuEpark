var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res){

	// create reusable transporter object using the default SMTP transport
	var transporter = nodemailer.createTransport({
		host : 'smtp.gmail.com',
		port : 465,
		secure : true, // secure:true for port 465, secure:false for port 587
		auth : {
			user: 'eparkwb@gmail.com',
			pass: 'laskarpur123'
		}
	});

	// setup email data with unicode symbols
	var mailOptions = {
		from : 'eparkwb@gmail.com',
		to : 'arup.asg@gmail.com, soumyadeep.sam@gmail.com',
		subject : 'Hello',
		text : 'Welcome to ePark! Have a good day!!'
		//html : '<b>Hello World</b>'
	};

	// send mail with defined transporter object
	transporter.sendMail(mailOptions, (error, info) => {
		if(error){
			console.log(error);
			return res.status(500).send("Not sent");
		}
		console.log('Message %s sent %s', info.messageId, info.response);
		res.status(200).send('Mail sent');
	});
});

module.exports = router;
