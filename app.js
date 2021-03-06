var app = require('express')();
var db = require('./db');
var path = require('path');
var express = require('express');
var schedule = require('node-schedule');
var helmet = require('helmet');

app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  return next();
});

// app.OPTIONS("*", function(req, res){
//   res.send(200);
// });

var UserController = require('./User/UserController');
var LocationController = require('./Location/LocationController');
var SensorController = require('./Sensor/SensorController');
var BookingController = require('./Booking/BookingController');
var OperatorController = require('./Operator/OperatorController');
var PushController = require('./Push/PushController');
var MailController = require('./Mail/MailController');
var unbookScheduler = require('./Scheduler/Schedule');
var LocationAdminController = require('./LocationAdmin/LocationAdminController');
var CorporateController = require('./Corporate/CorporateController');

/* scheduler start */
var j =  schedule.scheduleJob(unbookScheduler.cronExprUnbook, unbookScheduler.func);
var k = schedule.scheduleJob(unbookScheduler.cronExprExpire, unbookScheduler.expireFunc);
/* scheduler end */

app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'public','index.html'));
});

app.set('view engine', 'ejs');

app.use('/users', UserController);
app.use('/location',LocationController);
app.use('/device', SensorController);
app.use('/booking', BookingController);
app.use('/operator', OperatorController);
app.use('/push', PushController.router);
app.use('/locationAdmin', LocationAdminController);
app.use('/corporate', CorporateController);

module.exports = app;
