var config = {};

config.SERVER_PORT = process.env.PORT || 3000;
config.WEBHOOK_BASE_URL = process.env.WEBHOOK_BASE_URL;
config.WEBHOOK_PATH = process.env.WEBHOOK_PATH || '/telegramBot';
config.TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
config.TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
config.MUMBLE_URL = process.env.MUMBLE_URL;
config.MUMBLE_USER = process.env.MUMBLE_USER;
config.MUMBLE_PASSWORD = process.env.MUMBLE_PASSWORD;

module.exports = config;
