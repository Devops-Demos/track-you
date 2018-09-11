'use strict';
module.exports = function (req, res, next) {
  if(req.user && req.user.isPasswordReset && (req.user.password === null || req.user.password === undefined)){
    return res.redirect('/#/reset-password');
  }
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('unauthenticated request');
  return res.json({
    status: 'error',
    message: 'User not Authenticated.'
  });

};
