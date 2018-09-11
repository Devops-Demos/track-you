class DisableControl {
  constructor() {
    'ngInject';

    this.restrict = 'AE';
    this.scope = {
      disableControl: '='
    };
    this.link = function(scope, element) {
      if (scope.disableControl) {
        element.addClass('disable-control');
      } else {
        element.removeClass('disable-control');
      }
    };
  }
}

export default DisableControl;