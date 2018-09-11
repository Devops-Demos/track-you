'use strict';
var _ = require('lodash');

module.exports = function (req, res, next) {
  var user = req.user,
  kpiType = _.has(req,'body.kpiData.kpiType') ? req.body.kpiData.kpiType : null,
  initiativeId = _.has(req,'body.kpiData.initiativeId') ? req.body.kpiData.initiativeId : null;

  if (user && user.crudArtifacts || ((user.updateAllOutComeKpis && kpiType === 'outcome') || (user.updateAllOutputKpis && kpiType === 'output'))) {
    return next();
  }

  Initiative.isOwnerOfTree(user.id, initiativeId)
  .then(function(isOwner){
    if(isOwner){
      return next();
    }
    return res.json({
      status: 'error',
      message: 'User not Authorized to modify kpis.'
    });
  });



};
