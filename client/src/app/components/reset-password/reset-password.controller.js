class ResetPasswordController {
  constructor(AuthService, $location, LocalStorage, $rootScope, $translate) {
    'ngInject';
    let vm = this;
    vm.$location = $location;
    vm.AuthService = AuthService;
    vm.errorMessage = '';
    vm.LocalStorage = LocalStorage;
    vm.spinner = {
      isVisibile: false
    };
    vm.changePasswordEnabled = false;
    vm.translationHolder = ['RESET_PASSWORD.PASSWORD_REQUIREMENT', 'RESET_PASSWORD.PASSWORDS_DONT_MATCH'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });
    $rootScope.$broadcast('DATA_RECEIVED');
    $rootScope.$broadcast('HIDE_SPINNER');
  }

  passwordMatch() {
    let vm = this;
    if (vm.confirmNewPassword !== vm.newPassword) {
      vm.changePasswordEnabled = false;
      vm.errorMessage = vm.translations['RESET_PASSWORD.PASSWORDS_DONT_MATCH'];
      if (!vm.confirmNewPassword) {
        vm.errorMessage = '';
      }
    } else if (vm.newPassword && vm.confirmNewPassword) {
      vm.changePasswordEnabled = true;
      vm.errorMessage = '';
    } else {
      vm.changePasswordEnabled = false;
    }

  }

  changePassword() {
    let vm = this;
    vm.spinner.isVisibile = true;
    let regexCollection = [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])[a-zA-Z!@#$%^&*()]{8,}$/,
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()])[a-zA-Z!@#$%^&*()\d]{8,}$/, /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[\da-zA-Z!@#$%^&*()]{8,}$/
    ];
    let regexMatchCount = (_.chain(regexCollection).map(function(regex) {
      return vm.newPassword.match(regex);
    }).remove(function(n) {
      return n;
    }).value()).length;
    if (regexMatchCount === 0) {
      vm.errorMessage = vm.translations['RESET_PASSWORD.PASSWORD_REQUIREMENT'];
      vm.spinner.isVisibile = false;
    } else {
      vm.AuthService.changePassword(vm.newPassword).then(function() {
        vm.spinner.isVisibile = false;
        vm.AuthService.logout().then(function() {
          vm.$location.path('/login');
        });
      });
    }
  }
}
export default ResetPasswordController;
