# telegram-mumble-bot
![Heroku](https://heroku-badge.herokuapp.com/?app=fourbot&root=status&style=flat)
[![Dependencies](https://david-dm.org/membersheep/telegram-mumble-bot/status.svg)](https://david-dm.org/membersheep/telegram-mumble-bot)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

TelegramMumbleBot is a simple telegram bot to notify mumble events to telegram chats.
It can be easily deployed to Heroku, it just needs some config vars to be defined on your heroku app.

## Deploy on heroku

1. Create a new heroku app.
2. Select GitHub as deployment method and connect it to this or to your repository.
3. Create a new bot account with [BotFather](https://telegram.me/BotFather).
4. Go to your heroku app settings page and create the following config variables:
  - TELEGRAM_TOKEN: the token you received from the BotFather.
  - TELEGRAM_CHAT_ID: the id of the chat where you want the messages to be posted.
  - MUMBLE_URL: mumble url in thi s form *mumble://hostname:port*
  - MUMBLE_USER: mumble username
  - MUMBLE_PASSWORD: mumble password
  - WEBHOOK_BASE_URL: your heroku app url *https://your-heroku-app-name.herokuapp.com*
  - WEBHOOK_PATH: a custom path for the webhook (defaults to */telegramBot*)

*NOTE: You will have to change the key and cert files to the one you created for the bot's user if your mumble server requires them.*
