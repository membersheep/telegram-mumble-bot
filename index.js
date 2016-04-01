var config = require('./config');
var TelegramBot = require('telegrambot');
var Mumble = require('mumble');
var http = require('http');
var fs = require('fs');

// TELEGRAM SETUP
var api = new TelegramBot(config.TELEGRAM_TOKEN);

// MUMBLE SETUP
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var mumbleClient;
Mumble.connect( config.MUMBLE_URL, options, function(error, client) {
    if(error) {
      console.log(error);
      return;
    }
    console.log('Connected');
    mumbleClient = client;
    client.authenticate(config.MUMBLE_USER, config.MUMBLE_PASSWORD);
    client.on('initialized', onInit);
    client.on('user-connect', onUserConnected);
});

// SERVER SETUP
http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('STATUS: OK\n');
}).listen(process.env.PORT);

// FUNCTIONS
var onInit = function() {
  console.log('Connection initialized');
};

var onUserConnected = function(user) {
  console.log('User connected');
  var messageText = user.name + ' just connected to mumble! Now there are ' + mumbleClient.users().length + ' users connected.';
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};
