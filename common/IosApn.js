const Promise = require('promise');
var apn = require('apn');

var options = {
	token: {
		key: process.env.AUTH_KEY?.replace(/\\n/g, '\n'),
		keyId: process.env.KEY_ID,
		teamId: process.env.TEAM_ID,
	},
	production: true,
};

var apnProvider = new apn.Provider(options);

function MAKEPAYLOAD(token, title, message, linkurl) {
	var payload = {
		messageFrom: 'TTOK',
		aps: {
			title: title,
			body: message,
		},
		action_url: linkurl,
	};

	return payload;
}

function SEND(token, payload) {
	var note = new apn.Notification();

	note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
	note.badge = 0;
	note.sound = 'ping.aiff';
	note.alert = payload.aps.title;
	note.payload = payload;
	note.topic = 'com.sevendays.ttokssaem';

	return new Promise(function (resolve, reject) {
		apnProvider
			.send(note, token)
			.then(function (result) {
				resolve(result);
			})
			.catch(function (err) {
				reject(err);
			});
	});
}

module.exports = {
	MAKEPAYLOAD: MAKEPAYLOAD,
	SEND: SEND,
};
