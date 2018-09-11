'use strict';
var passport = require('passport'),
handle = function(err){
  if(err){
    console.trace('Error: ', err);
  }
};

module.exports = {

  _config: {
    actions: false,
    shortcuts: false,
    rest: false
  },


  login: function(req, res) {

    // will have a new session here
    passport.authenticate('local', function(err, user, info) {
      if (err || (!user)) {
        return res.send({
          message: info.message,
          user: user
        });
      }
      req.logIn(user, function(err) {
        if (err) {
          return res.send(err);
        }
        // return res.send({
        //   message: info.message,
        //   user: user
        // });
        var temp = req.session.passport; // {user: 1}
        req.session.regenerate(function(err) {
          handle(err);
          //req.session.passport is now undefined
          req.session.passport = temp;
          req.session.save(function(err) {
            handle(err);
            return res.json(user);
          });
        });
        //User.findOne({id: user.id}, function(err, data){
        //res.json(data);
        //});
      });


    })(req, res);


    // });
  },

  logout: function(req, res) {
    req.logout();
    req.session.regenerate(function(err) {
      handle(err);
      res.json({
        status: 'ok',
        message: 'User logged out'
      });
    });
  }
};
