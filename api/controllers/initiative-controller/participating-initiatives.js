'use strict';
import {
  skeletonKeys
} from './config';
import {
  pick
} from 'lodash';
const getParticipatingInitiatives = (userId) => User.findOne({
    id: userId
  })
  .populate('participatedInitiatives')
  .then(({
    participatedInitiatives
  }) => participatedInitiatives.map(initiative => pick(initiative, skeletonKeys)));

module.exports = getParticipatingInitiatives;
