class ActivityFormController {
  constructor(DataService, MainAdapter, $routeParams, FormService, $rootScope, $location, UserAdapter, LocalStorage, $translate) {
    'ngInject';

    let vm = this;
    vm.MainAdapter = MainAdapter;
    vm.FormService = FormService;
    vm.DataService = DataService;
    vm.UserAdapter = UserAdapter;
    vm.initiativeID = $routeParams.initiativeId;
    vm.formStatus = $routeParams.formStatus;
    vm.LocalStorage = LocalStorage;
    vm.location = $location;
    vm.rootScope = $rootScope;
    vm.participantList = [];
    vm.evidenceObj = {
      title: null,
      link: null,
      type: 'add'
    };
    vm.totalEvidences = [angular.copy(vm.evidenceObj)];
    vm.translationHolder = ['FORM.ACTIVITY_SUCCESSFULLY_ADDED', 'FORM.ACTIVITY_SUCCESSFULLY_DELETED', 'FORM.ACTIVITY_SUCCESSFULLY_UPDATED', 'FORM.SYNC_THE_REQUEST_ONCE_ONLINE', 'FORM.SOMETHING_WENT_WRONG', 'FORM.SELECT_ALL', 'FORM.SELECT_NONE',
      'ADMIN.RESET', 'SEARCH.ENTER_SEARCH_QUERY', 'FORM.NOTHING_SELECTED'
    ];
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
      vm.populateDeptData();
      vm.init();
    });
  }

  init() {
    let vm = this;
    let userRights = vm.LocalStorage.getUserRights();
    vm.btnSpinner = false;
    vm.DataService.getSkeleton(vm.initiativeID).then(function() {
      vm.rootScope.$broadcast('DATA_RECEIVED');
    });
    vm.DataService.getSingleInitiative(vm.initiativeID, true).then(function(initiative) {
      vm.initiative = initiative;
      vm.originalParticipants = _.pluck(initiative.participants, 'id');
      if(initiative.evidence.length === 0) {
        vm.totalEvidences = [];
      }
      else {
        vm.totalEvidences = (initiative.evidence).reverse();
      }
      vm.populateOwnerData();
      if (vm.formStatus === 'new') {
        if (!userRights.crudArtifacts) {
          vm.location.path('/landing');
        }
        vm.addButton = true;
        vm.parentName = vm.initiative ? vm.initiative.initiative : '';
        vm.rootScope.$broadcast('HIDE_SPINNER');
      } else if (vm.formStatus === 'edit') {
        if (!userRights.crudArtifacts && !userRights.updateAllActivities && !vm.initiative.isEditable) {
          vm.location.path('/landing');
        }
        vm.editButton = true;
        vm.DataService.getSingleInitiative(vm.initiative.parentId, true).then(function(parent) {
          vm.parentName = parent ? parent.initiative : '';
        }).finally(function() {
          vm.rootScope.$broadcast('HIDE_SPINNER');
        });
        vm.activity = vm.initiative.initiative;
        vm.plannedStartDate = vm.FormService.resetDate(vm.initiative.plannedStartDate);
        vm.plannedEndDate = vm.FormService.resetDate(vm.initiative.plannedEndDate);
        vm.actualStartDate = vm.initiative.actualStartDate ? vm.FormService.resetDate(vm.initiative.actualStartDate) : null;
        vm.actualEndDate = vm.initiative.actualEndDate ? vm.FormService.resetDate(vm.initiative.actualEndDate) : null;
      }
      vm.populateDeptData();
    }).finally(function() {
      vm.rootScope.$broadcast('HIDE_SPINNER');
    });
  }

  getSelectedUserList(dept) {
    let vm = this;
    return _.chain(vm.userList).filter({
      department: dept
    }).sortBy(function(user) {
      return user.name.toLowerCase();
    }).value();
  }

  populateOwnerData() {
    let vm = this;
    vm.FormService.getUserList().then(function(users) {
      vm.userList = _.map(users, function(user) {
        user.listLabel = user.name + ' = ' + user.email;
        return user;
      });
      vm.participantList = _.map(users, function(user) {
        user.info = user.name + ' = ' + user.email;
        user.ticked = false;
        return user;
      });
      vm.selectedUserList = _.sortBy(vm.userList, function(user) {
        return user.name.toLowerCase();
      });
      if (vm.formStatus === 'edit') {
        _.map(vm.participantList, function(participant) {
          participant.ticked = _.indexOf(vm.originalParticipants, participant.id) > -1 ? true : false;
          return participant;
        });
      }
    }).finally(function() {
      if (vm.initiative.owner && vm.formStatus === 'edit') {
        vm.selectedDept = vm.initiative.owner.department;
        let userIndex;
        vm.selectedUserList = vm.getSelectedUserList(vm.initiative.owner.department);
        _.each(vm.selectedUserList, function(value, key) {
          if (value.id === vm.initiative.owner.id) {
            userIndex = key;
          }
        });
        vm.selectedUser = vm.selectedUserList[userIndex];
      }
    });
  }

  populateDeptData() {
    let vm = this;
    vm.UserAdapter.getDepartments().then(function(dept) {
      vm.deptList = _.sortBy(dept, function(department) {
        return department.toLowerCase();
      });
    });
  }

  setRequestObject(type) {
    let vm = this,
      selectedParticipantIds = _.pluck(vm.selectedParticipants, 'id'),
      reqObj = {};
    reqObj.type = 'activity';
    reqObj.initiative = vm.activity;
    reqObj.evidence =[];
    if (type === 'add') {
      reqObj.participants = selectedParticipantIds;
      reqObj.parentId = vm.initiative ? vm.initiative.initiativeId : '';
    } else if (type === 'edit') {
      reqObj.participants = vm.FormService.createEditParticipantsList(selectedParticipantIds, vm.originalParticipants);
      reqObj.parentId = vm.initiative ? vm.initiative.parentId : '';
    }
    reqObj.dept = vm.selectedDept;
    reqObj.owner = vm.selectedUser ? vm.selectedUser.id : '';
    reqObj.plannedStartDate = vm.MainAdapter.convertDateMmDdYyyy(vm.plannedStartDate);
    reqObj.plannedEndDate = vm.plannedEndDate ? vm.MainAdapter.convertDateMmDdYyyy(vm.plannedEndDate) : '';
    reqObj.actualStartDate = vm.actualStartDate ? vm.MainAdapter.convertDateMmDdYyyy(vm.actualStartDate) : '';
    reqObj.actualEndDate = vm.actualEndDate ? vm.MainAdapter.convertDateMmDdYyyy(vm.actualEndDate) : '';
    reqObj.evidence = _.chain(angular.copy(vm.totalEvidences)).forEach(function(evidence) {
          evidence.title = evidence.title;
          evidence.link = evidence.link;
          evidence.type = evidence.type;
        }).value();
    return reqObj;
  }

  afterRequest(res, type) {
    let vm = this;
    if (res && res.isOffline) {
      vm.statusMsg = vm.translations['FORM.SYNC_THE_REQUEST_ONCE_ONLINE'];
    } else if (res && res.status && res.status.toLowerCase() === 'error') {
      vm.isError = true;
      vm.statusMsg = vm.translations['FORM.SOMETHING_WENT_WRONG'];
    } else {
      let msg = {
        'add': res ? vm.translations['FORM.ACTIVITY_SUCCESSFULLY_ADDED'] : vm.translations['FORM.SOMETHING_WENT_WRONG'],
        'edit': res ? vm.translations['FORM.ACTIVITY_SUCCESSFULLY_UPDATED'] : vm.translations['FORM.SOMETHING_WENT_WRONG'],
        'delete': res ? vm.translations['FORM.ACTIVITY_SUCCESSFULLY_DELETED'] : vm.translations['FORM.SOMETHING_WENT_WRONG']
      };
      vm.statusMsg = msg[type];
    }
    vm.statusModel = true;
    vm.btnSpinner = false;
    vm.deleteModel = false;
  }

  addEvidence() {
    let vm = this;
    vm.totalEvidences.unshift(angular.copy(vm.evidenceObj));
  }

  deleteEvidence(evidence) {
    evidence.type = 'remove';
  }

  addActivity() {
    let vm = this,
      reqObj = vm.setRequestObject('add');
    vm.btnSpinner = true;
    vm.DataService.postData(reqObj, 'initiative').then(function(res) {
      vm.afterRequest(res, 'add');
    });
  }

  editActivity() {
    let vm = this,
      reqObj = vm.setRequestObject('edit');
    vm.btnSpinner = true;
    vm.DataService.setData(reqObj, 'initiative/' + vm.initiative.initiativeId).then(function(res) {
      vm.afterRequest(res, 'edit');
    });
  }

  deleteActivities() {
    let vm = this;
    vm.btnSpinner = true;
    vm.DataService.deleteData('initiative/' + vm.initiativeID).then(function(res) {
      vm.afterRequest(res, 'delete');
    });
  }

  selectDept(dept, user) {
    let vm = this;
    vm.selectedUserId = false;
    vm.selectedDept = dept ? dept : '';
    vm.selectedUser = user ? user : '';
    if (dept && dept !== vm.translations['FORM.SELECT_NONE']) {
      vm.selectedUserList = vm.getSelectedUserList(dept);
    }
  }

  sortParticipantsList() {
    let vm = this;
    vm.participantList = _.sortBy(vm.participantList, function(participant) {
      return !participant.ticked;
    });
  }

}

export default ActivityFormController;