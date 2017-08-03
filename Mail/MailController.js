// var express = require('express');
// var router = express.Router();
var nodemailer = require('nodemailer');

var Booking = require('../Booking/Booking');

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

var sendWelcome = function(req, res, next){
	var email = req.user.email;
	res.render('templates/welcome', function(err, html){
		if(err){
			console.log('Error rendering html template: ', err);
			return;
		}else {
			// setup email data with unicode symbols
			var mailOptions = {
				from : 'eparkwb@gmail.com',
				to : email,
				subject : 'Welcome to ePark',
				generateTextFromHtml : true,
				//text : 'Welcome to ePark! Have a good day!!'
				html : html
			};
			// send mail with defined transporter object
			transporter.sendMail(mailOptions, (error, info) => {
				if(error){
					console.log(error);
					return res.status(500).send("Not sent");
				}
				console.log('Message %s sent %s', info.messageId, info.response);
				res.status(200).send(req.user);
			});
		}
	});
};

var sendReceipt = function(req, res, next){
	Booking.findOne({_id: req.booking_id, type: {$ne : 'manual'}}).populate({path:'parking_id', select:'name hourly_price'}).populate('user_id','name email phone').exec(function(err, booking){
    if(err) return res.status(500).send("Error getting booking details");
		var email_to = booking.user_id.email;
		res.render('templates/receipt', {booking: booking},function(err, html){
			if(err){
				console.log('Error rendering html template: ', err);
				return;
			}else {
				// setup email data with unicode symbols
				var mailOptions = {
					from : 'eparkwb@gmail.com',
					to : email_to,
					subject : 'Booking Receipt',
					generateTextFromHtml : true,
					//text : 'Welcome to ePark! Have a good day!!'
					html : html
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
			}
		});
  });
};

module.exports.welcomeFunc = sendWelcome;
module.exports.receiptFunc = sendReceipt;
