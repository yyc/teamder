var secrets = require('./secrets');

class Mail{

	constructor(globals) {
		this.mailgun = require('mailgun-js')({apiKey: secrets.mailgun_key, domain: 'sandbox512e90b6442c494db74d47f87047bfd5.mailgun.org'})
	}

	sendMail(email, subject, content) {
		console.log(email);
		var data = {
			from: 'Teamder <mailer@teamder.org>',
			to: email,
			subject: subject,
			text: content
		};
		this.mailgun.messages().send(data, function(error, body) {
			console.log(error);
		});
	}

}
module.exports = Mail;
