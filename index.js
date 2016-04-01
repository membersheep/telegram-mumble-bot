var config = require('./config');
var TelegramBot = require('telegrambot');
var Mumble = require('mumble');
var fs = require('fs');

var api = new TelegramBot(config.TOKEN);
var options = {
  key: fs.readFileSync( 'key.pem' ),
  cert: fs.readFileSync( 'cert.pem' )
};

Mumble.connect( config.MUMBLE_URL, options, function (error, connection) {
    if( error ) {
      throw new Error( error );
    }
    console.log('Connected');
    connection.authenticate(config.MUMBLE_USER, config.MUMBLE_PASSWORD);
    connection.on( 'initialized', onInit );
    connection.on( 'user-connect', onUserConnected );
});

var onInit = function() {
  console.log('Connection initialized');
};

var onUserConnected = function(user) {
  console.log('User connected');
  var messageText = user.name + " just connected to mumble!";
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};
