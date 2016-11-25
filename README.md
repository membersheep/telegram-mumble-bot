# telegram-mumble-bot
TelegramMumbleBot is a simple telegram bot to notify mumble events to telegram chats.
It can be easily deployed to Heroku, it just needs some config vars to be defined on your heroku app.

## Deploy on heroku

1. Create a new heroku app.
2. Select GitHub as deployment method and connect it to this or to your repository.
3. Create a new bot account with [BotFather](https://telegram.me/BotFather).
4. Go to your heroku app settings page and create the following config variables:
  - TELEGRAM_TOKEN: the token you received from the BotFather.
  - TELEGRAM_CHAT_ID: the id of the chat where you want the messages to be posted.
  - MUMBLE_URL: mumble url in this format: *mumble://hostname:port*
  - MUMBLE_USER: mumble username
  - MUMBLE_PASSWORD: mumble password
  - WEBHOOK_BASE_URL: your heroku app url in this format: *https://your-heroku-app-name.herokuapp.com* 
5. To keep your bot always active with heroku free plan you can register your bot to http://wakemydyno.com/
6. To keep your bot active within a selected range of hours (and avoid wasting precious free dyno hours) you can use my [wake-my-dyno-script](https://github.com/membersheep/wakemydyno) (Google account required).

*NOTE: the WEBHOOK_BASE_URL should be formatted just like in the example, without the ending slash*

*NOTE: You will have to change the key and cert files to the one you created for the bot's user if your mumble server requires them.*
