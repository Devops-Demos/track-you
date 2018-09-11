require('babel-register')({
  retainLines: true,
  presets: ['es2015']
});
require('babel-polyfill');
var Sails = require('sails'),
  sails,
  chai = require('chai');
var SessionStore = require('express-session');

chai.use(require('chai-spies'));
global.expect = chai.expect;
global.assert = chai.assert;

before(function (done) {
  this.timeout(5000);
  Sails.lift({
    hooks: {
      grunt: false
    },
    // configuration for testing purposes
    port: 12345,
    csrf: false,
    models: {
      connection: 'dbTest',
      migrate: 'safe'
    },
    testEnv: true,
    policies: {
      '*': true,

      AuthController: {
        login: true,
        logout: true
      },

      InitiativeController: {
        getAllInitiatives: true,
        getOwnedInitiatives: 'isAuthenticated'
      }
    },
    session: {
      secret: '810358dcc1f77f406c6af45d2925d7cc',
      store: null,
      adapter: undefined
    }

  }, function (err, server) {
    sails = server;
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
