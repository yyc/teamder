var secrets = require('./secrets');

class Mail{

	constructor(globals) {
		this.mailgun = require('mailgun-js')({apiKey: secrets.mailgun_key, domain: secrets.url})
	}

	sendMail(email, subject, content) {
		var data = {
			from: 'Teamder <mailer@teamder.org>',
			to: email,
			subject: subject,
			text: content
		};
		this.mailgun.messages().send(data, function(error, body) {
			console.log(body);
		});
	}

}
module.exports = Mail;
