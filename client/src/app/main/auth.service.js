class AuthService {
  constructor($location, $q, DataService, $http, pushAppConstants, OfflineService, LocalStorage, $translate) {
    'ngInject';
    let vm = this;
    this.$location = $location;
    this.$q = $q;
    this.DataService = DataService;
    this.OfflineService = OfflineService;
    this.$http = $http;
    this.constants = pushAppConstants;
    this.LocalStorage = LocalStorage;
    vm.translationHolder = ['MAIN.TRY_AGAIN', 'MAIN.NEW_PASSWORD_SENT', 'MAIN.PASSWORD_RESET_UNSUCCESSFUL', 'STATUS.INCORRECT_EMAIL_PASSWORD', 'STATUS.LOGGED_IN_SUCCESSFULLY'];
    $translate(vm.translationHolder).then(function (translations) {
      vm.translations = translations;
    });
  }

  username() {
    return this.LocalStorage.getUserName();
  }

  isLoggedIn() {
    let vm = this;
    return (!_.isEmpty(vm.LocalStorage.getUser()) && !!!localStorage.getItem('forced'));
  }

  login(email, password) {
    let deferred = this.$q.defer(),
      vm = this;
    vm.DataService.clearMemory();
    vm.DataService.postData({
      email: email,
      password: password
    }, 'login').then(function (response) {
      if (response.user === false) {
        deferred.resolve({
          success: false,
          message: vm.translations[response.message]
        });
      } else {
        if (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).email !== email) {
          vm.OfflineService.clearLocalData();
        }
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.removeItem('forced');
        vm.LocalStorage.init(response);
        deferred.resolve({
          success: true,
          isPasswordReset: response.isPasswordReset
        });
      }
    }, function () {
      deferred.resolve({
        success: false,
        message: vm.translations['MAIN.TRY_AGAIN']
      });
    });
    return deferred.promise;
  }

  logout() {
    let vm = this;
    let deferred = vm.$q.defer();
    if (navigator.onLine) {
      vm.$http.get(vm.constants.server.url + 'logout').then(function () {
        localStorage.removeItem('user');
        vm.LocalStorage.clearData();
        vm.OfflineService.clearLocalData();
        vm.DataService.clearMemory();
        deferred.resolve(true);
      });
    } else {
      localStorage.removeItem('user');
      vm.LocalStorage.clearData();
      vm.OfflineService.clearLocalData();
      vm.DataService.clearMemory();
      deferred.resolve(true);
    }
    localStorage.removeItem('csrf');
    return deferred.promise;
  }

  forgotPassword(email) {
    let vm = this,
      deferred = vm.$q.defer(),
      path = 'user/reset';

    vm.DataService.postData({
      email: email
    }, path).then(function (response) {
      if (response.status === 'failed') {
        deferred.resolve({
          success: false,
          message: vm.translations['MAIN.PASSWORD_RESET_UNSUCCESSFUL']
        });
      } else {
        deferred.resolve({
          success: true,
          message: vm.translations['MAIN.NEW_PASSWORD_SENT']
        });
      }
    }, function () {
      deferred.resolve({
        success: false,
        message: vm.translations['MAIN.PASSWORD_RESET_UNSUCCESSFUL']
      });
    });
    return deferred.promise;
  }

  changePassword(newPassword) {
    let vm = this,
      deferred = vm.$q.defer(),
      path = 'user/change-password';

    vm.DataService.postData({
      password: newPassword,
      isPasswordReset: false
    }, path).then(function (response) {
      deferred.resolve(response);
    });
    return deferred.promise;
  }
}

export default AuthService;
