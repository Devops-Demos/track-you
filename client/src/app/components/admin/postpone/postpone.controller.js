class PostponeController {
  constructor(InitiativeAdapter, $routeParams, $rootScope, DataService, $timeout, $translate) {
    'ngInject';
    let vm = this;
    vm.InitiativeAdapter = InitiativeAdapter;
    vm.$rootScope = $rootScope;
    vm.initiativeId = Number($routeParams.initiativeId);
    vm.DataService = DataService;
    vm.$timeout = $timeout;
    vm.translationHolder = ['POSTPONE.SOME_ERROR', 'POSTPONE.PROBLEM_LOADING_INITIATIVES', 'STATUS.INITIATIVE_ARTIFACTS_POSTPONED'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });
    DataService.getSkeleton(vm.initiativeId).then(function() {
      $rootScope.$broadcast('DATA_RECEIVED');
    });
    vm.init();
  }

  init() {
    let vm = this;
    vm.daysToBeShifted = 0;
    vm.dateFromShift = new Date();
    vm.transformInitiatives();
    vm.initiativeData = [];
    vm.spinnerVisibility = false;
    vm.modalVisibility = false;
  }

  submitForm() {
    let vm = this;
    vm.spinnerVisibility = true;
    if (navigator.onLine && vm.isFormValid()) {
      let selectedDate = (vm.dateFromShift.getMonth() + 1) + '/' + vm.dateFromShift.getDate() +
        '/' + vm.dateFromShift.getFullYear();
      let selectedInitiatives = _.chain(vm.initiativeData).filter({
        'isSelected': true
      }).pluck('initiativeId').value();
      let postObj = {
        'initiativeIds': selectedInitiatives,
        'days': vm.daysToBeShifted,
        'afterDate': selectedDate
      };
      vm.DataService.postData(postObj, 'initiative/postpone').then(function(res) {
        if (res && res.status === 'ok') {
          vm.showStatusTimeout(vm.translations[res.message]);
          vm.$rootScope.$broadcast('SHOW_SPINNER');
          vm.init();
        } else {
          vm.showStatusTimeout(vm.translations['POSTPONE.SOME_ERROR']);
        }
      });
    }
  }

  showStatusTimeout(status) {
    let vm = this;
    vm.spinnerVisibility = true;
    vm.statusText = status;
    vm.modalVisibility = false;
    vm.$timeout(function() {
      vm.statusText = '';
    }, 3000);
  }

  transformInitiatives() {
    let vm = this;
    vm.DataService.getInitiativeTree(vm.initiativeId).then(function(res) {
      if (res.length > 0) {
        _.map(res, function(initiativeDetails) {
          vm.initiativeData.push({
            initiative: initiativeDetails.initiative,
            isSelected: false,
            initiativeId: initiativeDetails.initiativeId
          });
        });
      } else {
        vm.showStatusTimeout(vm.translations['POSTPONE.PROBLEM_LOADING_INITIATIVES']);
      }
    }).finally(function() {
      vm.$rootScope.$broadcast('HIDE_SPINNER');
    });
  }

  isFormValid() {
    return (_.chain(this.initiativeData).filter({
        'isSelected': true
      }).pluck('initiative').value().length > 0 &&
      this.daysToBeShifted > 0);
  }
}
export default PostponeController;
