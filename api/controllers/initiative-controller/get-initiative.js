'use strict';
import InitiativeClass from '../../classes/InitiativeClass';
import {
  cloneDeep
}
from 'lodash';
import memoize from 'memoizee';
import debug from 'debug';

const log = debug('memoize');

const getInitiative = (initiativeId, options, cb) => Initiative.findAndPopulateOne(initiativeId, options)
  .then(initiative => {
    log(`Function hit : get-initiative (id:${initiativeId})`);
    let initData = (new InitiativeClass(initiative).aggregate());
    // initData.hasKpi = initData.KPI && initData.KPI.length > 0;
    initData = Custom.cleaners.cleanInitiatives([initData])[0];
    Initiative.count({
      parentId: initData.initiativeId
    }).then(function(count) {
      initData.hasChildren = count > 0 ? true : false;
      cb(null, initData);
    });
  }, function(err) {
    cb(err);
  });

const memoizedGetInitiative = memoize(getInitiative, {
  async: true,
  maxAge: 1,
  max: 1
});

module.exports = (initiativeId, options) => new Promise((resolve, reject) => {
  initiativeId = parseInt(initiativeId);
  memoizedGetInitiative(initiativeId, options, (err, data) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(cloneDeep(data));
  });
});

module.exports.delete = memoizedGetInitiative.delete;
module.exports.ref = memoizedGetInitiative;
