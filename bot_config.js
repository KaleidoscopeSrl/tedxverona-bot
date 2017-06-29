const config = require('config');

var conf = {};

conf.app_secret = (process.env.MESSENGER_APP_SECRET) ? process.env.MESSENGER_APP_SECRET : config.get('appSecret');
conf.validation_token = (process.env.MESSENGER_VALIDATION_TOKEN) ? (process.env.MESSENGER_VALIDATION_TOKEN) : config.get('validationToken');
conf.page_access_token = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ? (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : config.get('pageAccessToken');
conf.server_url = (process.env.SERVER_URL) ? (process.env.SERVER_URL) : config.get('serverURL');

module.exports = conf;
