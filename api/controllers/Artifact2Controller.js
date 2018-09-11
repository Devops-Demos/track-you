/**
 * Artifact2Controller
 *
 * @description :: Server-side logic for managing artifact2s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
var _ = require('lodash'),
  async = require('async'),
  jsStringEscape = require('js-string-escape'),
  KpiClass = require('../classes/KpiClass'),
  makeEditable = function(kpi) {
    kpi.isEditable = true;
    return kpi;
  };

var queries = getQueries.queries;

module.exports = {
  getKpi: function(req, res) {
    var sno = req.query.sno;
    Artifact2.findOne({
      sno: sno
    }).populate('initiativeId').then(function(kpi) {
      kpi.initiative = kpi.initiativeId;
      delete kpi.initiativeId;
      res.json(kpi);
    });
  },

  getCurrentKpis: function(req, res) {
    var sno = req.query.sno,
      user = req.user || {},
      query = queries.getKpiChildrenId.replace('{kpiId}', sno),
      kpiIdArray = [];

    Artifact2.query(query, function(err, data) {
      if (err) {
        console.trace('Error: ', err);
      }
      data = data.rows || data;
      kpiIdArray = kpiIdArray.concat(_.pluck(data, 'lev1')).concat(_.pluck(data, 'lev2')).concat(_.pluck(data, 'lev3'));
      kpiIdArray = DataUtils.sanitize.removeNulls(_.unique(kpiIdArray));
      Artifact2.find({
        sno: kpiIdArray
      })
        .populateAll()
        .then(function(data) {
          data.forEach(function(eachKpi) {
            eachKpi.initiative = eachKpi.initiativeId;
            eachKpi.latestMilestone = Custom.aggregators.getLatestKpiMilestone(eachKpi['KPI Milestone']);
            delete eachKpi.initiativeId;
          });

          var filteredData = data.filter(function(eachData) {
            return Number(eachData.sno) === Number(sno);
          });
          var initiativeId = _.has(filteredData, '[0].initiative.initiativeId') ? filteredData[0].initiative.initiativeId : -1;
          Initiative.isOwnerOfTree(user.id || -1, initiativeId)
            .then(function(isOwner) {

              data = _.map(data, function(kpi) {
                kpi = new KpiClass(kpi);
                kpi.calculateKpiTargets();
                kpi.status = kpi.calculateKpiTargets().status;
                return kpi;
              });

              data = Custom.cleaners.cleanKpis(data);

              if (isOwner || user.viewAll) {
                return res.json(data.map(makeEditable));
              }
              return res.json(data.map(function(eachData) {
                if (eachData.initiative.owner === user.id) {
                  return makeEditable(eachData);
                }
                return eachData;
              }));
            }, console.log);
        }, console.log);
    });
  },

  upsertKpi: function(req, res) {
    var data = req.body;
    var kpiData = data.kpiData,
      childKpis = data.childKpis || [],
      childKpisExist = (childKpis.filter(function(kpi) {
          return kpi.deleted !== true;
        }).length > 0),
      kpiMilestones = data.kpiMilestones,
      tasks = [];
    kpiData.hasDrillDown = childKpisExist;

    const kpiSno = kpiData.sno;

    /*
    The below promise is to find previous values of the KPI to send admin notification email.
    The kpi data present in the call contains milestones, children, and kpi
    */
    const getOldKpiData = kpiSno ? Promise.all([
      Artifact2.findOne({
        sno: kpiSno,
        select: ['sno', 'kpi', 'initiativeId', 'statusSeparator1', 'statusSeparator2', 'target']
      }).populateAll(),
      Artifact2.find({
        parentKpi: kpiSno,
        select: ['sno', 'target', 'kpi']
      })
    ]) : Promise.resolve([null, null]);

    getOldKpiData
      .then(([kpi, children]) => {
        if (kpi) {
          Mailer.interface.adminChangeEmail({
            oldData: {
              kpi,
              children
            },
            newData: data,
            user: req.user,
            type: 'kpi'
          });
        }
        return DataUtils.kpi.upsertKpi(kpiData);
      })
      .then(function(upsertedKpi) {
        upsertedKpi = Array.isArray(upsertedKpi) ? upsertedKpi[0] : upsertedKpi;
        var kpiId = upsertedKpi.sno,
          uom = upsertedKpi.uom,
          initiativeId = upsertedKpi.initiativeId;
        tasks.push(function(cb) {
          DataUtils.kpi.upsertChildren(childKpis, {
            parentKpi: kpiId,
            uom: uom,
            initiativeId: upsertedKpi.kpiType === 'outcome' ? initiativeId : undefined
          }, cb);
        });
        tasks.push(function(cb) {
          DataUtils.kpi.upsertMilestones(kpiMilestones, {
            parentKpi: kpiId,
            initiativeId: initiativeId
          }, cb);
        });
        async.parallel(tasks, function(err, done) {
          res.json({
            kpiData: upsertedKpi,
            childKpis: done[0],
            kpiMilestones: done[1]
          });
        });
      }, e => console.error(e.stack));
  },

  deleteKpi: function(req, res) {
    var id = jsStringEscape(req.params.id),
      query = queries.getAllKpiChildrenId.replace('{sno}', id);

    Artifact2.query(query, function(err, ids) {
      ids = ids.rows || ids;
      ids = _.map(ids, function(eachData) {
        return _.map(eachData);
      });
      ids = _.unique(_.flatten(ids));
      ids = DataUtils.sanitize.removeNulls(ids);
      ids = ids.length === 0 ? null : ids;
      Artifact2.destroy({
        sno: ids
      })
        .then(() => res.json({
          status: 'ok',
          message: 'kpis with ids:' + JSON.stringify(ids) + 'deleted',
          deletedIds: ids
        }));
    });
  }

};
