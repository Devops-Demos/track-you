class NoSupportController {
  constructor(MainAdapter, $location, $rootScope) {
    'ngInject';

    if (MainAdapter.isIE() || !MainAdapter.isStorageSupported()) {
      $rootScope.$broadcast('HIDE_SPINNER');
    } else {
      $location.path('/login');
    }
  }
}

export default NoSupportController;
