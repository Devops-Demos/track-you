class DataService {
  constructor($log, $http, $q, pushAppConstants, OfflineService, $rootScope, eachSeries, $timeout) {
    'ngInject';

    let vm = this;
    vm.constants = pushAppConstants;
    vm.$http = $http;
    vm.$q = $q;
    vm.$log = $log;
    vm.OfflineService = OfflineService;
    vm.appConfig = undefined;
    vm.initiatives = undefined;
    vm.kpis = undefined;
    vm.$rootScope = $rootScope;
    vm.requiresSkeleton = true;
    vm.csrfToken = null;
    vm.eachSeries = eachSeries;
    vm.$timeout = $timeout;
  }

  getAppConfig() {
    return this.appConfig;
  }

  isOnline() {
    return navigator.onLine;
  }

  loadAppConfig() {
    let vm = this,
      deferred = this.$q.defer();

    vm.$http.get('assets/fixtures/appConfig.json').then(function(response) {
      vm.appConfig = response.data;
      deferred.resolve(vm.appConfig);
    });
    return deferred.promise;
  }

  getSingleKpi(id) {
    let deferred = this.$q.defer(),
      vm = this;

    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'kpi', {
        params: {
          sno: id
        }
      }).then(function(response) {
        vm.processKPIS([response.data]);
        deferred.resolve(response.data);
      });
    } else {

    }
    return deferred.promise;
  }

  getKpi(id) {
    let deferred = this.$q.defer(),
      vm = this;

    if (!vm.isOnline()) {
      vm.kpis = vm.OfflineService.getcollection('kpi');
    }

    vm.$http.get(vm.constants.server.url + 'current-kpis', {
      params: {
        sno: id
      }
    }).then(function(response) {
      vm.processKPIS(response.data);
      let kpi = _.find(response.data, {
        sno: parseInt(id)
      });
      deferred.resolve(kpi);
    });
    return deferred.promise;
  }

  processKPIS(kpis, saveData) {
    let vm = this;
    vm.kpis = vm.kpis || [];

    if (kpis && kpis.length > 0) {
      _.each(kpis, function(kpi) {
        let localData = _.find(vm.kpis, {
          sno: kpi.sno
        });
        if (saveData) {
          vm.OfflineService.upsert('kpi', angular.copy(kpi), 'sno');
        }
        if (localData) {
          vm.kpis = _.reject(vm.kpis, {
            sno: kpi.sno
          });
          vm.kpis.push(_.extend(localData, kpi));
        } else {
          vm.kpis.push(kpi);
        }
      });
    }
  }

  getKpiChain(ids) {
    let deferred = this.$q.defer(),
      vm = this;
    let promises = [];

    if (ids && ids.length > 0) {
      if (vm.isOnline()) {
        _.each(ids, function(id) {
          promises.push(vm.$http.get(vm.constants.server.url +
            'current-kpis', {
              params: {
                sno: id
              }
            }));
        });
      } else {
        let offlineKpis = vm.OfflineService.getcollection('kpi');
        _.each(ids, function(id) {
          promises.push(offlineKpis, {
            params: {
              sno: id
            }
          });
        });
      }
      vm.$q.all(promises).then(function(response) {
        vm.processKPIS(_.pluck(response, 'data')[0]);
        deferred.resolve(_.pluck(response, 'data')[0]);
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  setSkeleton(status) {
    this.requiresSkeleton = status;
  }

  getSkeleton(initiativeId) {
    let deferred = this.$q.defer(),
      vm = this;
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'skeleton', {
        params: {
          initiativeId: initiativeId
        }
      }).then(function(response) {
        if (response.data && response.data.status !== 'error') {
          vm.processInitiatives(response.data, false);
          deferred.resolve();
        } else {
          deferred.reject();
        }
      });
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  getCompleteInitiatives(initiatives) {
    let vm = this;

    let isLocalInitiativeOutdated = function(localInitiative, initiative) {
      return new Date(localInitiative.artifactsUpdatedAt) < new Date(initiative.artifactsUpdatedAt) || new Date(
        localInitiative.updatedAt) < new Date(initiative.updatedAt);
    };

    let isInitiativeComplete = function(initiative) {
      return !!initiative.KpiAchievementToTarget;
    };

    let serverInitiatives = [];

    _.each(initiatives, function(initiative) {
      var localInitiative = _.find(vm.initiatives, function(localInitiative) {
        return initiative.initiativeId === localInitiative.initiativeId;
      });
      if (localInitiative && !isLocalInitiativeOutdated(localInitiative, initiative) && isInitiativeComplete(
          localInitiative) && localInitiative.type.toLowerCase() !== 'activity') {
        vm.$timeout(function() {
          vm.$rootScope.$broadcast('INITIATIVE_RECEIVED', localInitiative);
        }, 1000);
      } else {
        serverInitiatives.push(initiative);
      }
    });

    serverInitiatives = _.chunk(serverInitiatives, 2);
    vm.eachSeries(serverInitiatives, function(initiatives) {
      let promises = [];
      initiatives.forEach(function(initiative) {
        let params = {
          params: {
            initiativeId: initiative.initiativeId,
            removeKpi: initiative.type.toLowerCase() !== 'priority'
          }
        };
        if (initiative.type.toLowerCase() === 'activity') {
          params.params.activity = true;
        }
        promises.push(vm.$http.get(vm.constants.server.url + 'initiative', params));
      });
      return vm.$q.all(promises).then(function(response) {
        response.forEach(function(response) {
          if (response.data && response.data.status !== 'error') {
            vm.processInitiatives([response.data], false);
          }
          vm.$rootScope.$broadcast('INITIATIVE_RECEIVED', response.data);
        });
      });
    });
  }

  getInitiativeTree(initiativeId) {
    let deferred = this.$q.defer(),
      vm = this;
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'initiative-tree', {
        params: {
          initiativeId: initiativeId
        }
      }).then(function(response) {
        if (response.data && response.data.status !== 'error') {
          vm.processInitiatives(response.data, false);
          vm.getCompleteInitiatives(response.data);
          deferred.resolve(response.data);
        } else {
          deferred.reject();
        }
      });
    } else {
      let initiatives = vm.OfflineService.getcollection('initiative');
      vm.initiatives = [];
      let currentInitiative = _.find(initiatives, {
        initiativeId: parseInt(initiativeId)
      });
      if (currentInitiative) {
        do {
          vm.processInitiatives([currentInitiative]);
          currentInitiative = _.find(initiatives, {
            initiativeId: parseInt(currentInitiative.parentId)
          });
        } while (currentInitiative && currentInitiative.parentId !== -1);
      }
      let currentDisplayedInitiatives = _.filter(initiatives, {
        parentId: parseInt(initiativeId)
      });
      let childInitiatives = _.filter(initiatives, function(initiative) {
        return _.pluck(currentDisplayedInitiatives, 'initiativeId').indexOf(initiative.parentId) > -1;
      });
      vm.processInitiatives(childInitiatives);
      vm.processInitiatives(currentDisplayedInitiatives);
      deferred.resolve();
    }
    return deferred.promise;
  }

  processInitiatives(initiatives, saveData) {
    let vm = this;
    vm.initiatives = vm.initiatives || [];

    if (initiatives && initiatives.length > 0) {
      _.each(initiatives, function(initiative) {
        let localData = _.find(vm.initiatives, {
          initiativeId: initiative.initiativeId
        });
        if (localData) {
          vm.initiatives = _.reject(vm.initiatives, {
            initiativeId: initiative.initiativeId
          });
          if (initiative.KpiAchievementToTarget) {
            vm.initiatives.push(initiative);
          } else {
            // getTree API or ownedInitiatives API which doesn't give the full initiative
            // vm.initiatives.push(_.merge(localData, initiative));
            vm.initiatives.push(localData);
          }
        } else {
          vm.initiatives.push(initiative);
        }
        vm.processKPIS(initiative.KPI, saveData);
        if (saveData) {
          delete initiative.KPI;
          vm.OfflineService.upsert('initiative', angular.copy(initiative), 'initiativeId');
        }
      });
    }
  }

  processOwnedInitiatives(initiatives) {
    let ownedInitiatives = {},
      vm = this;
    ownedInitiatives.id = 1;
    ownedInitiatives.initiativeIds = [];
    _.each(initiatives, function(initiative) {
      ownedInitiatives.initiativeIds.push(initiative.initiativeId);
    });
    vm.OfflineService.upsert('owned-initiative', ownedInitiatives, 'id');
  }

  getOwnedInitiatives() {
    let deferred = this.$q.defer(),
      vm = this;
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'owned-initiatives').then(function(response) {
        if (response.data && response.data.status !== 'error') {
          vm.processInitiatives(response.data, false);
          vm.processOwnedInitiatives(response.data);
          vm.getCompleteInitiatives(response.data);
          deferred.resolve(response.data);
        } else {
          deferred.reject();
        }
      });
    } else {
      let initiatives = vm.OfflineService.getcollection('initiative');
      let ownedInitiatives = vm.OfflineService.getcollection('owned-initiative');
      let filterInitiatives = [];
      _.each(ownedInitiatives[0].initiativeIds, function(id) {
        _.each(initiatives, function(initiative) {
          if (initiative.initiativeId === id) {
            filterInitiatives.push(initiative);
          }
        });
      });
      deferred.resolve(filterInitiatives);
    }
    return deferred.promise;
  }

  getParticipatingInitiatives() {
    let deferred = this.$q.defer(),
      vm = this;
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'participating-initiatives').then(function(response) {
        if (response.data && response.data.status !== 'error') {
          vm.processInitiatives(response.data, false);
          vm.processParticiaptingInitiatives(response.data);
          vm.getCompleteInitiatives(response.data);
          deferred.resolve(response.data);
        } else {
          deferred.reject();
        }
      });
    } else {
      let initiatives = vm.OfflineService.getcollection('initiative');
      let participatingInitiatives = vm.OfflineService.getcollection('participating-initiatives');
      let filterInitiatives = [];
      _.each(participatingInitiatives[0].initiativeIds, function(id) {
        _.each(initiatives, function(initiative) {
          if (initiative.initiativeId === id) {
            filterInitiatives.push(initiative);
          }
        });
      });
      deferred.resolve(filterInitiatives);
    }
    return deferred.promise;
  }

  processParticiaptingInitiatives(initiatives) {
    let participatingInitiatives = {},
      vm = this;
    participatingInitiatives.id = 1;
    participatingInitiatives.initiativeIds = [];
    _.each(initiatives, function(initiative) {
      participatingInitiatives.initiativeIds.push(initiative.initiativeId);
    });
    vm.OfflineService.upsert('participating-initiatives', participatingInitiatives, 'id');
  }

  getInitiatives() {
    let vm = this;
    if (vm.isOnline()) {
      return angular.copy(this.initiatives);
    } else {
      let kpis = vm.OfflineService.getcollection('kpi');
      vm.initiatives = _.map(vm.initiatives, function(initiative) {
        initiative.KPI = _.filter(kpis, function(kpi) {
          return kpi.initiativeId === initiative.initiativeId;
        });
        return initiative;
      });
      return vm.initiatives;
    }
  }

  getLocalKPIS() {
    return angular.copy(this.kpis);
  }

  offlineRequestProcess(data, path, method) {
    let offlineRequest = {},
      vm = this;
    offlineRequest.data = data;
    offlineRequest.path = path;
    offlineRequest.method = method;
    vm.OfflineService.createOffline(offlineRequest);
  }

  setData(data, path) {
    let deferred = this.$q.defer(),
      vm = this;

    if (vm.isOnline()) {
      let headers = {
        'Content-Type': 'application/json'
      };
      if (vm.constants.csrf) {
        headers['x-csrf-token'] = localStorage.getItem('csrf');
      }
      vm.$http({
        method: 'PUT',
        url: vm.constants.server.url + path,
        data: data,
        headers: headers
      }).then(function(response) {
        deferred.resolve(response.data);
      });
    } else {
      vm.offlineRequestProcess(data, path, 'PUT');
      let offineRes = {};
      offineRes.isOffline = true;
      deferred.resolve(offineRes);
    }
    return deferred.promise;
  }

  afterDelete(path) {
    let vm = this,
      deletePath = path.split('/'),
      id = parseInt(deletePath[1]),
      type = deletePath[0],
      collectionMapping = {
        'initiative': 'initiative',
        'kpi': 'kpi'
      },
      idColumnMapping = {
        'initiative': 'initiativeId',
        'kpi': 'sno'
      },
      idColumn = idColumnMapping[type],
      collectionName = collectionMapping[type],
      deleteObj = {};
    deleteObj[idColumn] = id;
    if (type === 'kpi') {
      let kpi = _.find(vm.kpis, {
        sno: id
      });
      let initiative = _.find(vm.initiatives, {
        initiativeId: kpi.initiativeId
      });
      initiative.KPI = _.reject(initiative.KPI, {
        sno: id
      });
      vm.kpis = _.reject(vm.kpis, deleteObj);
    } else if (type === 'initiative') {
      vm.initiatives = _.reject(vm.initiatives, deleteObj);
    }
    vm.OfflineService.remove(collectionName, idColumn, id);
  }

  deleteData(path) {
    let vm = this,
      deferred = vm.$q.defer(),
      deletePath = path.split('/'),
      type = deletePath[0];

    if (vm.isOnline()) {
      let headers = {
        'Content-Type': 'application/json'
      };
      if (vm.constants.csrf) {
        headers['x-csrf-token'] = localStorage.getItem('csrf');
      }
      vm.$http({
        method: 'DELETE',
        url: vm.constants.server.url + path,
        headers: headers
      }).then(function(response) {
        if (response.data.deletedIds) {
          if (response.data.deletedIds.length > 0) {
            _.each(response.data.deletedIds, function(id) {
              vm.afterDelete(type + '/' + id);
            });
          }
        }
        deferred.resolve(response.data);
      });
    } else {
      vm.offlineRequestProcess(0, path, 'DELETE');
      vm.afterDelete(path);
      let offineRes = {};
      offineRes.isOffline = true;
      deferred.resolve(offineRes);
    }
    return deferred.promise;
  }

  postData(data, path, contentType) {
    let vm = this,
      deferred = vm.$q.defer();
    let makeRequest = function(sendCsrf) {
      let headers = {
        'Content-Type': 'application/json'
      };
      if (contentType === 'form-data') {
        headers['Content-Type'] = undefined;
      }
      if (sendCsrf) {
        headers['x-csrf-token'] = localStorage.getItem('csrf');
      }
      vm.$http({
        method: 'POST',
        url: vm.constants.server.url + path,
        data: data,
        headers: headers
      }).then(function(response) {
        if (vm.constants.csrf && path === 'login') {
          vm.$http.get(vm.constants.server.url + 'csrfToken').success(
            function(csrfResponse) {
              localStorage.setItem('csrf', csrfResponse._csrf);
              deferred.resolve(response.data);
            });
        } else {
          deferred.resolve(response.data);
        }
      });
    };

    if (vm.isOnline()) {
      if ((vm.constants.csrf && path === 'login') || (vm.constants.csrf &&
          path === 'user/reset')) {
        vm.$http.get(vm.constants.server.url + 'csrfToken').success(function(
          csrfResponse) {
          localStorage.setItem('csrf', csrfResponse._csrf);
          makeRequest(true);
        });
      } else if (vm.constants.csrf) {
        makeRequest(true);
      } else {
        makeRequest();
      }
    } else if (path !== 'login') {
      vm.offlineRequestProcess(data, path, 'POST');
      let offineRes = {};
      offineRes.isOffline = true;
      deferred.resolve(offineRes);
    }
    return deferred.promise;
  }

  syncData() {
    let vm = this;
    _.each(vm.OfflineService.getcollection('offline-request'), function(
      offlinereq) {
      let reqObj = {};
      reqObj.method = offlinereq.method;
      reqObj.url = vm.constants.server.url + offlinereq.path;
      if (offlinereq.data) {
        reqObj.data = offlinereq.data;
      }
      reqObj.headers = {
        'Content-Type': 'application/json'
      };

      if (vm.constants.csrf) {
        reqObj.headers['x-csrf-token'] = localStorage.getItem('csrf');
      }

      vm.$http(reqObj).then(function(response) {
        if (response) {
          if (offlinereq.method === 'DELETE') {
            vm.afterDelete(offlinereq.path);
          }
          vm.OfflineService.removeObj(offlinereq);
          vm.$rootScope.$broadcast('SYNC_UPDATES');
        }
      });
    });
  }

  getAllInitiatives() {
    let vm = this,
      deferred = vm.$q.defer();
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'allInitiatives').then(function(response) {
        if (response && response.data.length > 0) {
          vm.processInitiatives(response.data, true);
        }
        deferred.resolve(response);
      });
    }
    return deferred.promise;
  }

  clearMemory() {
    let vm = this;
    vm.initiatives = null;
    vm.kpis = null;
  }

  getSummary(initiativeId) {
    let vm = this;
    let deferred = vm.$q.defer();
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'summary?initiativeId=' +
        initiativeId).then(function(response) {
        deferred.resolve(response.data);
      });
    } else {
      let initiatives = vm.OfflineService.getcollection('initiative');
      let initiative = _.find(initiatives, function(initiative) {
        return initiative.initiativeId === parseInt(initiativeId);
      });
      deferred.resolve(initiative['Executive Summary'][0]);
    }
    return deferred.promise;
  }

  getSingleInitiative(initiativeId, removeKpi, allMilestones) {
    let vm = this,
      deferred = vm.$q.defer();

    if (_.isUndefined(removeKpi)) {
      removeKpi = false;
    }
    if (_.isUndefined(allMilestones)) {
      allMilestones = false;
    }
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'initiative', {
        params: {
          initiativeId: initiativeId,
          removeKpi: removeKpi,
          allMilestones: allMilestones
        }
      }).then(function(response) {
        if (response.data && response.data.status !== 'error') {
          vm.processInitiatives([response.data], false);
          deferred.resolve(response.data);
        } else {
          deferred.reject();
        }
      });
    } else {
      initiativeId = parseInt(initiativeId);
      deferred.resolve(_.find(vm.OfflineService.getcollection('initiative'), {
        initiativeId: initiativeId
      }));
    }
    return deferred.promise;
  }

  getCurrentVersion() {
    let vm = this;
    let deferred = vm.$q.defer();
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'current-version').then(function(
        response) {
        deferred.resolve(response.data);
      });
    } else {
      deferred.reject();
    }
    return deferred.promise;
  }

  getLinkKpis(initiativeId) {
    let vm = this,
      deferred = vm.$q.defer();
    if (vm.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'linkkpilist', {
        params: {
          initiativeId: initiativeId
        }
      }).then(function(response) {
        deferred.resolve(response.data);
      });
    } else {
      let kpis = _.where(vm.OfflineService.getcollection('kpi'), {
        'initiativeId': initiativeId
      });
      deferred.resolve(kpis);
    }
    return deferred.promise;
  }
}

export default DataService;
