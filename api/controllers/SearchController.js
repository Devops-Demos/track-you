/**
 * SearchController
 *
 * @description :: Server-side logic for managing searches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
var jsStringEscape = require('js-string-escape'),
  async = require('async'),
  _ = require('lodash'),
  InitiativeClass = require('../classes/InitiativeClass'),
  KpiClass = require('../classes/KpiClass');

module.exports = {
  search: function (req, res) {
    var searchTerm = jsStringEscape(req.query.query),
      searchInitiatives = (req.query.initiative === 'true'),
      searchOutcomeKpis = (req.query.outcomeKpi === 'true'),
      searchOutputKpis = (req.query.outputKpi === 'true'),
      searchOwners = (req.query.owner === 'true'),
      searchActivities = (req.query.activity === 'true'),
      tasks = [],
      returnData = {},
      owner = null,
      queries = getQueries.queries,
      pushInitiativeSearchTask = function (queryName, resultKey, idsString) {
        tasks.push(function (cb) {
          var query = queries[queryName].replace('{query}', searchTerm).replace('{initiativeids}', idsString);
          Initiative.query(query, function (err, data) {
            if (err) {
              console.trace('ERROR: In SearchController', err);
            }
            data = data.rows || data;
            var initiativeIds = _.pluck(data, 'initiativeid');
            Initiative.find({
                initiativeId: initiativeIds
              })
              .populateAll()
              .then(function (initiatives) {
                initiatives = initiatives.map(function (initiative) {
                  owner = initiative.owner ? initiative.owner.name : null;
                  initiative = (new InitiativeClass(initiative)).aggregate();
                  if (resultKey === 'Owners') {
                    return {
                      id: initiative.initiativeId,
                      name: owner,
                      status: initiative.status,
                      parentId: initiative.parentId,
                      type: initiative.type,
                      initiative: initiative.initiative
                    };
                  }
                  return {
                    id: initiative.initiativeId,
                    owner: owner,
                    status: initiative.status,
                    parentId: initiative.parentId,
                    type: initiative.type,
                    name: initiative.initiative
                  };
                });
                returnData[resultKey] = initiatives;
                cb();
              });
          });
        });
      },
      pushKpiSearchTask = function (queryName, resultKey, idsString) {
        tasks.push(function (cb) {
          var query = queries[queryName].replace('{query}', searchTerm).replace('{initiativeids}', idsString);
          Initiative.query(query, function (err, data) {
            if (err) {
              console.trace('ERROR: In SearchController', err);
            }
            data = data.rows || data;
            var snos = _.pluck(data, 'sno');
            Artifact2.find({
                sno: snos
              })
              .populate('KPI Milestone')
              .then(function (kpis) {
                kpis = kpis.map(function (kpi) {
                  kpi = new KpiClass(kpi);
                  kpi.calculateKpiTargets().renameKeys();
                  delete kpi['KPI Milestone'];
                  return kpi;
                });
                returnData[resultKey] = kpis;
                cb();
              });
          });
        });
      };
    if (req.user && req.user.viewAll !== true) {
      owner = req.user.id;
    }
    if (searchTerm.trim().length < 1) {
      return res.json({
        status: 'error',
        error: 'Blank search entered'
      });
    }
    Custom.treeUtils.getAllInitiativeIdsForOwner(owner)
      .then(function (initiativeIds) {
        var idsString = DataUtils.sanitize.arrayBracketsToParantheses(JSON.stringify(initiativeIds));
        if (searchInitiatives) {
          pushInitiativeSearchTask('initiativeSearchQuery', 'Initiatives/ Sub Initiatives', idsString);
        }
        if (searchOutcomeKpis) {
          pushKpiSearchTask('outcomeKpiSearchQuery', 'Outcome KPI', idsString);
        }
        if (searchOutputKpis) {
          pushKpiSearchTask('outputKpiSearchQuery', 'Output KPI', idsString);
        }
        if (searchOwners) {
          pushInitiativeSearchTask('ownerSearchQuery', 'Owners', idsString);
        }
        if (searchActivities) {
          pushInitiativeSearchTask('activitySearchQuery', 'Activities', idsString);
        }

        async.parallel(tasks, function () {
          res.json(returnData);
        });
      });

  }
};
