var config = require('./config');
var TelegramBot = require('telegrambot');
var Mumble = require('mumble');
var http = require('http');
var fs = require('fs');

// TELEGRAM SETUP
var api = new TelegramBot(config.TELEGRAM_TOKEN);

// MUMBLE SETUP
var options = {
  key: fs.readFileSync( 'key.pem' ),
  cert: fs.readFileSync( 'cert.pem' )
};
Mumble.connect( config.MUMBLE_URL, options, function(error, connection) {
    if( error ) {
      throw new Error( error );
    }
    console.log('Connected');
    connection.authenticate(config.MUMBLE_USER, config.MUMBLE_PASSWORD);
    connection.on( 'initialized', onInit );
    connection.on( 'user-connect', onUserConnected );
});

// SERVER SETUP
http.createServer(options, function(req, res) {
  res.writeHead(200);
  res.end('STATUS: OK\n');
}).listen(process.env.PORT);

// FUNCTIONS
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
