const crypto = require('crypto');

function Auth() {

}

/*
* Verify that the callback came from Facebook. Using the App Secret from 
* the App Dashboard, we can verify the signature that is sent with each 
* callback in the x-hub-signature field, located in the header.
*
* https://developers.facebook.com/docs/graph-api/webhooks#setup
*
*/
Auth.prototype.verifyRequestSignature = function(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		// For testing, let's log an error. In production, you should throw an 
		// error.
		console.error("Couldn't validate the signature.");
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', APP_SECRET)
								.update(buf)
								.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
};

/*
* Authorization Event
*
* The value for 'optin.ref' is defined in the entry point. For the "Send to 
* Messenger" plugin, it is the 'data-ref' field. Read more at 
* https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
*
*/
Auth.prototype.receivedAuthentication = function(event) {
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfAuth = event.timestamp;

	// The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
	// The developer can set this to an arbitrary value to associate the 
	// authentication callback with the 'Send to Messenger' click event. This is
	// a way to do account linking when the user clicks the 'Send to Messenger' 
	// plugin.
	var passThroughParam = event.optin.ref;

	console.log("Received authentication for user %d and page %d with pass " +
		"through param '%s' at %d", senderID, recipientID, passThroughParam, timeOfAuth);

	// When an authentication is received, we'll send a message back to the sender
	// to let them know it was successful.
	sendTextMessage(senderID, "Authentication successful");
};

module.exports = Auth;






