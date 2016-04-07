var config = require('./config');
var TelegramBot = require('telegrambot');
var Mumble = require('mumble');
var http = require('http');
var fs = require('fs');

// TELEGRAM SETUP
var api = new TelegramBot(config.TELEGRAM_TOKEN);
api.setWebhook({url: config.WEBHOOK_BASE_URL+config.WEBHOOK_PATH}, function() {
  console.log('Telegram webhook set');
});

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
    console.log('Connected to Mumble.');
    mumbleClient = client;
    client.authenticate(config.MUMBLE_USER, config.MUMBLE_PASSWORD);
    client.on('initialized', onInit);
    client.on('user-connect', onUserConnected);
    client.on('user-disconnect', onUserDisconnected);
});

// SERVER SETUP
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('STATUS: OK\n');
});
server.get(config.WEBHOOK_PATH, function (request, response) {
  response.simpleText(200, "Hello World!");
});
server.listen(process.env.PORT);

// LISTENERS


// MUMBLE LISTENER FUNCTIONS
var onInit = function() {
  console.log('Connection initialized');
};

var onUserConnected = function(user) {
  console.log(user.name + ' connected');
  var messageText = user.name + ' just connected to mumble!';
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

var onUserDisconnected = function(user) {
  console.log(user.name + ' disconnected');
  var messageText = user.name + ' just disconnected from mumble!';
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

// TELEGRAM LISTENER FUNCTIONS
var onGetConnectedUsers = function() {

};
