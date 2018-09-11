/**
 * Initiative.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
'use strict';
import { ref } from '../controllers/initiative-controller/get-permissions';
import memoizedGetTree from '../controllers/initiative-controller/get-tree';
import memoizedGetInitiative from '../controllers/initiative-controller/get-initiative';
import memoizedOwnedInitiatives from '../controllers/initiative-controller/owned-initiatives';
import { queries } from '../../api/services/getQueries';
import _ from 'lodash';

const clearOwnedInitiativeMemoir = ({owner, parentId} , cb) => {
  if (owner) {
    memoizedOwnedInitiatives.ref.delete(owner);
  }
  if (parentId) {
    memoizedGetInitiative.ref.delete(parseInt(parentId));
    memoizedGetTree.clear();
  }
  cb();
};

module.exports = {

  attributes: {
    'Executive Summary': {
      collection: 'artifact1',
      via: 'initiativeId'
    },
    KPI: {
      collection: 'artifact2',
      via: 'initiativeId'
    },
    Issues: {
      collection: 'artifact3',
      via: 'initiativeId'
    },
    Budget: {
      collection: 'artifact4',
      via: 'initiativeId'
    },
    'KPI Milestone': {
      collection: 'artifact6',
      via: 'initiativeId'
    },
    Risk: {
      collection: 'artifact7',
      via: 'initiativeId'
    },
    evidence: {
      collection: 'evidence',
      via: 'initiativeId'
    },
    initiativeId: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      columnName: 'initiativeid',
      index: true
    },
    parentId: {
      type: 'integer',
      columnName: 'parentid',
      index: true
    },
    initiative: {
      type: 'string',
      size: 4096,
      columnName: 'title'
    },
    description: {
      type: 'text'
    },
    details: {
      type: 'text'
    },
    dept: {
      type: 'string',
      size: 1024
    },
    owner: {
      model: 'user',
      type: 'integer',
      index: true
    },
    artifactsUpdatedAt: {
      type: 'datetime'
    },
    avgAchievmentLevel: {
      type: 'string',
      size: 1024,
      columnName: 'avgachievmentlevel'
    },
    status: {
      type: 'string',
      size: 1024
    },
    plannedStartDate: {
      type: 'string',
      size: 1024,
      columnName: 'plannedstartdate'
    },
    plannedEndDate: {
      type: 'string',
      size: 1024,
      columnName: 'plannedenddate'
    },
    actualStartDate: {
      type: 'string',
      size: 1024,
      columnName: 'actualstartdate'
    },
    actualEndDate: {
      type: 'string',
      size: 1024,
      columnName: 'actualenddate'
    },
    levelOfAchievment: {
      type: 'string',
      size: 1024,
      columnName: 'avgachievmentlevel'
    },
    type: {
      type: 'string',
      size: 1024
    },
    activityCount: {
      model: 'activitycount',
      columnName: 'activitycount'
    },
    priorityAchievementTargetRatio: {
      type: 'string',
      size: 1024,
      columnName: 'priorityachievementtargetratio'
    },

    participants: {
      collection: 'user',
      via: 'participatedInitiatives',
      dominant: true
    }
  },
  tableName: 'initiative',
  updateActivities: function(initiativeId, activities, cb) {
    Initiative.findOne({
      initiativeId: initiativeId
    })
      .then(function(initiative) {
        if (!initiative) {
          return Initiative.findOne({
            initiativeId: initiativeId
          });
        }
        if (initiative.activityCount) {
          return ActivityCount.update({
            id: initiative.activityCount
          }, activities);
        }
        return Initiative.update({
          initiativeId: initiativeId
        }, {
          activityCount: activities
        });
      })
      .then(cb, console.log);
  },

  childInitiativeIds: function(owner, initiativeId) {
    return new Promise(function(fulfilled, rejected) {
      var query,
        initiativeIdArray = [];

      query = owner === true ? queries.getInitiativeChildrenId.replace('{initiativeId}', initiativeId) : queries.getInitiativeChildrenIdWithOwner.replace('{initiativeId}', initiativeId)
        .replace(/{owner}/g, owner);
      Initiative.query(query, function(err, data) {
        if (err) {
          rejected(err);
        }
        initiativeIdArray = initiativeIdArray.concat(_.pluck(data, 'lev1'))
          .concat(_.pluck(data, 'lev2'))
          .concat(_.pluck(data, 'lev3'));
        initiativeIdArray = DataUtils.sanitize.removeNulls(_.unique(initiativeIdArray));
        fulfilled(initiativeIdArray);
      });
    });
  },

  isOwnerOfTree: function(owner, intiativeId) {
    return new Promise(function(fulfilled, rejected) {
      var query = queries.getAllInitiativeParentIdWithOwner.replace('{initiativeId}', intiativeId)
        .replace(/{owner}/g, owner);

      Initiative.query(query, function(err, data) {
        if (err) {
          return rejected(err);
        }
        data = data.rows || data;
        fulfilled(DataUtils.sanitize.removeNulls(_.map(data[0]))
            .length > 0);
      });
    });
  },

  findAndPopulateOne: (initiativeId, options = {}) => Initiative.findOne(initiativeId)
    .populate('Executive Summary')
    .populate('Issues')
    .populate('Budget')
    .populate('Risk')
    .populate('owner')
    .populate('evidence')
    .populate('participants')
    .populate('activityCount')
    .then(initiative => {
      const {removeKpi, allMilestones} = options;

      const milestoneQuery = allMilestones ? {} : {
        timePoint: {
          '<=': new Date()
        },
        sort: 'timePoint DESC',
        limit: 12
      };

      const firstFutureMilestoneQuery = sno => ({
        timePoint: {
          '>': new Date()
        },
        sort: 'timePoint ASC',
        limit: 1,
        parentId: sno
      });

      const kpiQuery = {
        initiativeId: initiative.initiativeId
      };

      const findKpis = removeKpi ? Artifact2.count(kpiQuery) : Artifact2
        .find(kpiQuery)
        .populate('KPI Milestone', milestoneQuery)
        .then(kpis => Promise.all(kpis.map(kpi => Artifact6.findOne(firstFutureMilestoneQuery(kpi.sno))
          .then(futureMilestone => {
            if (futureMilestone && !allMilestones) {
              kpi['KPI Milestone'].push(futureMilestone);
            }
            return Promise.resolve(kpi);
          })
        )));

      return Promise.all([initiative, findKpis]);
    })
    .then(([initiative, kpis]) => {
      const {removeKpi} = options;

      initiative.hasKpi = removeKpi ? kpis > 0 : kpis.length > 0;
      initiative.KPI = removeKpi ? [] : kpis;
      return initiative;
    }),

  afterUpdate: (initiativeUpdates, cb) => {
    const ownerId = _.result(initiativeUpdates, 'owner', null);
    const initiativeId = _.result(initiativeUpdates, 'initiativeId', null);
    memoizedGetInitiative.delete(initiativeId);
    memoizedGetTree.clear();
    if (!ownerId) {
      return cb();
    }
    ref.clear();
    cb();
  },

  afterCreate: clearOwnedInitiativeMemoir,
  afterDestroy: (destroyedInitiatives, cb) => {
    destroyedInitiatives.forEach(initiative => clearOwnedInitiativeMemoir(initiative, () => {
    }));
    cb();
  }
};
