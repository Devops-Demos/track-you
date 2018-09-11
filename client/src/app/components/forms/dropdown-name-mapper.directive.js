class DropdownNameMapper {
  constructor($translate) {
    'ngInject';

    this.restrict = 'AE';
    this.require = 'ngModel';
    this.link = function(scope, element, attr, ngModel) {
      let translationHolder = ['FORM.DIAL', 'FORM.BIG_NUMBER', 'FORM.SPEEDOMETER', 'FORM.PERCENTAGE', 'FORM.NUMBER'],
        dropdownNames;
      $translate(translationHolder).then(function(translations) {
        dropdownNames = {
          'dial': translations['FORM.DIAL'],
          'bignumber': translations['FORM.BIG_NUMBER'],
          'speedometer': translations['FORM.SPEEDOMETER'],
          'percentage': translations['FORM.PERCENTAGE'],
          'number': translations['FORM.NUMBER']
        };
      });
      ngModel.$formatters.push(function(value) {
        if (value) {
          return dropdownNames ? dropdownNames[value] : '';
        } else {
          return '';
        }
      });

      ngModel.$parsers.push(function(value) {
        let returnValue = '';
        _.mapKeys(dropdownNames, function(dropdownValue, dropdownKey) {
          if (dropdownValue === value) {
            returnValue = dropdownKey;
          }
        });
        return returnValue;
      });
    };
  }
}

export default DropdownNameMapper;
