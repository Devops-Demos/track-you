function runBlock($http) {
  'ngInject';
  $http.defaults.withCredentials = true;
}

export default runBlock;