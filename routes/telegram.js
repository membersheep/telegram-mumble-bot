module.exports = function(req, res) {
  if (!req.hasOwnProperty('body')) {
    return res.send();
  }
  var body = req.body;
  if (body.hasOwnProperty('message')) {
    readCommand(body.message);
  }
  res.send();
};

var readCommand = function(message) {
  if (message.text == "/start") {
    api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: 'yo nigga' }, function (err, message) {
      if (err) {
        console.log(err);
      }
    });
  } else if (message.text == "/mumble") {
    var responseText = 'There are ' + mumbleClient.users().length + ' users connected:\n';
    mumbleClient.users().forEach(function(user) {
      responseText += user.name + '\n';
    });
    api.sendMessage({ chat_id: config.TELEGRAM_CHAT_ID, text: responseText }, function (err, message) {
      if (err) {
        console.log(err);
      }
    });
  }
};
