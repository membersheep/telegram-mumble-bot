var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser');
var TelegramBot = require('telegrambot');
var Mumble = require('mumble');
var http = require('http');
var fs = require('fs');

// TELEGRAM SETUP
var api = new TelegramBot(config.TELEGRAM_TOKEN);
api.setWebhook({url: config.WEBHOOK_BASE_URL+config.WEBHOOK_PATH}, function(err, message) {
  if (err) {
    console.log(err);
  } else {
    console.log('Telegram webhook set');
  }
});

// MUMBLE SETUP
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var mumbleClient;
Mumble.connect(config.MUMBLE_URL, options, function(error, client) {
  if (error) {
    console.log(error);
    return;
  }
  console.log('Connected to Mumble.');
  mumbleClient = client;
  client.authenticate(config.MUMBLE_USER, config.MUMBLE_PASSWORD);
  client.on('initialized', onInit);
  client.on('user-connect', onUserConnected);
  client.on('user-disconnect', onUserDisconnected);
  client.on('message', onMessage);
  client.on('error', onError);
});

// SERVER SETUP
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function status(req, res, next) {
  res.json({ status: 'UP' });
});
app.post(config.WEBHOOK_PATH, function(req, res) {
  if (!req.hasOwnProperty('body')) {
    return res.send();
  }
  var body = req.body;
  if (body.hasOwnProperty('message')) {
    readCommand(body.message);
  }
  res.send();
});
var server = app.listen(config.SERVER_PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server listening at http://%s:%s', host, port);
});

var readCommand = function(message) {
  console.log('Reading command...');
  console.log(message);
  if (message) {
    if (message.text !== undefined) {
      if (message.text === '/start') {
        api.sendMessage({ chat_id: message.chat.id, text: 'yo' }, function (err, message) {
          if (err) {
            console.log(err);
          }
        });
      } else if (message.text.startsWith('/mumble')) {
        console.log('client ready?'+mumbleClient.ready);
        if (mumbleClient.ready) {
          postConnectedUsersMessage(message.chat.id);
        }
      }
    } else {
      console.log('Message text missing');
    }
  } else {
    console.log('Message missing');
  }
};

var postConnectedUsersMessage = function(chatId) {
  var responseText = 'There are ' + usersList.length + ' users connected:\n';
  usersList.forEach(function(user) {
    responseText += user.name + '\n';
  });
  api.sendMessage({ chat_id: chatId, text: responseText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

// MUMBLE LISTENER FUNCTIONS
var usersList = [];
var onInit = function() {
  console.log('Mumble connection initialized');
  usersList = mumbleClient.users();
  postConnectedUsersMessage(config.TELEGRAM_CHAT_ID);
};

var onUserConnected = function(user) {
  console.log(user.name + ' connected');
  usersList.push(user);
  console.log('Current users list:');
  usersList.forEach(function(user) {
    console.log(user.name + '\n');
  });
  var messageText = user.name + ' just connected to mumble!';
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

var onUserDisconnected = function(userDisconnected) {
  console.log(userDisconnected.name + ' disconnected');
  usersList = usersList.filter(function(user) {
    return user.name != userDisconnected.name;
  });
  console.log('Current users list:');
  usersList.forEach(function(user) {
    console.log(user.name);
  });
  var messageText = userDisconnected.name + ' just disconnected from mumble!';
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: messageText }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

var onMessage = function (message, user) {
  console.log('Mumble message received');
  console.log(user.name + ' : ' + message);
  api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: user.name + ' : ' + message }, function (err, message) {
    if (err) {
      console.log(err);
    }
  });
};

var onError = function (error) {
  console.log('Mumble error:');
  console.log(error);
  // api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: 'ERROR: ' + error }, function (err, message) {
  //   if (err) {
  //     console.log(err);
  //   }
  // });
};
