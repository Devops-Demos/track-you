'use strict';
import _ from 'lodash';

module.exports = function (req, res, next) {
  const canModifyActivity = _.result(req, 'body.type', '').toLowerCase() === 'activity' && _.result(req, 'user.updateAllActivities', false) === true;

  if (req.user.crudArtifacts || canModifyActivity) {
    return next();
  }
  const initiativeId = _.result(req, 'body.initiativeId') || _.result(req, 'params.initiativeId') || _.result(req, 'body.parentId');

  Initiative.isOwnerOfTree(_.result(req, 'user.id'), initiativeId)
    .then(isOwner => {
      if (isOwner) {
        return next();
      }
      return res.json({
        status: 'error',
        message: 'User not Authenticated to modify artifacts.'
      });
    }, console.trace);

};
