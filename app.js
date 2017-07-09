var express = require('express');
var app = express();
var db = require('./db');

app.use(function(req, res, next){
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

var UserController = require('./User/UserController');
app.use('/users', UserController);

module.exports = app;
