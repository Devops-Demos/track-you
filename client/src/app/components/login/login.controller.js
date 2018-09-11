class LoginController {
  constructor(AuthService, $location, $scope, $rootScope, LocalStorage, MainAdapter, $translate) {
    'ngInject';
    let vm = this;
    vm.$location = $location;
    vm.AuthService = AuthService;
    vm.$scope = $scope;
    vm.page = {};
    vm.spinner = {
      isVisibile: false
    };
    if (MainAdapter.isIE() || !MainAdapter.isStorageSupported()) {
      $location.path('/no-support');
    }
    vm.translationHolder = ['ITRACK'];
    $translate(vm.translationHolder).then(function(translations){
      vm.translations = translations;
      vm.page.title = vm.translations.ITRACK;
      vm.page.mobileTitle = [vm.translations.ITRACK];
    });

    $rootScope.$broadcast('DATA_RECEIVED');
    $rootScope.$broadcast('HIDE_SPINNER');

    if (AuthService.isLoggedIn()) {
      $location.path('/');
    }
    let user = LocalStorage.getUser();
    if (user) {
      vm.username = user.email;
    }
  }

  loginAuth(username, password) {
    let vm = this;
    vm.spinner.isVisibile = true;
    if (username && password) {
      vm.errorMessage = '';
      this.AuthService.login(username, password).then(function(response) {
        if (response.success) {
          vm.spinner.isVisibile = false;
          if (response.isPasswordReset) {
            vm.$location.path('/reset-password');
          } else {
            vm.$location.path('/');
          }
          vm.$scope.$broadcast('DATA_RECEIVED');
        } else {
          vm.errorMessage = response.message;
          vm.spinner.isVisibile = false;
        }
      });
    }
  }
}

export default LoginController;
