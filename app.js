var express = require('express');
var app = express();
var db = require('./db');

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

var UserController = require('./User/UserController');
var LocationController = require('./Location/LocationController');
app.use('/users', UserController);
app.use('/location',LocationController);

module.exports = app;
