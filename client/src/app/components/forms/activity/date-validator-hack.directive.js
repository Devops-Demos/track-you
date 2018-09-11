class DateValidatorHack {
  constructor() {
    'ngInject';

    this.restrict = 'AE';
    this.require = 'ngModel';
    this.link = function(scope, element, attrs, ngModel) {
      $(element).on('keyup', function() {
        if (!ngModel.$modelValue) {
          ngModel.$setValidity('date', true);
        }
      });
    };
  }
}

export default DateValidatorHack;