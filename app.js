var app = require('express')();
var db = require('./db');
var path = require('path');
var express = require('express');
var schedule = require('node-schedule');

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE");
  return next();
});

var UserController = require('./User/UserController');
var LocationController = require('./Location/LocationController');
var SensorController = require('./Sensor/SensorController');
var BookingController = require('./Booking/BookingController');
var OperatorController = require('./Operator/OperatorController');
var PushController = require('./Push/PushController');
var MailController = require('./Mail/MailController');
var unbookScheduler = require('./Scheduler/Schedule');

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

module.exports = app;
