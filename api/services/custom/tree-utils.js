'use strict';

import { queries } from '../../../api/services/getQueries';

var _ = require('lodash');

module.exports = {

  getOwnerInitiativeIds: function(ownerId) {
    return new Promise(function(fullfilled, reject) {
      Initiative.find({
        select: ['initiativeId'],
        owner: ownerId
      }, function(err, data) {
        if (err) {
          console.trace(err);
          return reject(err);
        }
        data = data.map(function(eachId) {
          return eachId.initiativeId;
        });
        fullfilled(data);
      });
    });
  },

  getInitiativeIdsUp: function(initiativeIds, {raw} = {}) {
    return new Promise(function(fulfilled, reject) {
      if (initiativeIds.length === 0) {
        return fulfilled([]);
      }
      var initiativeIdList = DataUtils.sanitize.arrayBracketsToParantheses(JSON.stringify(initiativeIds));
      initiativeIdList = initiativeIdList.replace(new RegExp('"', 'g'), '\'');
      var query = queries.getInitiativeSkeletonUp.replace('{initiativeIds}', initiativeIdList);
      Initiative.query(query, function(err, skeleton) {
        if (err) {
          return reject(err);
        }
        skeleton = skeleton.rows || skeleton;

        var initiativeSkeletons = DataUtils.sanitize.initiativesFromSkeleton(skeleton);
        fulfilled(raw ? initiativeSkeletons : _.pluck(initiativeSkeletons, 'initiativeId'));
      });
    });
  },

  hasCommonPriorities: function(ownerId, initiativeId) {
    return new Promise(function(fulfilled, reject) {
      var queryOwner = queries.ownerHasPriority.replace(/{owner}/g, ownerId),
        queryInitiative = queries.initiativehasPriority.replace(/{initiativeId}/g, initiativeId);
      // console.log(query);
      Initiative.query(queryOwner, function(err, ownerData) {
        if (err) {
          return reject(err);
        }
        Initiative.query(queryInitiative, function(err, initiativeData) {
          if (err) {
            return reject(err);
          }
          ownerData = ownerData.rows || ownerData;
          initiativeData = initiativeData.rows || initiativeData;
          ownerData = _.pluck(ownerData, 'initiativeid');
          initiativeData = _.pluck(initiativeData, 'initiativeid');
          fulfilled({
            has: (DataUtils.sanitize.removeNulls(_.intersection(ownerData, initiativeData)).length > 0),
            priorityIds: _.unique(ownerData)
          });
        });
      });
    });
  },

  getChildInitiativeIds: function(initiativeIds) {
    return new Promise(function(fulfilled, reject) {
      if (initiativeIds.length === 0) {
        return fulfilled([]);
      }
      var initiativeIdList = DataUtils.sanitize.arrayBracketsToParantheses(JSON.stringify(initiativeIds)),
        query = queries.getMultipleInitiativeChildrenId.replace('{initiativeIds}', initiativeIdList);
      Initiative.query(query, function(err, data) {
        if (err) {
          return reject(err);
        }
        // console.log('log:',data);
        data = data.rows || data;
        var ids = _.flatten(_.map(data, function(eachData) {
          return _.map(eachData);
        }));
        fulfilled(_.unique(DataUtils.sanitize.removeNulls(ids)));
      });
    });
  },

  getAllInitiativeIdsForOwner: function(ownerId, options = {}) {
    const {viewParentage} = options;
    var self = this;
    return Promise.all([self.getOwnerInitiativeIds(ownerId), User.getParticipatedInitiativeIds(ownerId)])
      .then(([ownedIds, participatedIds]) => Promise.all([
        Custom.treeUtils.getChildInitiativeIds([...ownedIds, ...participatedIds]),
        viewParentage ? Custom.treeUtils.getInitiativeIdsUp(ownedIds) : []
      ]))
      .then((initiativeIds) => (_.unique(_.flatten(initiativeIds))));
  }

};
