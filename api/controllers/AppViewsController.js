/*globals _:false,AppViews:false*/
var KpiClass = require('../classes/KpiClass');

var getAppViews = function(req, res) {
  'use strict';

  if (!req.param || !req.param('viewName')) {
    res.status(400).json({
      status: 'viewName not present'
    });
    return;
  }

  var reqViewName = req.param('viewName');
  var reqInitiativeId = req.param('initiativeId');

  if (reqInitiativeId) {
    Promise.all([AppViews.find({
      viewName: reqViewName
    }), Initiative.findOne({
      initiativeId: reqInitiativeId
    })]).then(function(response) {
      var views = response[0];
      var initiative = response[1];

      Initiative.find({
        where: {
          or: [{
            initiative: initiative.initiative
          }, {
            parentId: 0
          }]
        }
      }).then(function(initiatives) {
        var priorities = _.chain(initiatives).filter({
          parentId: 0
        }).pluck('initiativeId').value();
        var initiatives = _.chain(initiatives).reject(function(initiative) {
          return initiative.type.toLowerCase() === 'priority';
        }).pluck('initiativeId').value();

        Promise.all([Artifact2.find({
          initiativeId: initiatives,
          parentKpi: _.pluck(views, 'kpiId')
        }).populateAll(), Artifact2.find({
          initiativeId: priorities,
          sno: _.pluck(views, 'kpiId')
        }).populateAll()]).then(function(response) {
          var mergedKpis = [];
          response[0] = DataUtils.mapDeep(response[0], 'KPI Milestone', 'timePoint', DataUtils.transformDate);
          _.each(response[0], function(kpi) {
            kpi = new KpiClass(kpi);
            var view = _.find(views, function(view) {
              return view.kpiId === kpi.parentKpi;
            });
            kpi.sequence = view.sequence;
            kpi.emphasis = view.emphasis;
            kpi.calculateKpiTargets();
            mergedKpis.push(kpi);
          });
          response[1] = DataUtils.mapDeep(response[1], 'KPI Milestone', 'timePoint', DataUtils.transformDate);
          _.each(response[1], function(kpi) {
            kpi = new KpiClass(kpi);
            var view = _.find(views, function(view) {
              return parseInt(view.kpiId) === kpi.sno;
            });
            kpi.sequence = view.sequence;
            kpi.emphasis = view.emphasis;
            kpi.calculateKpiTargets();
            mergedKpis.push(kpi);
          });

          mergedKpis = Custom.cleaners.cleanKpis(mergedKpis);

          res.status(200).json(_.assign({
            status: 'ok'
          }, {
            data: mergedKpis
          }));
        });
      });
    }, console.log);
  } else {
    AppViews.find({
      viewName: reqViewName
    }).then(function(views) {
      Artifact2.find({
        sno: _.pluck(views, 'kpiId')
      }).populateAll().then(function(kpis) {
        kpis = DataUtils.mapDeep(kpis, 'KPI Milestone', 'timePoint', DataUtils.transformDate);
        kpis = _.map(kpis, function(kpi) {
          kpi = new KpiClass(kpi).calculateKpiTargets();
          var view = _.find(views, function(view) {
            return parseInt(view.kpiId) === kpi.sno;
          });
          kpi.sequence = view.sequence;
          kpi.emphasis = view.emphasis;
          return kpi;
        });
        kpis = Custom.cleaners.cleanKpis(kpis, 30);
        res.status(200).json(_.assign({
          status: 'ok'
        }, {
          data: kpis
        }));
      });
    });
  }

};

var getInitiativeViews = function(req, res) {
  if (!req.isAuthenticated()) {
    return res.json({
      status: 'error',
      message: 'User not Authenticated.'
    });
  }

  if (!req.param || !req.param('viewName')) {
    res.status(400).json({
      status: 'viewName not present'
    });
    return;
  }

  var reqViewName = req.param('viewName');

  AppViews.find({
    viewName: reqViewName
  }).then(function(views) {
    Artifact2.find({
      parentKpi: _.pluck(views, 'kpiId')
    }).populateAll().then(function(kpis) {
      kpis = DataUtils.mapDeep(kpis, 'KPI Milestone', 'timePoint', DataUtils.transformDate);
      kpis = _.map(kpis, function(kpi) {
        kpi = new KpiClass(kpi);
        var view = _.find(views, function(view) {
          return view.kpiId === kpi.parentKpi;
        });
        kpi.sequence = view.sequence;
        kpi.emphasis = view.emphasis;
        kpi.calculateKpiTargets();
        delete kpi['KPI Milestone'];
        return kpi;
      });
      res.status(200).json(_.assign({
        status: 'ok'
      }, {
        data: kpis
      }));
    });
  });
};

module.exports = {
  getAppViews: getAppViews,
  getInitiativeViews: getInitiativeViews
};