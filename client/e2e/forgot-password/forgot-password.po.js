'use strict';

var ForgotPasswordPage = function() {
  this.emailTextBox = element(by.model('forgot.username'));
  this.resetButton = element(by.css('button'));
  this.loginPageLink = element(by.css('.login__text'));
};

module.exports = new ForgotPasswordPage();
