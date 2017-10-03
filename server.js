var app = require('./app');
var port = process.env.PORT || 8080;
process.env.SERVER_SECRET = 'arupsengupta26031990';

var server = app.listen(port, function(){
  console.log('Express server listening on port ' + port);
});

var io = require('socket.io')(server);
app.io = io;

var mysocket;

io.on('connection',function(socket){
  mysocket = socket;
  console.log('hello');
  socket.emit('news', {hello : 'world'});
  socket.on('other event',function(data){
    console.log(data);
  });
});

app.use('/changeMarker', function(req, res){
  mysocket.emit('test', 'changeMarker');
  res.status(200).send('OK');
});


// module.exports = mysocket;
