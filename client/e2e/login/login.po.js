/**
 * This file uses the Page Object pattern to define the main page for tests
 * https://docs.google.com/presentation/d/1B6manhG0zEXkC-H-tPo2vwU06JhL8w9-XCF9oehXzAQ
 */

'use strict';

var LoginPage = function() {
  this.usernameElement = element(by.model('login.username'));
  this.passwordElement = element(by.model('login.password'));
  this.loginButton = element(by.css('button'));
  this.forgotPasswordLink = element(by.css('.forgot__password'));
};

module.exports = new LoginPage();
