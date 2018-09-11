'use strict';
var _ = require('lodash');

module.exports = function(req, res, next) {

  if (req.user.crudArtifacts) {
    // console.log('authenticated request');
    return next();
  }

  var type = _.has(req.body, '[0].type') ? req.body[0].type : null;

  if (type === 'activity') {
    Initiative.isOwnerOfTree(req.user.id, req.body[0].initiativeId)
      .then(function(isOwner) {
        if (isOwner) {
          return next();
        }
        return res.json({
          status: 'error',
          message: 'User not Authorized to modify artifacts.'
        });
      });
  } else {
    return res.json({
      status: 'error',
      message: 'User not Authenticated to modify artifacts.'
    });
  }

};
