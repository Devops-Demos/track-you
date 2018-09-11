/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var _ = require('lodash');

module.exports = {

  resetUser: function (req, res) {
    var userData = req.body;
    userData.tempPassword = DataUtils.randString(10);
    userData.isPasswordReset = true;

    if (!userData.email) {
      return res.json({
        // message: 'Error: email address not specified',
        // status: 'error'
        status: 'ok'
      });
    }

    User.update({
        email: userData.email
      }, _.clone(userData))
      .then(function (data) {
        if (!data || data.length === 0) {
          return res.json({
            // message: 'User does not exist',
            status: 'failed'
              // status: 'error'
          });
        }
        res.json({
          // data: DataUtils.sanitize.passwords(data),
          status: 'ok'
        });
        Mailer.interface.resetUserPassword(userData, userData.tempPassword);
      }, function (err) {
        res.json({
          status: 'failed',
          details: err
        });
      });
  },

  newUser: function (req, res) {
    var userData = req.body;
    userData.tempPassword = DataUtils.randString(10);
    userData.isPasswordReset = true;

    if (!userData.email) {
      return res.json({
        status: 'error',
        message: 'email address not specified'
      });
    }

    User.create(userData)
      .then(function (data) {

          res.json({
            status: 'ok',
            data: DataUtils.sanitize.passwords(data)
          });
          Mailer.interface.resetUserPassword(userData, userData.tempPassword);
        },
        function (error) {
          res.json(error);
        });
  },

  deleteUser: function (req, res) {
    var userId = req.params.id;
    // console.log(req.user);
    if (!req.user || req.user.crudUsers !== true) {
      return res.json({
        status: 'error',
        message: 'STATUS.NOT_AUTHORIZED_TO_DELETE_USERS'
      });
    }

    User.destroy({
      id: userId
    }).then(function (data) {
        return res.json({
          status: 'ok',
          message: 'STATUS.USER_DELETED',
          data: data.map(DataUtils.sanitize.passwords)
        });
      },
      function (error) {
        res.json(error);
      });
  },

  currentUserInfo: function (req, res) {
    res.json(req.user);
  },

  changePassword: function (req, res) {
    var newCredentials = req.body;
    if (req.isAuthenticated() && req.user && newCredentials) {
      return User.update({
          email: req.user.email
        }, newCredentials)
        .then(function (user) {
          res.json(DataUtils.sanitize.passwords(user[0]));
        }, console.log);
    }
    return res.json({
      status: 'error',
      message: 'User not Authenticated.'
    });
  },

  getAll: (req, res) => User.find({})
    .then(data => res.json(data), console.trace)
};
