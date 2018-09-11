class InitiativeFormController {
  constructor(FormService, $routeParams, DataService, $rootScope, UserAdapter, LocalStorage, $location, $translate) {
    'ngInject';

    let vm = this;
    let userRights = LocalStorage.getUserRights();
    if (!userRights.crudArtifacts) {
      $location.path('/landing');
    }
    vm.userList = [];
    vm.btnSpinner = false;
    vm.DataService = DataService;
    vm.evidenceObj = {
      title: null,
      link: null,
      type: 'add'
    };
    vm.totalEvidences = [angular.copy(vm.evidenceObj)];
    vm.translationHolder = ['PRIORITY', 'INITIATIVE', 'FORM.ADD_INITIATIVE', 'FORM.ADD_PRIORITY', 'FORM.SAVE_INITIATIVE',
      'FORM.SAVE_PRIORITY', 'FORM.SYNC_THE_REQUEST_ONCE_ONLINE', 'FORM.SOMETHING_WENT_WRONG', 'FORM.ADDED_SUCCESSFULLY',
      'FORM.DELETED_SUCCESSFULLY', 'FORM.UPDATED_SUCCESSFULLY', 'FORM.SELECT_ALL', 'FORM.SELECT_NONE',
      'ADMIN.RESET', 'SEARCH.ENTER_SEARCH_QUERY', 'FORM.NOTHING_SELECTED'
    ];
    UserAdapter.getDepartments().then(function(dept) {
      vm.deptList = _.sortBy(dept, function(department) {
        return department.toLowerCase();
      });
    });

    let init = function() {
      let initiativeId = !!$routeParams.initiativeId ? $routeParams.initiativeId : 0;
      DataService.getSkeleton(initiativeId).then(function() {
        $rootScope.$broadcast('DATA_RECEIVED');
      });
      if ($routeParams.formStatus === 'new') {
        vm.buttonName = ($routeParams.priority === 'priority') ? vm.translations['FORM.ADD_PRIORITY'] : vm.translations['FORM.ADD_INITIATIVE'];
        DataService.getSingleInitiative(initiativeId, true).then(function(parent) {
          vm.parent = parent;
          vm.parentName = vm.parent ? vm.parent.initiative : '';
          vm.totalEvidences = [];
        }).finally(function() {
          $rootScope.$broadcast('HIDE_SPINNER');
        });

      } else if ($routeParams.formStatus === 'edit') {
        vm.buttonName = ($routeParams.priority === 'priority') ? vm.translations['FORM.SAVE_PRIORITY'] : vm.translations['FORM.SAVE_INITIATIVE'];
        vm.deleteCheck = true;
        DataService.getSingleInitiative(initiativeId, true).then(function(current) {
          if (current) {
            vm.current = current;
            DataService.getSingleInitiative(vm.current.parentId, true).then(function(parent) {
              vm.parent = parent;
              vm.parentName = vm.parent ? vm.parent.initiative : '';
            });
            vm.initiative = vm.current.initiative;
            vm.originalParticipants = _.pluck(current.participants, 'id');
            _.map(vm.participantList, function(participant) {
              participant.ticked = _.indexOf(vm.originalParticipants, participant.id) > -1 ? true : false;
            });
            if(current.evidence.length === 0) {
              vm.totalEvidences = [];
            }
            else {
              vm.totalEvidences = (current.evidence).reverse();
            } 
            if (vm.current.owner) {
              vm.selectedDept = vm.current.owner.department;
              vm.selectedUserList = vm.getSelectedUserList(vm.current.owner.department);
              let userIndex;
              _.find(vm.selectedUserList, function(value, key) {
                if (value.id === vm.current.owner.id) {
                  userIndex = key;
                }
              });
              vm.selectedUser = vm.selectedUserList[userIndex];
            }
          }
        }).finally(function() {
          $rootScope.$broadcast('HIDE_SPINNER');
        });
      }
    };

    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
      vm.localLang = {
        selectAll: vm.translations['FORM.SELECT_ALL'],
        selectNone: vm.translations['FORM.SELECT_NONE'],
        reset: vm.translations['ADMIN.RESET'],
        search: vm.translations['SEARCH.ENTER_SEARCH_QUERY'],
        nothingSelected: vm.translations['FORM.NOTHING_SELECTED']
      };
      vm.selectedDept = vm.translations['FORM.SELECT_NONE'];
      vm.initiativeLabel = ($routeParams.priority === 'priority') ? vm.translations.PRIORITY : vm.translations.INITIATIVE;
      FormService.getUserList().then(function(users) {
        vm.userList = _.map(users, function(user) {
          user.listLabel = user.name + ' = ' + user.email;
          return user;
        });
        vm.selectedUserList = _.sortBy(vm.userList, function(user) {
          return user.name.toLowerCase();
        });
        vm.participantList = _.map(users, function(user) {
          user.info = user.name + ' = ' + user.email;
          user.ticked = false;
          return user;
        });
        init();
      });
    });

    vm.addInitiative = function() {
      let reqObj = {},
      selectedParticipantIds = _.pluck(vm.selectedParticipants, 'id');
      reqObj.type = $routeParams.priority === 'priority' ? 'Priority' : 'Initiative';
      reqObj.initiative = vm.initiative;
      reqObj.owner = vm.selectedUser ? vm.selectedUser.id : '';
      reqObj.dept = vm.selectedDept;
      reqObj.evidence =[];

      vm.btnSpinner = true;
      if ($routeParams.formStatus === 'new') {
        reqObj.participants = selectedParticipantIds;
        reqObj.parentId = vm.parent ? vm.parent.initiativeId : '';
        reqObj.evidence = _.chain(angular.copy(vm.totalEvidences)).forEach(function(evidence) {
          evidence.title = evidence.title;
          evidence.link = evidence.link;
          evidence.type = evidence.type;
        }).value();
        DataService.postData(reqObj, 'initiative').then(function(res) {
          vm.afterRequest(res, 'add');
        });
      } else if ($routeParams.formStatus === 'edit') {
        reqObj.participants = FormService.createEditParticipantsList(selectedParticipantIds, vm.originalParticipants);
        reqObj.parentId = vm.current ? vm.current.parentId : '';
        reqObj.evidence = _.chain(angular.copy(vm.totalEvidences)).forEach(function(evidence) {
          evidence.title = evidence.title;
          evidence.link = evidence.link;
          evidence.type = evidence.type;
        }).value();
        DataService.setData(reqObj, 'initiative/' + vm.current.initiativeId).then(function(res) {
          vm.afterRequest(res, 'edit');
        });
      }
    };

    vm.afterRequest = function(res, type) {
      if (res && res.isOffline) {
        vm.statusMsg = vm.translations['FORM.SYNC_THE_REQUEST_ONCE_ONLINE'];
      } else if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusMsg = vm.translations['FORM.SOMETHING_WENT_WRONG'];
      } else {
        let msg = {
          'add': res ? vm.initiativeLabel + ' ' + vm.translations['FORM.ADDED_SUCCESSFULLY'] : vm.translations['FORM.SOMETHING_WENT_WRONG'],
          'edit': res ? vm.initiativeLabel + ' ' + vm.translations['FORM.UPDATED_SUCCESSFULLY'] : vm.translations['FORM.SOMETHING_WENT_WRONG'],
          'delete': res ? vm.initiativeLabel + ' ' + vm.translations['FORM.DELETED_SUCCESSFULLY'] : vm.translations['FORM.SOMETHING_WENT_WRONG']
        };
        vm.statusMsg = msg[type];
      }
      vm.deleteModel = false;
      vm.statusModel = true;
      vm.btnSpinner = false;
    };

    vm.addEvidence = function() {
     vm.totalEvidences.unshift(angular.copy(vm.evidenceObj));
    };

    vm.deleteEvidence= function(evidence) {
    evidence.type = 'remove';
    };

    vm.deleteInitiative = function() {
      vm.btnSpinner = true;
      DataService.deleteData('initiative/' + $routeParams.initiativeId).then(function(res) {
        vm.afterRequest(res, 'delete');
      });
    };

    vm.selectDept = function(dept, user) {
      vm.selectedUserId = false;
      vm.selectedDept = dept ? dept : '';
      vm.selectedUser = user ? user : '';
      if (dept && dept !== vm.translations['FORM.SELECT_NONE']) {
        vm.selectedUserList = vm.getSelectedUserList(dept);
      }
    };

    vm.sortParticipantsList = function() {
      vm.participantList = _.sortBy(vm.participantList, function(participant) {
        return !participant.ticked;
      });
    };

    vm.getSelectedUserList = function(dept) {
      let vm = this;
      return _.chain(vm.userList).filter({
        department: dept
      }).sortBy(function(user) {
        return user.name.toLowerCase();
      }).value();
    };

  }
}

export default InitiativeFormController;
