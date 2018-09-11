///**
// * Created by sohamchetan on 25/08/15.
// */
//
'use strict';
//

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var nodemailer = require('nodemailer');
var transporter = null;
const sentByEmail = sails.config.sentByEmail || 'emailinfo@itrack.com';

//Heroku sendgrip config
if (process.env.SENDGRID_USERNAME && process.env.SENDGRID_PASSWORD) {
  var sgTransport = require('nodemailer-sendgrid-transport');
  var sgOptions = {
    auth: {
      'api_user': process.env.SENDGRID_USERNAME,
      'api_key': process.env.SENDGRID_PASSWORD
    }
  };
  transporter = nodemailer.createTransport(sgTransport(sgOptions));
} else {
  //Non Heroku config
  var smtpTransport = require('nodemailer-smtp-transport');
  var options = sails.config.mailConfig || {};
  transporter = nodemailer.createTransport(smtpTransport(options));
}

module.exports = {

  sendTo: function(emailInfo, cb) {
    var message = {
      from: sentByEmail,
      to: emailInfo.receiver,
      subject: emailInfo.subject,
      text: emailInfo.message,
      cc: emailInfo.cc,
      bcc: emailInfo.bcc
    };
    transporter.sendMail(message, function(error, info) {
      if (error) {
        cb('An error occured');
        return console.trace(error);
      }
      console.log('Message sent successfully! Server responded with "%s"', JSON.stringify(info));
      cb('Message sent successfully to' + JSON.stringify(emailInfo.receiver));
    });
  }

};
