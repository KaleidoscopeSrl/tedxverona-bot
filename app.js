'use strict';

//var auth = require('./auth');
var startThread = require('./start_thread');
var BotConfig = require('./bot_config');
var Auth = require('./auth');

var Receiver = require('./receiver');

const 
	bodyParser = require('body-parser'),
	express = require('express'),
	https = require('https'),  
	request = require('request');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(bodyParser.json({ verify: Auth.verifyRequestSignature }));
app.use(express.static('public'));


const APP_SECRET = BotConfig.app_secret;
const VALIDATION_TOKEN = BotConfig.validation_token;
const PAGE_ACCESS_TOKEN = BotConfig.page_access_token;
const SERVER_URL = BotConfig.server_url;

if ( !(APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL) ) {
	console.error("Missing config values");
	process.exit(1);
}

var receiver = new Receiver(PAGE_ACCESS_TOKEN, SERVER_URL);


app.get('/webhook', function(req, res) {
	if (req.query['hub.mode'] === 'subscribe' &&
		req.query['hub.verify_token'] === VALIDATION_TOKEN) {
		console.log("Validating webhook");
		console.log(req.query['hub.verify_token'], VALIDATION_TOKEN);
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);          
	}
});


app.post('/webhook', function (req, res) {
	var data = req.body;

	if (data.object == 'page') {

		data.entry.forEach(function(pageEntry) {
			var pageID = pageEntry.id;
			var timeOfEvent = pageEntry.time;

			pageEntry.messaging.forEach(function(messagingEvent) {
				console.log(messagingEvent);
				if (messagingEvent.optin) {
					receiver.receivedAuthentication(messagingEvent);
				} else if (messagingEvent.message) {
					receiver.receivedMessage(messagingEvent);
				} else if (messagingEvent.delivery) {
					receiver.receivedDeliveryConfirmation(messagingEvent);
				} else if (messagingEvent.postback) {
					receiver.receivedPostback(messagingEvent);
				} else if (messagingEvent.read) {
					receiver.receivedMessageRead(messagingEvent);
				} else {
					console.log("Webhook received unknown messagingEvent: ", messagingEvent);
				}
			});
		});

		res.sendStatus(200);
	}
});


app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
	console.log('BOT: start conversation');
	startThread.start();
});


app.get('/authorize', function(req, res) {
	var accountLinkingToken = req.query.account_linking_token;
	var redirectURI = req.query.redirect_uri;

	// Authorization Code should be generated per user by the developer. This will 
	// be passed to the Account Linking callback.
	var authCode = "1234567890";

	// Redirect users to this URI on successful login
	var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

	res.render('authorize', {
		accountLinkingToken: accountLinkingToken,
		redirectURI: redirectURI,
		redirectURISuccess: redirectURISuccess
	});
});

module.exports = app;

