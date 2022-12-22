/*
참고
https://firebase.google.com/docs/cloud-messaging/send-message#node.js_8
*/
const Promise = require('promise');
const admin = require('firebase-admin');

admin.initializeApp({
	credential: admin.credential.cert({
		projectId: process.env.PROJECT_ID,
		privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
		clientEmail: process.env.CLIENT_EMAIL,
	}),
});

function MAKEPAYLOAD(token, title, message, linkurl) {
	var payload = {
		notification: {
			title: title,
			body: message,
		},
		android: {
			priority: 'high',
			notification: {
				sound: 'default',
			},
		},
		apns: {
			headers: { 'apns-priority': '5' },
			payload: {
				aps: {
					sound: 'default',
				},
			},
		},
		data: {
			title: title,
			content: message,
			action_url: linkurl,
		},
		token: token,
	};

	return payload;
}

async function SEND(payload) {
	return new Promise(function (resolve, reject) {
		admin
			.messaging()
			.send(payload)
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

module.exports = {
	MAKEPAYLOAD: MAKEPAYLOAD,
	SEND: SEND,
};
