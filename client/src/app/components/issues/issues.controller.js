class IssuesController {
  constructor($scope, $routeParams, InitiativeAdapter, DataService, $rootScope, $location, LocalStorage, $translate) {
    'ngInject';

    let initiativeId = $routeParams.initiativeId;
    let vm = this;
    vm.routeParams = $routeParams;
    vm.LocalStorage = LocalStorage;
    vm.location = $location;
    vm.deleteModelIssue = false;
    vm.deleteModelRisk = false;
    vm.statusModel = false;
    vm.DataService = DataService;
    vm.translationHolder = ['FORM.SYNC_THE_REQUEST_ONCE_ONLINE', 'ISSUE.ISSUE_DELETED', 'ISSUE.RISK_DELETED'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });
    let init = function() {
      let userRights = vm.LocalStorage.getUserRights();
      DataService.getSingleInitiative(initiativeId, true).then(function(initiative) {
        vm.initiative = initiative;
        vm.isEditable = userRights.crudArtifacts || userRights.updateAllIssueLogs || initiative.isEditable;
        vm.issues = vm.initiative ? vm.initiative.Issues[0] : '';
        vm.risk = vm.initiative ? vm.initiative.Risk[0] : '';
        vm.showIssueLog = vm.issues ? true : vm.risk ? false : true;
        vm.breadCrumb = InitiativeAdapter.getParentChain(initiativeId, false);
        if (!$scope.$$phase) {
          $scope.$digest();
        }
      }).finally(function() {
        $rootScope.$broadcast('HIDE_SPINNER');
      });
      DataService.getSkeleton(initiativeId).then(function() {
        $rootScope.$broadcast('DATA_RECEIVED');
      });
    };

    init();
  }

  setIssues(keys) {
    let vm = this;
    if (vm.issues.sno || vm.issues.sno === 0) {
      let path = 'artifact3/' + vm.issues.sno,
        snoData = vm.initiative,
        reqObj = {};
      if (snoData.Issues.length > 0) {
        reqObj.sno = snoData.Issues[0].sno;
      }
      _.each(keys, function(key) {
        reqObj[key] = vm.issues[key];
      });
      reqObj.initiativeId = vm.initiative.initiativeId;
      vm.DataService.setData(reqObj, path, snoData).then(function(res) {
        if (res && res.status && res.status.toLowerCase() === 'error') {
          vm.isError = true;
          vm.statusModel = true;
          vm.statusMsg = res.message;
        } else {
          vm.issues = res;
        }
      });
    } else {
      vm.createIssue();
    }
  }

  setRisk(keys) {
    let vm = this;
    if (vm.risk.sno || vm.risk.sno === 0) {
      let path = 'artifact7/' + vm.risk.sno,
        snoData = vm.initiative,
        reqObj = {};

      if (snoData.Risk.length > 0) {
        reqObj.sno = snoData.Risk[0].sno;
      }
      _.each(keys, function(key) {
        reqObj[key] = vm.risk[key];
      });
      reqObj.initiativeId = vm.initiative.initiativeId;
      vm.DataService.setData(reqObj, path, snoData).then(function(res) {
        if (res && res.status && res.status.toLowerCase() === 'error') {
          vm.isError = true;
          vm.statusModel = true;
          vm.statusMsg = res.message;
        } else {
          res.initiativeId = res.initiativeId.initiativeId;
          vm.risk = res;
        }
      });
    } else {
      vm.createRisk();
    }
  }

  deleteIssue() {
    let vm = this,
      path = 'artifact3/' + vm.issues.sno;
    vm.DataService.deleteData(path).then(function(res) {
      vm.deleteModel = false;
      vm.statusModel = true;
      if (res && res.isOffline) {
        vm.statusMsg = vm.translations['FORM.SYNC_THE_REQUEST_ONCE_ONLINE'];
      } else if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusModel = true;
        vm.statusMsg = res.message;
      } else {
        vm.statusMsg = vm.translations['ISSUE.ISSUE_DELETED'];
      }
    });
  }

  deleteRisk() {
    let vm = this,
      path = 'artifact7/' + vm.risk.sno;
    vm.DataService.deleteData(path).then(function(res) {
      vm.deleteModel = false;
      vm.statusModel = true;
      if (res && res.isOffline) {
        vm.statusMsg = vm.translations['FORM.SYNC_THE_REQUEST_ONCE_ONLINE'];
      } else if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusModel = true;
        vm.statusMsg = res.message;
      } else {
        vm.statusMsg = vm.translations['ISSUE.RISK_DELETED'];
      }
    });
  }

  createIssue() {
    let vm = this,
      path = 'artifact3',
      reqObj = vm.issues;
    reqObj.initiativeId = vm.initiative.initiativeId;
    vm.DataService.postData(reqObj, path).then(function(res) {
      if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusModel = true;
        vm.statusMsg = res.message;
      } else {
        vm.issues = res;
      }
    });
  }

  createRisk() {
    let vm = this,
      path = 'artifact7',
      reqObj = vm.risk;
    reqObj.initiativeId = vm.initiative.initiativeId;
    vm.DataService.postData(reqObj, path).then(function(res) {
      if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusModel = true;
        vm.statusMsg = res.message;
      } else {
        vm.risk = res;
      }
    });
  }

  backTo() {
    let vm = this;
    vm.location.path('/initiative/' + vm.initiative.parentId);
  }

  setOld(keys, item) {
    let vm = this;
    vm[item] = vm[item] || {};
    _.forEach(keys, function(key) {
      vm['old' + key] = vm[item][key];
    });
  }

  getOld(keys, item) {
    let vm = this;
    _.forEach(keys, function(key) {
      vm[item][key] = vm['old' + key];
    });
  }
}

export default IssuesController;
