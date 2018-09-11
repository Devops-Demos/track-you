class UserAdapter {
  constructor($http, $q, pushAppConstants, DataService, OfflineService) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.constants = pushAppConstants;
    this.DataService = DataService;
    this.OfflineService = OfflineService;
  }

  listUsers() {
    let deferred = this.$q.defer(),
      vm = this;

    vm.$http.get(vm.constants.server.url + 'user').then(function(response) {
      let users = response.data;
      _.map(users, function(user) {
        delete user.updatedAt;
        delete user.createdAt;
        delete user.isPasswordReset;
        return user;
      }, function(err) {
        deferred.reject(err);
      });
      deferred.resolve(users);
    });
    return deferred.promise;
  }

  getDepartments() {
    let vm = this,
      deferred = this.$q.defer();
    if (vm.DataService.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'metadata').then(function(response) {
        if (response) {
          vm.OfflineService.upsert('dept-list', response.data);
        }
        deferred.resolve(response.data.departments);
      }, function(err) {
        deferred.reject(err);
      });
    } else {
      let deptList = vm.OfflineService.getcollection('dept-list');
      deptList = deptList[0].departments;
      deferred.resolve(deptList);
    }
    return deferred.promise;
  }

  deleteUser(userId) {
    let vm = this,
      deferred = vm.$q.defer();

    vm.DataService.deleteData('user/' + userId).then(function(response) {
      deferred.resolve(response);
    }, function(error) {
      deferred.reject(error);
    });
    return deferred.promise;
  }

  getUserRights() {
    let vm = this,
      deferred = this.$q.defer();
    vm.$http.get('assets/fixtures/rights.json').then(function(res) {
      deferred.resolve(res.data);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }

  updateUser(userId, data) {
    let vm = this;
    let deferred = vm.$q.defer();
    vm.DataService.setData(data, 'user/' + userId).then(function(response) {
      deferred.resolve(response);
    }, function(err) {
      deferred.reject(err);
    });
    return deferred.promise;
  }
}

export default UserAdapter;