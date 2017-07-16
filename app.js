var app = require('express')();
var db = require('./db');

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

var UserController = require('./User/UserController');
var LocationController = require('./Location/LocationController');
var SensorController = require('./Sensor/SensorController');
app.use('/users', UserController);
app.use('/location',LocationController);
app.use('/pushData', SensorController);

module.exports = app;
