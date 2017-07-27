var app = require('express')();
var db = require('./db');
var path = require('path');
var express = require('express');

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

var UserController = require('./User/UserController');
var LocationController = require('./Location/LocationController');
var SensorController = require('./Sensor/SensorController');
var BookingController = require('./Booking/BookingController');
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,'public','index.html'));
});
app.use('/users', UserController);
app.use('/location',LocationController);
app.use('/pushData', SensorController);
app.use('/booking', BookingController);

module.exports = app;
