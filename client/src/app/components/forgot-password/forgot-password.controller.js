class ForgotPasswordController {
  constructor(AuthService, $location, $rootScope) {
    'ngInject';
    let vm = this;
    vm.$location = $location;
    vm.AuthService = AuthService;
    if (AuthService.isLoggedIn()) {
      $location.path('/');
    }
    $rootScope.$broadcast('HIDE_SPINNER');
  }

  forgotNotification(username) {
    let vm = this;
    vm.errorMessage = '';
    vm.successMessage = '';
    vm.AuthService.forgotPassword(username).then(function(response) {
      if (response.success) {
        vm.successMessage = response.message;
      } else {
        vm.errorMessage = response.message;
      }
    });
  }
}

export default ForgotPasswordController;
