var app = require('./app');
var port = process.env.PORT || 8080;

var server = app.listen(port, function(){
  console.log('Express server listening on port ' + port);
});

var io = require('socket.io')(server);

io.on('connection',function(socket){
  console.log('hello');
  socket.emit('news', {hello : 'world'});
  socket.on('other event',function(data){
    console.log(data);
  });
});
