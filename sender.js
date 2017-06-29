const request = require('request');

function Sender(page_access_token, server_url) {
	this.page_access_token = page_access_token;
	this.server_url = server_url;
}


/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
Sender.prototype.callSendAPI = function(messageData)
{
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: { access_token: this.page_access_token },
		method: 'POST',
		json: messageData
	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var recipientId = body.recipient_id;
			var messageId = body.message_id;

			if (messageId) {
				console.log("Successfully sent message with id %s to recipient %s", messageId, recipientId);
			} else {
				console.log("Successfully called Send API for recipient %s", recipientId);
			}
		} else {
			console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
		}
	});

};

Sender.prototype.sendTextMessage = function(recipientId, messageText)
{
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: messageText,
			metadata: "DEVELOPER_DEFINED_METADATA"
		}
	};

	this.callSendAPI(messageData);
};


Sender.prototype.sendInitialMenu = function(recipientId)
{
	this.sendTextMessage(recipientId, "Seleziona una delle voci qui sotto per accedere ai contenuti di TEDxVerona 2017");

	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [{
						title: "Time to rock!",
						item_url: "http://www.tedxverona.com/time-to-rock",
						image_url: this.server_url + "/assets/timetorock.jpg",
						buttons: [{
							type: "postback",
							title: "Scopri il tema!",
							payload: "show_time_to_rock_theme",
						}]
					}, {
						title: "Biglietti",
						item_url: "https://www.eventbrite.it/e/biglietti-tedxverona-2017-78-ottobre-time-to-rock-34884173502#tickets",               
						//image_url: this.server_url + "/assets/tickets.jpg",
						image_url: 'https://www.kaleidoscope.it/assets/img/projects/movimentore/movimentore-cover-xs.jpg',
						buttons: [{
							type: "web_url",
							url: "https://www.eventbrite.it/e/biglietti-tedxverona-2017-78-ottobre-time-to-rock-34884173502#tickets",
							title: "Acquista"
						}]
					}, {
						title: "Speakers",
						item_url: "http://www.tedxverona.com/speakers",
						image_url: this.server_url + "/assets/speakers.jpg",
						buttons: [{
							type: "postback",
							title: "Scopri gli speakers!",
							payload: "show_2017_speakers",
						}]
					}, {
						title: "Partners",
						item_url: "http://www.tedxverona.com/partners/",
						image_url: this.server_url + "/assets/partners.jpg",
						buttons: [{
							type: "postback",
							title: "Scopri i partners!",
							payload: "show_2017_partners",
						}]
					}, {
						title: "Team",
						item_url: "http://www.tedxverona.com/team/",
						image_url: this.server_url + "/assets/team.jpg",
						buttons: [{
							type: "postback",
							title: "Scopri il team!",
							payload: "show_2017_team",
						}]
					}]
				}
			}
		}
	};

	this.callSendAPI(messageData);
};


module.exports = Sender;


/*

// Send an image using the Send API.
function sendImageMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: SERVER_URL + "/assets/rift.png"
				}
			}
		}
	};

	callSendAPI(messageData);
}


// Send a video using the Send API.
function sendVideoMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "video",
				payload: {
					url: SERVER_URL + "/assets/allofus480.mov"
				}
			}
		}
	};

	callSendAPI(messageData);
}


// Send a button message using the Send API.
function sendButtonMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "button",
					text: "This is test text",
					buttons:[{
						type: "web_url",
						url: "https://www.oculus.com/en-us/rift/",
						title: "Open Web URL"
					}, {
						type: "postback",
						title: "Trigger Postback",
						payload: "DEVELOPER_DEFINED_PAYLOAD"
					}, {
						type: "phone_number",
						title: "Call Phone Number",
						payload: "+16505551234"
					}]
				}
			}
		}
	};

	callSendAPI(messageData);
}

// Send a Structured Message (Generic Message type) using the Send API.
function sendGenericMessage(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: [{
						title: "rift",
						subtitle: "Next-generation virtual reality",
						item_url: "https://www.oculus.com/en-us/rift/",               
						image_url: SERVER_URL + "/assets/rift.png",
						buttons: [{
							type: "web_url",
							url: "https://www.oculus.com/en-us/rift/",
							title: "Open Web URL"
						}, {
							type: "postback",
							title: "Call Postback",
							payload: "Payload for first bubble",
						}],
					}, {
						title: "touch",
						subtitle: "Your Hands, Now in VR",
						item_url: "https://www.oculus.com/en-us/touch/",               
						image_url: SERVER_URL + "/assets/touch.png",
						buttons: [{
							type: "web_url",
							url: "https://www.oculus.com/en-us/touch/",
							title: "Open Web URL"
						}, {
							type: "postback",
							title: "Call Postback",
							payload: "Payload for second bubble",
						}]
					}]
				}
			}
		}
	};

	callSendAPI(messageData);
}

// Send a message with Quick Reply buttons.
function sendQuickReply(recipientId) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: "What's your favorite movie genre?",
			quick_replies: [
				{
					"content_type":"text",
					"title":"Action",
					"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
				},
				{
					"content_type":"text",
					"title":"Comedy",
					"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
				},
				{
					"content_type":"text",
					"title":"Drama",
					"payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
				}
			]
		}
	};

	callSendAPI(messageData);
}

// Send a read receipt to indicate the message has been read
function sendReadReceipt(recipientId) {
	console.log("Sending a read receipt to mark message as seen");

	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "mark_seen"
	};

	callSendAPI(messageData);
}

// Turn typing indicator on
function sendTypingOn(recipientId) {
	console.log("Turning typing indicator on");

	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_on"
	};

	callSendAPI(messageData);
}

// Turn typing indicator off
function sendTypingOff(recipientId) {
	console.log("Turning typing indicator off");

	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_off"
	};

	callSendAPI(messageData);
}

*/