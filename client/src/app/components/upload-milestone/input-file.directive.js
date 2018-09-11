class InputFile {
  constructor() {
    'ngInject';

    this.restrict = 'AE';
    this.scope = {
      fileread: '='
    };
    this.link = function (scope, element) {
      element.bind("change", function (changeEvent) {
        scope.$apply(function () {
          scope.file = changeEvent.target.files[0];
          scope.fileread = scope.file? scope.file.name : undefined;
        });
      });
    };
  }
}

export default InputFile;
