'use strict';

import _ from 'lodash';
import debug from 'debug';

let kpiCalculationLog = debug('cron:kpi-calculation');

var calculateKpiFromChildren = function (kpi, allKpis) {
  if (kpi.isCalculated !== true) {
    return {
      baseline: kpi.baseline,
      target: kpi.target
    };
  }
  var childKpis = _.filter(allKpis, {
      parentKpi: String(kpi.sno)
    }),
    childKpiSums = _.map(childKpis, function (eachKpi) {
      return calculateKpiFromChildren(eachKpi, allKpis);
    });

  kpi.baseline = _.sum(_.pluck(childKpiSums, 'baseline'));
  kpi.target = _.sum(_.pluck(childKpiSums, 'target'));
  kpi.finishedCalculation = true;

  return {
    baseline: kpi.baseline,
    target: kpi.target
  };
};

module.exports = () => {
  Artifact2.find({
      select: ['sno', 'baseline', 'target', 'isCalculated', 'parentKpi']
    })
    .then(kpiData => {
      kpiData.forEach(eachKpi => {
        if (eachKpi.finishedCalculation || eachKpi.isCalculated !== true) {
          return;
        }
        kpiCalculationLog('calculating for kpi:', eachKpi);
        calculateKpiFromChildren(eachKpi, kpiData);
      });
      let kpiPromises = _.filter(kpiData, {
        finishedCalculation: true
      }).map(eachKpi => Artifact2.update({
        sno: eachKpi.sno
      }, {
        baseline: eachKpi.baseline,
        target: eachKpi.target
      }));
      Promise.all(kpiPromises).then(() => {
        console.log('log:', 'startKpiCalculationJob finished', new Date());
      }, console.log);
    });
};
