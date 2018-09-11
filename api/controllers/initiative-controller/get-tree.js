'use strict';
import memoize from 'memoizee';
import {
  contains
}
from 'lodash';
import debug from 'debug';
import {
  skeletonKeys
}
from './config';

const memoizeLog = debug('memoize');
const getTree = function (initiativeId, ownerId, options, cb) {
  memoizeLog('Hitting function - getTree');
  initiativeId = Number(initiativeId);
  ownerId = Number(ownerId);
  const {
    viewAll
  } = options;
  User.canView(ownerId, initiativeId, options)
    .then(function (canView) {
      /*
      Get tree returns the ids of the children of the requested id (initiativeId). If a user is requesting any id for get-tree,
      they can only do so by clicking on the initiative above it (either through owned initiatives page or overall page).
      The exception to this is during the initial get-tree, when initiativeId=0. Since no one can own the master initiative,
      we have to make an exception in the lines below
      */
      if (!canView && initiativeId !== 0) {
        return [
          [], null
        ];
      }

      let findInitiatives = Initiative.find({
        parentId: initiativeId,
        select: skeletonKeys
      });

      let findOwnerIds = viewAll ? null : Custom.treeUtils.getAllInitiativeIdsForOwner(ownerId, options);

      return Promise.all([findInitiatives, findOwnerIds]);
    })
    .then(function (data) {
      let initiatives = data[0];
      const ownerInitiatives = data[1];

      if (ownerInitiatives instanceof Array) {
        initiatives = initiatives.filter(initiative => contains(ownerInitiatives, initiative.initiativeId));
      }
      initiatives = Custom.cleaners.cleanInitiatives(initiatives);

      // initiative.status
      // remove user creds from response
      return cb(null, initiatives);
    }, err => cb(err, null));
};

const memoizedGetTree = memoize(getTree, {
  async: true,
  maxAge: 1,
  max: 1
});

module.exports = memoizedGetTree;
