'use strict';

describe('The Reset password page: ', function() {
  var page;

  beforeEach(function() {
    browser.get('/#/forgot-password');
    browser.executeScript('window.localStorage.clear();');
    browser.get('/#/forgot-password');
    page = require('./forgot-password.po');
  });

  it('User should be able to login with right user credentials', function() {
    page.usernameElement.sendKeys('admin@test.com');
    page.passwordElement.sendKeys('password');
    page.loginButton.click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:3000/#/landing');
  });

});
