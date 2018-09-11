class Rtl {
  constructor() {
    'ngInject';

    let vm = this;
    vm.restrict = 'AE';
    vm.scope = {
      isRtl: '@',
      rtlClass: '@'
    };

    vm.link = function(scope, element) {
      let draw = function() {
        if (scope.isRtl === 'true') {
          element.addClass('rtl');
          if (scope.rtlClass) {
            element.addClass(scope.rtlClass);
          }
        } else {
          element.removeClass('rtl');
          element.removeClass(scope.rtlClass);
        }
      };
      scope.$watch('isRtl', draw);
    };
  }
}
export default Rtl;