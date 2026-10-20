const Slack = require('slack-node'); // 슬랙 모듈 사용
const Promise = require('promise');

const webhookUri = process.env.WEBHOOK_URL; // Webhook URL

const slack = new Slack();
slack.setWebhook(webhookUri);

const WebHook = async (text, title, value) => {
	return new Promise(function (resolve, reject) {
		let color = '#00FFFF';
		if (String(title).includes('오류')) color = '#FF0000';
		slack.webhook(
			{
				text: text,
				attachments: [
					{
						// fallback: '링크주소: <https://www.google.com|구글>',
						// pretext: '링크주소: <https://www.google.com|구글>',
						color: color,
						fields: [
							{
								title: title,
								value: value,
								short: false,
							},
						],
					},
				],
			},
			function (err, response) {
				if (err) resolve('error');
				else {
					console.log(response);
					resolve(response.status);
				}
			},
		);
	});
};

module.exports.WebHook = WebHook;
