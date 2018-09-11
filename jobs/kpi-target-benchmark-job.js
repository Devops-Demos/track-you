'use strict';
import _ from 'lodash';
import KpiClass from '../api/classes/KpiClass';
import debug from 'debug';

const log = debug('cron:kpi-target-benchmarks');

var updateCalculatedKpi = function(calculatedKpi) {
  var milestoneSno = calculatedKpi['KPI Milestone'].length === 2 ? _.pluck(calculatedKpi['KPI Milestone'], 'sno') : undefined,
    query = [{
      targetValue: calculatedKpi.targetBenchmarks.currentTarget,
      actualValue: calculatedKpi.targetBenchmarks.actual,
      timePoint: calculatedKpi.targetBenchmarks.timePointActual,
      parentId: calculatedKpi.sno,
      initiativeId: calculatedKpi.initiativeId
    }, {
      targetValue: calculatedKpi.targetBenchmarks.currentTarget,
      actualValue: null,
      timePoint: calculatedKpi.targetBenchmarks.timePointTarget,
      parentId: calculatedKpi.sno,
      initiativeId: calculatedKpi.initiativeId
    }];
  if (milestoneSno === undefined) {
    return Artifact6.destroy({
      parentId: calculatedKpi.sno
    }).then(function() {
      return Artifact6.create(query);
    });
  }

  return Promise.all([Artifact6.update({
      sno: milestoneSno[0]
    }, query[0]),
    Artifact6.update({
      sno: milestoneSno[1]
    }, query[1])
  ]);
};

var startKpiTargetJob = function(allKpis) {
  var calculatedKpis = _.filter(allKpis, {
    isCalculated: true
  });

  var getKpiTargets = function(kpi) {
    if (kpi.isCalculated) {
      return getAvgMilestoneOfChildren(kpi.sno);
    }
    return (new KpiClass(kpi)).calculateKpiTargets().targetBenchmarks;
  };

  var getAvgMilestoneOfChildren = function(sno) {
    var children = _.filter(allKpis, {
        parentKpi: String(sno)
      }),
      kpiTargets = children.map(getKpiTargets),
      allMilestones = _.flatten(_.pluck(children, 'KPI Milestone')),
      returnedTarget = {
        currentTarget: 0,
        actual: 0
      };
    kpiTargets.forEach(function(target) {
      if (!isNaN(target.currentTarget) && target.currentTarget !== null && returnedTarget.currentTarget !== null) {
        returnedTarget.currentTarget += target.currentTarget;
      } else{
        returnedTarget.currentTarget = null;
      }
      if (!isNaN(target.actual) && target.actual !== null && returnedTarget.actual !== null) {
        returnedTarget.actual += target.actual;
      } else{
        returnedTarget.actual = null;
      }
    });
    returnedTarget.timePointTarget = _.result(Custom.aggregators.getNearestPastKpiMilestone(allMilestones),'timePoint');
    returnedTarget.timePointActual = _.result(Custom.aggregators.getNearestPastKpiMilestoneWithActual(allMilestones),'timePoint');
    return returnedTarget;
  };

  calculatedKpis.forEach(function(eachKpi) {
    eachKpi.targetBenchmarks = getAvgMilestoneOfChildren(eachKpi.sno);
  });

  return calculatedKpis;
};

module.exports = () => {
  Artifact2.find({
      kpiType: 'output'
    }).populate('KPI Milestone')
    .then(function(allKpis) {
      var calculatedKpis = startKpiTargetJob(allKpis),
        milestoneUpdates = calculatedKpis.map(updateCalculatedKpi);
      Promise.all(milestoneUpdates).then(data =>{
        log('Milestones updated :', data);
        log(data.length, 'milestones updated');
        console.log('log:','Kpi target benchmark job completed', new Date());
      }, console.log);
    });
};
