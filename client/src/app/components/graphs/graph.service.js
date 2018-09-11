class GraphService {
  constructor(DataService, pushAppConstants, MainAdapter, $rootScope, $location, $timeout) {
    'ngInject';

    let vm = this;
    vm.DataService = DataService;
    vm.pushAppConstants = pushAppConstants;
    vm.MainAdapter = MainAdapter;
    vm.$rootScope = $rootScope;
    vm.$location = $location;
    vm.$timeout = $timeout;
  }

  getChartTypeValues(kpi) {
    let chartData = {},
      actualValue = 0,
      targetValue = 0;
    actualValue = kpi.nearestActualMilestone && kpi.nearestActualMilestone.actualValue ? parseFloat(kpi.nearestActualMilestone.actualValue) : 0;
    targetValue = kpi.latestMilestone && kpi.latestMilestone.targetValue ? parseFloat(kpi.latestMilestone.targetValue) : 0;
    chartData.actualValue = parseFloat(actualValue.toFixed(2));
    chartData.targetValue = targetValue ? parseFloat(targetValue.toFixed(2)) : 0;
    chartData.uom = !!kpi.uom ? kpi.uom : "";
    return chartData;
  }

  hasChart(kpi, view, isNearestMilestone) {
    let hasChart = false,
      tmpKpi = angular.copy(kpi);

    if (isNearestMilestone) {
      if (tmpKpi.nearestActualMilestone) {
        hasChart = true;
      }
    } else {
      let kpiMilestones = _.chain(tmpKpi['KPI Milestone']).sortBy(function(milestone) {
        return new Date(milestone.timepoint);
      }).value();
      hasChart = (kpiMilestones.length > 0);
    }
    return hasChart;
  }

  getStatus(kpi) {
    let vm = this;
    return vm.pushAppConstants.statusMap[kpi.status] ? vm.pushAppConstants.statusMap[kpi.status] : 'unknown';
  }

  navigateTo(path) {
    let vm = this;
    vm.$timeout(function() {
      vm.$rootScope.$apply(function() {
        vm.$location.path(path);
      });
    });
  }

  navigationPath(kpi) {
    if (kpi.hasDrillDown) {
      if (kpi.linkKpi) {
        return ('output/' + kpi.linkKpi);
      } else if (kpi.kpiType.toLowerCase() === 'outcome') {
        return ('initiative/' + kpi.initiativeId + '/outcome/' + kpi.sno);
      } else if (kpi.kpiType.toLowerCase() === 'output') {
        return ('output/' + kpi.sno);
      }
    }
  }

  getMultiKpiGraphData(kpis) {
    let vm = this,
      tmpKpi = angular.copy(kpis),
      kpiActualValueSeries = [],
      kpiTargetValueSeries = [],
      kpiTimePoint = [],
      dates = [],
      returnObj = {},
      kpiSumData;

    kpiSumData = _.forEach(tmpKpi, function(childKpi) {
      childKpi['KPI Milestone'] = _.chain(childKpi['KPI Milestone']).sortBy(function(milestone) {
        return new Date(milestone.timePoint);
      }).each(function(milestone) {
        dates.push(vm.MainAdapter.resetDateHours(milestone.timePoint));
      }).value();
    });

    dates = (_.uniq(dates)).sort(function(a, b) {
      return a - b;
    });
    _.forEach(kpiSumData, function(kpi) {
      let kpiNavigationDataObj = {
        name: kpi.kpi,
        sno: kpi.sno,
        initiativeId: kpi.initiativeId,
        hasDrillDown: kpi.hasDrillDown,
        kpiType: kpi.kpiType,
        linkKpi: kpi.linkKpi
      };
      let dataObjActual = {
        name: kpi.kpi,
        data: [],
        color: vm.pushAppConstants.statusColor[vm.pushAppConstants.statusMap[kpi.status]],
        url: vm.navigationPath(kpiNavigationDataObj)
      };
      let dataObjTarget = {
        name: kpi.kpi,
        data: [],
        color: vm.pushAppConstants.chart.line.targetColor,
        url: vm.navigationPath(kpiNavigationDataObj)
      };
      _.forEach(dates, function(date) {
        kpi['KPI Milestone'] = _.map(kpi['KPI Milestone'], function(milestone) {
          milestone.timePoint = vm.MainAdapter.resetDateHours(milestone.timePoint);
          return milestone;
        });
        let dateMatchKpiMilestone = _.where(kpi['KPI Milestone'], {
          'timePoint': date
        });
        if (dateMatchKpiMilestone.length > 0) {
          dataObjActual.data.push(isNaN(parseFloat(dateMatchKpiMilestone[0].actualValue)) ? null : vm.MainAdapter
            .roundOffToNDecimals(parseFloat(dateMatchKpiMilestone[0].actualValue), 2));
          dataObjTarget.data.push(isNaN(parseFloat(dateMatchKpiMilestone[0].targetValue)) ? null : vm.MainAdapter
            .roundOffToNDecimals(parseFloat(dateMatchKpiMilestone[0].targetValue), 2));

        } else {
          dataObjActual.data.push(null);
          dataObjTarget.data.push(null);
        }
      });
      kpiActualValueSeries.push(dataObjActual);
      kpiTargetValueSeries.push(dataObjTarget);
    });

    _.each(dates, function(time) {
      let date = new Date(time);
      kpiTimePoint.push(date.getFullYear() + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + ("0" + date.getDate()).slice(-2));
    });
    returnObj.actual = kpiActualValueSeries;
    returnObj.target = kpiTargetValueSeries;
    returnObj.timepoint = kpiTimePoint;
    return returnObj;
  }

}
export default GraphService;