'use strict';
import _ from 'lodash';

module.exports = function (req, res, next) {
  if (req.user.crudArtifacts || req.user.updateAllExecutiveSummaries) {
    return next();
  }
  const initiativeId = _.result(req, 'body.initiativeId') || _.result(req,'body.parentId') || _.result(req, 'params.id');

  Initiative.isOwnerOfTree(_.result(req, 'user.id'), initiativeId)
  .then(isOwner => {
    if(isOwner){
      return next();
    }
    return res.json({
      status: 'error',
      message: 'User not Authenticated to modify artifacts.'
    });
  }, console.trace);

};
