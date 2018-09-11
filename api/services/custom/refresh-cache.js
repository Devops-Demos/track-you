'use strict';

import _ from 'lodash';
import async from 'async';
import debug from 'debug';
import isNumber from 'isnumber';
import memoizedGetInitiative from '../../controllers/initiative-controller/get-initiative';
import memoizedGetTree from '../../controllers/initiative-controller/get-tree';

const log = debug('memoize:restore');

const refreshCache = (artifact, cb) => {
  const initiativeId = _.result(artifact, 'initiativeId') || _.result(artifact, 'initiativeid');
  if(!(initiativeId && isNumber(initiativeId))){
    log('initiative id not given');
    return cb();
  }
  Initiative.update({
      initiativeId: initiativeId
    }, {
      artifactsUpdatedAt: new Date()
    })
    .then(() => {
      memoizedGetInitiative.ref.delete(initiativeId);
      memoizedGetTree.clear();
      log(`initiative ${initiativeId} artifactUpdated`, initiativeId);
      cb();
    }, console.trace);
};

module.exports = refreshCache;
