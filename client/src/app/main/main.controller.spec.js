(function() {
  'use strict';

  describe('controllers', function(){

    beforeEach(module('pushApp'));

    it('should have atleast one priority', inject(function($controller) {
      var vm = $controller('MainController');

      expect(angular.isArray(vm.priorities)).toBeTruthy();
      expect(vm.priorities.length > 1).toBeTruthy();
    }));
  });
})();
