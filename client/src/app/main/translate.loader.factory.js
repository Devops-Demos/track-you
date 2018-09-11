class TranslateLoader {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    return function(options) {
      var deferred = $q.defer();

      $http.get('assets/fixtures/lang/' + options.key + '/keys.json').then(function(response) {
        return deferred.resolve(response.data);
      });

      return deferred.promise;
    };
  }

}

export default TranslateLoader;