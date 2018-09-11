/**
 * Created by sohamchetan on 20/08/15.
 */
'use strict';
import _ from 'lodash';
import async from 'async';

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcryptjs');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findOne({id: id}, function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function (email, password, done) {
    User.findOne({email: email})
      .then(function (user) {
      if (!user) {
        return done(null, false, {message: 'STATUS.INCORRECT_EMAIL_PASSWORD'});
      }

      var comparePassword = function (newPassword, callback) {
        bcrypt.compare(password, newPassword, function (err, res) {
          callback(null, res);
        });
      };

      async.map([user.password, user.tempPassword],comparePassword, function (err, res) {
        if (!(res[0] || (res[1] && user.isPasswordReset))) {
          return done(null, false, {
            message: 'STATUS.INCORRECT_EMAIL_PASSWORD'
          });
        }
        var returnUser = _.clone(user);
        returnUser.isPasswordReset = res[0] ? false : true ;
        delete returnUser.password;
        delete returnUser.tempPassword;

        return done(null, returnUser, {
          message: 'STATUS.LOGGED_IN_SUCCESSFULLY'
        });
      });
    }, console.trace);
  }
));
