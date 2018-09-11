class SyncController {
  constructor(DataService, $rootScope, OfflineService, FormService, UserAdapter, $scope, $translate) {
    'ngInject';

    let vm = this;
    vm.DataService = DataService;
    vm.OfflineService = OfflineService;
    vm.FormService = FormService;
    vm.UserAdapter = UserAdapter;
    vm.rootScope = $rootScope;
    vm.downloadModal = false;
    vm.messageModal = false;
    vm.isOnline = DataService.isOnline();
    vm.translationHolder = ['SYNC.DATA_DOWNLOAD_SUCCESSFUL'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });
    $rootScope.$broadcast('DATA_RECEIVED');
    vm.pendingRequests = vm.OfflineService.getcollection('offline-request');
    $rootScope.$broadcast('HIDE_SPINNER');

    $scope.$on('SYNC_UPDATES', function() {
      vm.pendingRequests = vm.OfflineService.getcollection('offline-request');
    });
  }

  checkUnsynced() {
    let vm = this;
    if (vm.pendingRequests.length > 0) {
      vm.downloadModal = true;
    } else {
      vm.syncFromServer();
    }
  }

  isSyncDataAvailable() {
    let vm = this;
    return vm.OfflineService.isDataSynced() && navigator.onLine;
  }

  syncToServer() {
    let vm = this;
    vm.downloadModal = false;
    vm.DataService.syncData();
  }

  syncFromServer() {
    let vm = this;
    vm.downloadModal = false;
    vm.rootScope.$broadcast('SHOW_SPINNER');
    vm.OfflineService.clearBeforeSync();
    vm.DataService.getAllInitiatives().then(function(res) {
      if(res && res.data.length > 0){
        vm.message = vm.translations['SYNC.DATA_DOWNLOAD_SUCCESSFUL'];
      }else{
        vm.message = vm.translations['SYNC.DATA_DOWNLOAD_UNSUCCESSFUL'];
      }
      vm.messageModal = true;
      vm.rootScope.$broadcast('HIDE_SPINNER');
    });
    vm.FormService.getUserList();
    vm.UserAdapter.getDepartments();
  }
}

export default SyncController;
