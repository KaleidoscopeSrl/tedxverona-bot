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
			setupMenu();
			console.log("Thread Settings successfully changed!");
		} else {
			console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
		}
	});
}

function setupMenu()
{
	var menuData = {
		setting_type: "persistent_menu",
		persistent_menu: [{
			locale: 'default',
			composer_input_disabled: false,
			call_to_actions:[{
				title: 'TEDxVerona 2017',
				type: 'nested',
				call_to_actions: [{
					title: 'Time to Rock!',
					type: 'postback',
					payload: 'show_time_to_rock_theme'
				},, {
					title: 'Workshop',
					type: 'postback',
					payload: 'show_2017_workshop'
				}, {
					title: 'Speakers',
					type: 'postback',
					payload: 'show_2017_speakers'
				}, {
					title: 'Team',
					type: 'postback',
					payload: 'show_2017_team'
				}]
			}, {
				title: 'Biglietti',
				type: 'web_url',
				url: 'https://www.eventbrite.it/e/biglietti-tedxverona-2017-78-ottobre-time-to-rock-34884173502#tickets',
				webview_height_ratio: "full"
			}, {
				title: 'Partners',
				type: 'postback',
				payload: 'show_2017_partners'
			}]
		}]
	};

	request({
		uri: 'https://graph.facebook.com/v2.6/me/messenger_profile',
		qs: { access_token: BotConfig.page_access_token },
		method: 'POST',
		json: menuData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log("Persistent menu successfully changed!");
		} else {
			console.error("Failed calling Thread Reference API", response.statusCode, response.statusMessage, body.error);
		}
	});
}


/**
 * 
 * 1 => Start with greeting text
 * 2 => Call the GetStart button
 * 3 => Set up the persistent menu
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
