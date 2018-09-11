'use strict';
import {
  clone
}
from 'lodash';
import memoize from 'memoizee';
import {
  skeletonKeys
}
from './config';

const getOwnedInitiatives = (ownerId, cb) => Initiative.find({
  owner: ownerId,
  select: skeletonKeys
}, (err, data) => {
  cb(err, data);
});

const memoizedOwnedInitiatives = memoize(getOwnedInitiatives, {
  async: true,
  maxAge: 1,
  max: 1
});

module.exports = owner => new Promise((resolve, reject) => {
  owner = parseInt(owner);
  memoizedOwnedInitiatives(owner, (err, data) => {
    if (err) {
      return reject(err);
    }
    resolve(clone(data));
  });
});

module.exports.ref = memoizedOwnedInitiatives;
