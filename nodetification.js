var config = require('./config.js');
console.log(config.server.exposedUrl);

var socket = require('socket.io-client')(config.server.exposedUrl);
var player = require('play-sound')(opts = {})

socket.on('connect', function(){
  console.log('Connection succesful.');
});
socket.on('notify', function(data){
  console.log('Server has requested to play this sound : '+data);
  player.play(config.server.exposedUrl + data);
});
socket.on('disconnect', function(){
  console.log('Connection lost.');
})
