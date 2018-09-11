'use strict';
import memoize from 'memoizee';
import debug from 'debug';
import {
  cloneDeep
} from 'lodash';
import isNumber from 'isnumber';

const log = debug('memoize');

const getPermissions = function (ownerId, initiativeId, options, cb) {
  Promise.all([
    Initiative.isOwnerOfTree(ownerId, initiativeId),
    User.canView(ownerId, initiativeId, options)
  ]).then(permissions => {
    log('Hitting function - get permissions');
    cb(null, permissions);
  }, err => cb(err));
};

const memoizedPermissions = memoize(getPermissions, {
  async: true,
  maxAge: 1,
  max: 1
});

module.exports = (ownerId, initiativeId, options) => new Promise((resolve, reject) => {
  if(!isNumber(ownerId) || !isNumber(initiativeId)){
    throw new TypeError('Only numbers should be passed');
  }
  ownerId = Number(ownerId);
  initiativeId = Number(initiativeId);
  memoizedPermissions(ownerId, initiativeId, options, (err, data) => {
    if (err) {
      return reject(err);
    }
    resolve(cloneDeep(data));
  });
});

module.exports.ref = memoizedPermissions;
