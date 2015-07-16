var config = require('./config.js');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uniqid = require('uniqid');

app.use('/sounds', express.static('sounds'));

app.get('/', function(req, res){
  res.send('Nodetification server');
});

app.get('/notify/:type', function(req, res){
  var sound = null;
  switch(req.param('type')){
    case 'alert':
      sound = '/sounds/alert.mp3';
      break;
    case 'warning':
      sound = '/sounds/warning.mp3';
      break;
  }
  io.emit('notify',sound);
  console.log('Emit notify event ('+sound+') to connected clients');
  res.send('Notified.');
});

app.get('/say/:lang/:sentence', function(req, res){
  var exec = require('child_process').exec;
  var uid = uniqid();
  var lang = req.param('lang');
  var sentence = req.param('sentence');
  
  var cmd = 'espeak -v'+lang+' "'+sentence+'" --stdout | ffmpeg -i - -ar 44100 -ac 2 -ab 192k -f mp3 sounds/'+uid+'.mp3';

  exec(cmd, function(error, stdout, stderr) {
    io.emit('notify','/sounds/'+uid+'.mp3');
    res.send('Emit say event (['+lang+'] '+sentence+') to connected clients');
  });
});

http.listen(config.server.port, function(){
  console.log('Nodetification server listening on *:'+config.server.port);
});
