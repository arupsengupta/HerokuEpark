var app = require('express')();
var server = require('http').Server(app);
var db = require('./db');
var io = require('socket.io')(server);

server.listen(3000);

io.on('connection',function(socket){
  console.log('hello');
  socket.emit('news', {hello : 'world'});
  socket.on('other event',function(data){
    console.log(data);
  });
});

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
