/**
 * InitiativeController
 *
 * @description :: Server-side logic for managing initiatives
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
import memoizedGetTree from './initiative-controller/get-tree';
import memoizedGetPermissions from './initiative-controller/get-permissions';
import memoizedGetInitiative from './initiative-controller/get-initiative';
import memoizedOwnedInitiatives from './initiative-controller/owned-initiatives';
import getParticipatingInitiatives from './initiative-controller/participating-initiatives';
import { skeletonKeys } from './initiative-controller/config';

var _ = require('lodash');
var queries = getQueries.queries;

var InitiativeClass = require('../classes/InitiativeClass'),
  returnInitiativeClass = function(initiative) {
    let initData = new InitiativeClass(initiative);
    initData.nestData();
    initData.aggregate();
    initData.hasKpi = initData.KPI && initData.KPI.length > 0;
    return initData;
  },
  deleteArtifactsWithInitiativeIds = function(initiativeIds) {
    if ((Array.isArray(initiativeIds) && initiativeIds.length === 0) || initiativeIds === null) {
      return;
    }
    var query = {
      initiativeId: initiativeIds
    };
    Promise.all([
      Artifact1.destroy(query),
      Artifact2.destroy(query),
      Artifact3.destroy(query),
      Artifact4.destroy(query),
      Artifact5.destroy(query),
      Artifact6.destroy(query),
      Artifact7.destroy(query),
      ActivityCount.destroy(query)
    ])
      .then(function(destroyedData) {
        destroyedData.forEach(function(data, i) {
          console.log('Artifact', i, data.length, ' destoryed with ids :', JSON.stringify(_.pluck(data, 'sno')));
        });
      });
  };


module.exports = {

  getAllInitiatives: function(req, res) {
    var getInitiatives;
    if (req.user.viewAll === true) {
      getInitiatives = Initiative.find({
        type: {
          '!': 'activity'
        }
      })
        .populateAll();
    } else {
      getInitiatives = Custom.treeUtils.getAllInitiativeIdsForOwner(req.user.id)
        .then(function(initiativeIds) {
          return Initiative.find({
            initiativeId: initiativeIds
          })
            .populateAll();
        });
    }

    getInitiatives.then(function(initiatives) {
      initiatives = _.map(initiatives, returnInitiativeClass);
      initiatives = Custom.cleaners.cleanInitiatives(initiatives, 30)
        .map(initiative => {
          // delete initiative.KPI;
          delete initiative['KPI Milestone'];
          initiative.isEditable = true;
          return initiative;
        });
      res.json(initiatives);
    });
  },

  getTree: function(req, res) {
    let {initiativeId} = req.query;

    let ownerId = req.user.id;

    let {viewAll, viewParentage} = req.user;

    memoizedGetTree(initiativeId, ownerId, {
      viewAll,
      viewParentage
    }, function(err, result) {
      if (err) {
        console.trace(err);
        res.json({
          status: 'ERROR',
          err
        });
      }
      res.json(result);
    });
  },

  getSkeleton: function(req, res) {
    var initiativeId = req.query.initiativeId;
    const canViewAll = req.user.viewAll;
    const getAllInitiativeIdsForOwner = canViewAll ? null : Custom.treeUtils.getAllInitiativeIdsForOwner(req.user.id);
    Promise.all([Custom.treeUtils.getInitiativeIdsUp([initiativeId]), getAllInitiativeIdsForOwner])
      .then(function([initiativeIds, allInitiativeIds]) {
        initiativeIds.push(parseInt(initiativeId));
        const commonInitiativeIds = canViewAll ? initiativeIds : _.intersection(initiativeIds, allInitiativeIds);
        return Initiative.find({
          where: {
            initiativeId: commonInitiativeIds
          },
          select: skeletonKeys
        })
          .populate('owner');
      })
      .then(function(initiatives) {
        return res.json(initiatives);
      }, console.trace);
  },

  getInitiative: function(req, res) {
    const query = req.query;
    let {initiativeId, removeKpi, allMilestones} = query;
    let ownerId = _.result(req, 'user.id', -1);
    let viewAll = _.result(req, 'user.viewAll', false);
    let viewParentage = _.result(req, 'user.viewParentage', false);

    const options = {
      viewAll,
      viewParentage,
      allMilestones: DataUtils.sanitize.parseBoolean(allMilestones),
      removeKpi: DataUtils.sanitize.parseBoolean(removeKpi)
    };

    memoizedGetPermissions(ownerId, initiativeId, options)
      .then(permissions => {

        let [isOwner, isParticipant] = permissions;

        /*
        isOwner : the current user is an owner of some ancestor initiative of the current one
        hasCommonPriority : the current user is an owner of an initiative under the same priority as this one
        priorityIds : priorities under which the user owns at least one initiative
        */
        if (!(isOwner === true || viewAll === true || isParticipant === true)) {
          return [null, isOwner];
        }

        return Promise.all([memoizedGetInitiative(initiativeId, options), isOwner]);
      })
      .then(data => {
        const [initiative, isOwner] = data;
        if (!initiative) {
          return res.json({
            status: 'error',
            message: 'No permission to view'
          });
        }
        if (removeKpi === 'true') {
          delete initiative.KPI;
        }
        initiative.isEditable = isOwner;
        res.json(initiative);
      }, console.trace);
  },

  getOwnedInitiatives: function(req, res) {
    if (!req.isAuthenticated()) {
      return res.json({
        status: 'error',
        message: 'User not Authenticated.'
      });
    }

    memoizedOwnedInitiatives(req.user.id)
      .then(initiatives => {
        res.json(initiatives);
      });
  },

  getParticipatingInitiatives: function(req, res) {
    if (!req.isAuthenticated()) {
      return res.json({
        status: 'error',
        message: 'User not Authenticated.'
      });
    }
    getParticipatingInitiatives(req.user.id)
      .then(initiatives => res.json(initiatives),
        console.log);
  },

  updateEverything: function(req, res) {
    var initiatives = req.body.initiatives;

    _.each(initiatives, function(initiative) {
      Initiative.update({
        initiativeId: initiative.initiativeId
      }, initiative, function(err) {
        console.log(err);
        console.log('-- initiative ', initiative.initiativeId + 'updated');
      });
    });

    res.end('success');

  },

  update: function(req, res) {
    var initiativeData = req.body,
      initiativeId = req.params.id;

    Initiative.update({
      initiativeId: initiativeId
    }, initiativeData, function(err, data) {
      if (err) {
        return console.trace(err);
      }
      res.json(data);
    });
  },

  del: function(req, res) {

    var id = req.params.id || -10,
      query = queries.getAllInitiativeChildrenId.replace('{initiativeId}', id);
    Initiative.query(query, function(err, ids) {
      ids = ids.rows || ids;
      ids = _.map(ids, function(eachData) {
        return _.map(eachData);
      });
      ids = _.unique(_.flatten(ids));
      ids = DataUtils.sanitize.removeNulls(ids);
      ids = ids.length === 0 ? null : ids;
      Initiative.destroy({
        initiativeId: ids
      })
        .then(function() {
          deleteArtifactsWithInitiativeIds(ids);
          return res.json({
            status: 'ok',
            message: 'initiatives with ids:' + JSON.stringify(ids) + 'deleted',
            deletedIds: ids
          });
        });
    });

  },

  postponeAll: function(req, res) {
    var initiativeIds = req.body.initiativeIds,
      afterDate = req.body.afterDate,
      days = req.body.days;
    Custom.treeUtils.getChildInitiativeIds(initiativeIds)
      .then(function(ids) {
        Artifact6.find({
          initiativeId: ids,
          select: ['timePoint', 'sno']
        })
          .then(function(milestones) {
            var postponedMilestones = milestones.map(DataUtils.delayInitiatives.delayMilestone(days, afterDate));
            postponedMilestones.forEach(function(milestone) {
              Artifact6.update({
                sno: milestone.sno
              }, milestone, function(err, data) {
                console.log('KPI Milestone ', data[0].sno + ' updated');
              });
            });
          });
        return Initiative.find({
          initiativeId: ids,
          type: 'activity',
          select: ['plannedStartDate', 'plannedEndDate', 'actualStartDate', 'actualEndDate', 'initiativeId']
        });
      })
      .then(function(activities) {
        var postponedActivities = activities.map(DataUtils.delayInitiatives.delayActivity(days, afterDate));
        postponedActivities.forEach(function(activity) {
          Initiative.update({
            initiativeId: activity.initiativeId
          }, activity)
            .then(function(data) {
              console.log('--- activity with id=', data[0].initinitiativeId, ' postponed ---');
            });
        });
      }, function(err) {
        console.log(err);
      });
    res.json({
      status: 'ok',
      message: 'STATUS.INITIATIVE_ARTIFACTS_POSTPONED'
    });
  },

  getPriorities: function(req, res) {
    if (!req.isAuthenticated()) {
      return res.json({
        status: 'error',
        message: 'User not Authenticated.'
      });
    }

    return Initiative.find({
      parentId: 0,
      type: 'priority'
    })
      .then(function(priorities) {
        res.status(200)
          .json(priorities);
      });
  },

  updateInitiative: function(req, res) {
    const initativeId = req.params.initiativeId;
    const updateData = req.body;
    const {participants, evidence} = updateData;
    delete updateData.participants;
    Initiative.findOne(initativeId)
      .populate('participants')
      .populate('evidence')
      .then(initiative => {
        Mailer.interface.adminChangeEmail({
          oldData: initiative,
          newData: updateData,
          user: req.user,
          type: 'initiative'
        });
        _.assign(initiative, updateData);
        initiative = Custom.aggregators.assignParticipants(initiative, participants);
        initiative = Custom.aggregators.assignEvidence(initiative, evidence);
        const evidenceUpdates = evidence ? Custom.aggregators.generateEvidenceUpdates(evidence) : [];
        return Promise.all([
          initiative.save({
            populate: false
          }),
          ...evidenceUpdates
        ]);
      })
      .then(([savedInitiative, updates]) => {
        res.json([savedInitiative]);
      }, e => console.error(e.stack));
  }

};
