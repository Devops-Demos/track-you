'use strict';
module.exports = function (req, res, next) {
  if (req.user && req.user.crudUsers === true) {
    // console.log('authenticated request');
    return next();
  }
  // console.log('unauthenticated request');
  return res.json({
    status: 'error',
    message: 'User not Authorized to modify users.'
  });

};
