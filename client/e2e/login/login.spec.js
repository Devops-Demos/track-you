'use strict';

describe('The login page: ', function() {
  var page;

  beforeEach(function() {
    browser.get('/');
    browser.executeScript('window.localStorage.clear();');
    browser.get('/');
    page = require('./login.po');
  });

  it('User should be able to login with right user credentials', function() {
    page.usernameElement.sendKeys('admin@test.com');
    page.passwordElement.sendKeys('password');
    page.loginButton.click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/landing');
  });

  it('User should not be able to login with wrong user credentials', function() {
    page.usernameElement.sendKeys('admin@test.com');
    page.passwordElement.sendKeys('password123');
    page.loginButton.click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/login');
  });

  it('Forgot password link takes you to the rest password page', function() {
    page.forgotPasswordLink.click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/forgot-password');
  });

});
