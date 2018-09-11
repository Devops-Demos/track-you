class SearchAdapter {
  constructor(DataService, pushAppConstants, $q, OfflineService, $http) {
    'ngInject';
    this.OfflineService = OfflineService;
    this.DataService = DataService;
    this.constants = pushAppConstants;
    this.$q = $q;
    this.$http = $http;
  }

  getAllInitiativeTypes() {
    let vm = this;
    return _.chain(vm.getSearchData()).pluck('type').uniq().map(function(initiativeType) {
      return {
        name: initiativeType,
        value: true
      };
    }).value();
  }

  getSearchData() {
    return this.OfflineService.getcollection('initiative');
  }

  populateSearchData(data) {
    let vm = this,
      initiativeKeys = ['Initiative', 'Sub-initiative (1)', 'Sub-initiative (2)', 'Sub-initiative (3)', 'Sub-initiative (4)'];
    vm.data = data;
    //vm.populateKpiData(initiativeKeys) is for output and vm.populateKpiData(['priority']) is for outcome
    return vm.populateOutcomeKpiData().concat(vm.populateOutputKpiData(initiativeKeys), vm.populateOwnerData(),
      vm.populateInitiativeData(initiativeKeys), vm.populateInitiativeData(['activity']));
  }

  getSearchFilters() {
    return [{
      name: 'Outcome KPI',
      value: true
    }, {
      name: 'Initiatives/ Sub Initiatives',
      value: true
    }, {
      name: 'Output KPI',
      value: true
    }, {
      name: 'Activities',
      value: true
    }, {
      name: 'Owners',
      value: true
    }];
  }

  populateInitiativeData(type) {
    let vm = this,
      kpiData = [];
    _.chain(vm.data).filter(function(d) {
      return _.includes(type, d.type);
    }).map(function(initiativeData) {
      kpiData.push({
        name: initiativeData.initiative,
        id: initiativeData.initiativeId,
        type: type.length > 1 ? 'Initiatives/ Sub Initiatives' : 'Activities',
        parentId: initiativeData.parentId,
        status: initiativeData.status
      });
    }).value();
    return kpiData;
  }

  populateOwnerData() {
    let vm = this;
    return _.chain(vm.data).map(function(initiative) {
      return !!initiative.owner ? {
        'name': initiative.owner.name,
        'id': initiative.initiativeId,
        'initiative': initiative.initiative,
        'type': 'Owners',
        'status': initiative.status,
        'parentId': initiative.parentId
      } : 'owner absent';
    }).without('owner absent').value();
  }

  populateOutputKpiData(type) {
    let vm = this,
      kpiData = [];
    _.chain(vm.data).filter(function(d) {
      return _.includes(type, d.type);
    }).pluck('KPI').flatten().map(function(kpi) {
      kpiData.push({
        name: kpi.kpi,
        initiativeId: kpi.initiativeId,
        type: 'Output KPI',
        status: vm.getOutputKpiStatus(kpi)
      });
    }).value();
    return kpiData;
  }

  getOutputKpiStatus(kpi) {
    let status = '';
    if (kpi.targetBenchmarks && kpi.targetBenchmarks.actual) {
      if (kpi.targetBenchmarks.actual >= kpi.targetBenchmarks.lastTarget) {
        status = 'completed';
      } else {
        let completionPercentage = parseFloat(kpi.targetBenchmarks.actual) / parseFloat(kpi.targetBenchmarks.currentTarget) * 100;
        status = completionPercentage < 90 ? 'delayed' : 'on-track';
      }
    } else {
      status = 'unknown';
    }
    return status;
  }

  populateOutcomeKpiData() {
    let vm = this,
      kpiData = [];
    _.chain(vm.data).filter({
      'type': 'Priority'
    }).pluck('KPI').flatten().map(function(kpi) {
      kpiData.push({
        name: kpi.kpi,
        initiativeId: kpi.initiativeId,
        parentKpi: kpi.parentKpi ? kpi.parentKpi : '0',
        type: 'Outcome KPI',
        status: vm.getOutcomeKpiStatus(kpi)
      });
    }).value();
    return kpiData;
  }

  getOutcomeKpiStatus(kpi) {
    let status = '';
    if (kpi.latestMilestone) {
      let completionPercentage = parseFloat(kpi.latestMilestone.actualValue) / parseFloat(kpi.latestMilestone.targetValue) * 100;
      status = completionPercentage < 90 ? 'delayed' : completionPercentage < 100 ? 'on-track' : 'completed';
    }
    status = status ? status : 'unknown';
    return status;
  }

  getResultsFromServer(queryString, checkboxes) {
    let vm = this;
    let deferred = vm.$q.defer();
    let urlParamMapper = {
      'Outcome KPI': 'outcomeKpi',
      'Initiatives/ Sub Initiatives': 'initiative',
      'Output KPI': 'outputKpi',
      'Activities': 'activity',
      'Owners': 'owner'
    };
    let transformedFields = _.map(checkboxes, function(field) {
      urlParamMapper[field] += '=true';
      return urlParamMapper[field];
    });
    let url = 'search?query=' + encodeURIComponent(queryString) + '&&' + encodeURI(transformedFields.join('&&'));
    vm.$http.get(vm.constants.server.url + url).then(function(res) {
      deferred.resolve(res);
    });
    return deferred.promise;
  }

  transformOnlineData(data) {
    let vm = this;
    _.forEach(data['Output KPI'], function(kpi) {
      kpi.status = vm.getOutputKpiStatus(kpi);
    });
    _.forEach(data['Outcome KPI'], function(kpi) {
      kpi.status = vm.getOutcomeKpiStatus(kpi);
    });
    return data;
  }
}
export default SearchAdapter;