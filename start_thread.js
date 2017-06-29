const request = require('request');
const BotConfig = require('./bot_config');

function StartThread() {
}

function createGetStarted()
{
	var getStartedData = {
		setting_type: "call_to_actions",
		thread_state: "new_thread",
		call_to_actions:[ {
			payload: "getStarted"
		}]
	};

	request({
		uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
		qs: { access_token: BotConfig.page_access_token },
		method: 'POST',
		json: getStartedData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Thread Settings successfully changed!");
		} else {
			console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
		}
	});
}

/**
 * 
 * 1 => Start with greeting text
 * 2 => Call the GetStart button
 * 
 */

StartThread.start = function()
{
	var greetingData = {
		setting_type: "greeting",
		greeting: {
			text: "Ciao {{user_first_name}}! Benvenuto nel Bot di TEDxVerona! Quest'anno il tema è Time To Rock! Usa i bottoni qui sotto per accedere alle info necessarie.!",
		}
	};

	request({
		uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
		qs: { access_token: BotConfig.page_access_token },
		method: 'POST',
		json: greetingData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Greeting set successfully!");
			createGetStarted();
		} else {
			console.error("Failed calling Thread Reference API", response.statusCode,     response.statusMessage, body.error);
		}
	});  
};

module.exports = StartThread;
