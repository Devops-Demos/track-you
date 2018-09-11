'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var options = {
  host: 'amdc-ext-mx01.amdc.abc-company.com',
  port : 25
};
var mailOptions = {
    from: 'XYz  <xyz@abc-company.com>', // sender address
    to: '@abc-company.com', // list of receivers
    subject: '', // Subject line
    text: '', // plaintext body
};
var transporter = nodemailer.createTransport(smtpTransport(options));

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
