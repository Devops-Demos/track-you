class FormService {
  constructor($http, $q, pushAppConstants, OfflineService, DataService) {
    'ngInject';
    let vm = this;
    this.constants = pushAppConstants;
    vm.OfflineService = OfflineService;
    vm.DataService = DataService;
    vm.$http = $http;
    vm.$q = $q;
  }

  getUserList() {
    let deferred = this.$q.defer(),
      vm = this;
    if (vm.DataService.isOnline()) {
      vm.$http.get(vm.constants.server.url + 'user').then(function(response) {
        vm.userData = response.data;
        if (vm.userData && vm.userData.length > 0) {
          _.each(vm.userData, function(user) {
            vm.OfflineService.upsert('user-list', user, 'id');
          });
        }

        deferred.resolve(vm.userData);
      });
    } else {
      deferred.resolve(vm.OfflineService.getcollection('user-list'));
    }
    return deferred.promise;
  }

  dateFormat(date) {
    let d = new Date(date);
    if (!isNaN(d.getMonth())) {
      return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    } else {
      return '';
    }
  }

  resetDate(date) {
    let d = new Date(date);
    return d;
  }

  getChildKpis(sno) {
    let deferred = this.$q.defer(),
      vm = this;

    if (navigator.onLine) {
      vm.$http.get(vm.constants.server.url + 'artifact2', {
        params: {
          parentKpi: sno
        }
      }).then(function(response) {
        deferred.resolve(response.data);
      });
    } else {
      deferred.resolve(_.filter(vm.DataService.getLocalKPIS(), function(kpi) {
        return kpi.parentKpi === parseInt(sno);
      }));
    }
    return deferred.promise;
  }

  createEditParticipantsList(newList, oldlist){
    let participants = [];
    _.forEach(_.difference(newList, oldlist), function(id){
        participants.push({
          type: 'add',
          id: id
        });
    });
    _.forEach(_.difference(oldlist, newList), function(id){
        participants.push({
          type: 'remove',
          id: id
        });
    });
    return participants;
  }

}

export default FormService;
