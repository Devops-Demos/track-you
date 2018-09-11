class SummaryController {
  constructor($routeParams, DataService, MainAdapter, $rootScope) {
    'ngInject';
    let vm = this;
    vm.MainAdapter = MainAdapter;
    vm.$routeParams = $routeParams;
    vm.DataService = DataService;
    vm.isProgressEditable = {
      sector: false,
      decisions: false,
      issues: false,
      accomplishments: false
    };

    let initiativeId = $routeParams.initiativeId ? $routeParams.initiativeId : 0;
    vm.initiativeId = initiativeId;
    let populateSummary = function(summary) {
      if (summary) {
        vm.lastUpdatedOn = MainAdapter.convertDate(summary.updatedAt);
        vm.sectorSummary = summary.sectorSummary;
        vm.decisionsRequired = summary.decisionsRequired;
        vm.majorIssues = summary.majorIssues;
        vm.proposedSolution = summary.proposedSolution;
        vm.plannedActivities = summary.plannedActivities;
        vm.accomplishments = summary.accomplishments;
      }
    };

    vm.viewSummary = function(summary){
      if(summary){
        vm.progressData = !!vm.summary.keyPerformanceDrivers ? vm.summary.keyPerformanceDrivers.split('\n\n') : [];
        vm.majorData = !!vm.summary.majorIssues ? vm.summary.majorIssues.split('\n\n') : [];
        vm.proposedData = !!vm.summary.proposedSolution ? vm.summary.proposedSolution.split('\n\n') : [];
        vm.decisionsData = !!vm.summary.decisionsRequired ? vm.summary.decisionsRequired.split('\n\n') : [];
        vm.accomplishmentData = !!vm.summary.accomplishments ? vm.summary.accomplishments.split('\n\n') : [];
        vm.plannedData = !!vm.summary.plannedActivities ? vm.summary.plannedActivities.split('\n\n') : [];
        vm.sectorData = !!vm.summary.sectorSummary ? vm.summary.sectorSummary.split('\n\n') : [];
      }
    };

    DataService.getSummary(initiativeId).then(function(summary) {
      if (summary) {
        vm.summary = summary;
        vm.initiative = summary.initiativeId;
        populateSummary(vm.summary);
        vm.viewSummary(vm.summary);
      }
    }).finally(function() {
      $rootScope.$broadcast('HIDE_SPINNER');
    });
    DataService.getSkeleton(initiativeId).then(function() {
      $rootScope.$broadcast('DATA_RECEIVED');
    });
  }

  setSummary(keys) {
    let initiativeId = this.$routeParams.initiativeId ? this.$routeParams.initiativeId : 0;
    let vm = this,
      path = 'artifact1/',
      reqObj = {};
    _.each(keys, function(key) {
      reqObj[key] = vm.summary[key];
      vm[key] = vm.summary[key];
    });
    vm.viewSummary(vm.summary);
    if (!_.isUndefined(vm.summary.sno) && !_.isNull(vm.summary.sno)) {
      reqObj.sno = vm.summary.sno;
      path += vm.summary.sno;
      vm.DataService.setData(reqObj, path).then();
    } else {
      reqObj.initiativeId = initiativeId;
      vm.DataService.postData(reqObj, path).then(function(res){
        vm.summary.sno = res.sno;
      });
    }
  }

  setOldSummary() {
    let vm = this;
    vm.summary = vm.summary || {};
    vm.oldKeyPerformanceDrivers = vm.summary.keyPerformanceDrivers;
    vm.oldSectorReformActivities = vm.summary.sectorReformActivities;
  }

  getOldSummary() {
    let vm = this;
    vm.summary.keyPerformanceDrivers = vm.oldKeyPerformanceDrivers;
    vm.summary.sectorReformActivities = vm.oldSectorReformActivities;
  }

}

export default SummaryController;
