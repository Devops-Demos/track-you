class RoundOffInput {
  constructor() {
    'ngInject';

    this.restrict = 'AE';
    this.require = 'ngModel';
    this.link = function(scope, element, attr, ngModel) {
      ngModel.$formatters.push(function(value) {
        if (_.isNull(value)) {
          return value;
        } else {
          return Math.round(value * 100) / 100;
        }
      });

      ngModel.$parsers.push(function(value) {
        if (_.isNull(value)) {
          return value;
        } else {
          return Math.round(value * 100) / 100;
        }
      });
    };
  }
}

export default RoundOffInput;
