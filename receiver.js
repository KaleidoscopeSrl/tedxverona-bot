var Sender = require('./sender');

function Receiver(page_access_token, server_url) {
	this.page_access_token = page_access_token;
	this.server_url = server_url;

	this.sender = new Sender(this.page_access_token, this.server_url);
}



Receiver.prototype.receivedPostback = function(event)
{
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfPostback = event.timestamp;

	// The 'payload' param is a developer-defined field which is set in a postback 
	// button for Structured Messages. 
	var payload = event.postback.payload;

	console.log("Received postback for user %d and page %d with payload '%s' " + "at %d", senderID, recipientID, payload, timeOfPostback);

	// When a postback is called, we'll send a message back to the sender to 
	// let them know it was successful
	if ( payload == 'getStarted' ) {
		console.log(this.sender);
		this.sender.sendInitialMenu(senderID);
	} else if ( payload == 'show_time_to_rock_theme' ) {
		this.sender.sendTimeToRockTheme(senderID);
	} else if ( payload == 'show_2017_speakers' ) {
		this.sender.sendSpeakers(senderID);
	} else if ( payload == 'show_2017_partners' ) {
		this.sender.sendPartners(senderID);
	} else if ( payload == 'show_2017_team' ) {
		this.sender.sendTeam(senderID);
	} else if ( payload == 'show_2017_workshop' ) {
		this.sender.sendWorkshop(senderID);
	} else if ( payload.indexOf('show_speaker_detail_') != -1 ) {
		var speakerId = payload.replace('show_speaker_detail_', '');
		this.sender.sendSpeakerDetails(senderID, speakerId);	
	} else {
		this.sender.sendTextMessage(senderID, payload);
	}
};

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
Receiver.prototype.receivedMessage = function(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
	console.log(JSON.stringify(message));

	var isEcho = message.is_echo;
	var messageId = message.mid;
	var appId = message.app_id;
	var metadata = message.metadata;

	// You may get a text or attachment but not both
	var messageText = message.text.toLowerCase();
	var messageAttachments = message.attachments;
	var quickReply = message.quick_reply;

	if (isEcho) {
		// Just logging message echoes to console
		console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
		return;
	} else if (quickReply) {
		var quickReplyPayload = quickReply.payload;
		console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
		sendTextMessage(senderID, "Quick reply tapped");
		return;
	}

	if ( messageText ) {

		if ( messageText.indexOf('inizi') != -1 || messageText.indexOf('menu') != -1 || messageText.indexOf('start') != -1 ) {
			this.sender.sendInitialMenu(senderID);
		}

		if ( messageText.indexOf('speaker') != -1 || messageText.indexOf('relator') != -1 ) {
			this.sender.sendSpeakers(senderID);
		}

		if ( messageText.indexOf('partner') != -1 || messageText.indexOf('sponsor') != -1 ) {
			this.sender.sendPartners(senderID);
		}

		if ( messageText.indexOf('team') != -1 || messageText.indexOf('organizzatori') != -1 ) {
			this.sender.sendTeam(senderID);
		}

		// If we receive a text message, check to see if it matches any special
		// keywords and send back the corresponding example. Otherwise, just echo
		// the text we received.
		switch (messageText) {
			case 'image':
				this.sender.sendImageMessage(senderID);
			break;

			case 'gif':
				this.sender.sendGifMessage(senderID);
			break;

			case 'audio':
				this.sender.sendAudioMessage(senderID);
			break;

			case 'video':
				sendVideoMessage(senderID);
			break;

			case 'file':
				sendFileMessage(senderID);
			break;

			case 'button':
				sendButtonMessage(senderID);
			break;

			case 'generic':
				sendGenericMessage(senderID);
			break;

			case 'receipt':
				sendReceiptMessage(senderID);
			break;

			case 'quick reply':
				sendQuickReply(senderID);
			break;        

			case 'read receipt':
				sendReadReceipt(senderID);
			break;        

			case 'typing on':
				sendTypingOn(senderID);
			break;        

			case 'typing off':
				sendTypingOff(senderID);
			break;        

			case 'account linking':
				sendAccountLinking(senderID);
			break;
		}
	} else if (messageAttachments) {
		sendTextMessage(senderID, "Message with attachment received");
	}
}

Receiver.prototype.receivedMessageRead = function(event)
{
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;

	// All messages before watermark (a timestamp) or sequence have been seen.
	var watermark = event.read.watermark;
	var sequenceNumber = event.read.seq;

	console.log("Received message read event for watermark %d and sequence " +
		"number %d", watermark, sequenceNumber);
};

Receiver.prototype.receivedDeliveryConfirmation = function(event)
{
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var delivery = event.delivery;
	var messageIDs = delivery.mids;
	var watermark = delivery.watermark;
	var sequenceNumber = delivery.seq;

	if (messageIDs) {
		messageIDs.forEach(function(messageID) {
			console.log("Received delivery confirmation for message ID: %s", messageID);
		});
	}

	console.log("All message before %d were delivered.", watermark);
};



Receiver.prototype.receivedAuthentication = function(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfAuth = event.timestamp;

	var passThroughParam = event.optin.ref;

	console.log("Received authentication for user %d and page %d with pass " +
		"through param '%s' at %d", senderID, recipientID, passThroughParam, timeOfAuth);

	sendTextMessage(senderID, "Authentication successful");
};

module.exports = Receiver;