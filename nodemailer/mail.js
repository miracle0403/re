exports.sendmail= function sendmail(x, y, z, name){
	var nodemailer = require('nodemailer');
	//var mail = require( '../functions/mailfunctions.js' );
	
	//console.log( trysend );
	var hbs = require('nodemailer-express-handlebars');
	var transporter = nodemailer.createTransport({ 
	/*	host: 'mail.privateemail.com', 
		port: 465, 
		secure: true,*/ // true for 465, false for other ports
		service: 'gmail',
		auth: { 
			user: 'swiftrevolver7@gmail.com', // generated ethereal 
			pass:  'Swift-revolver' // generated ethereal password } }); 
		  }
    });
transporter.use('compile', hbs({ viewPath: './views/mail', extName: '.hbs' })); 

//the message properties
	var mailOptions = {
  		from: 'swiftrevolver7@gmail.com',
  		to: x,
  		subject: z,
		template: 'adminmail',
  		context: {
  			body: y,
  			name: name
  		}
	}
	
// send the mail
	transporter.sendMail(mailOptions, function(error, info) { 
		if (error) {
			return console.log(error); 
		} 
		console.log('Message sent: %s', info.messageId);
		//console.log(module.exports.email);
  	});
}