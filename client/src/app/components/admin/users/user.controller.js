class UserController {
  constructor(DataService, UserAdapter, $rootScope, LocalStorage, $location, $translate) {
    'ngInject';
    let vm = this;
    vm.DataService = DataService;
    vm.UserAdapter = UserAdapter;
    vm.LocalStorage = LocalStorage;
    vm.$rootScope = $rootScope;
    vm.$location = $location;
    vm.translationHolder = ['ADMIN.CREATE_USER', 'ADMIN.UPDATE_USER', 'ADMIN.ERROR_POPULATING_DEPTS', 'ADMIN.ERROR_CREATING_USER', 'ADMIN.ERROR_DELETING_USER', 'ADMIN.ERROR_GETTING_USER_LIST', 'ADMIN.USER_CREATED', 'ADMIN.USER_UPDATED', 'ADMIN.ERROR_UPDATING_USER', 'ERROR', 'STATUS.NOT_AUTHORIZED_TO_DELETE_USERS', 'STATUS.USER_DELETED', 'STATUS.INVALID_EMAIL', 'NAME', 'EMAIL', 'DEPARTMENT', 'ADMIN.EDIT_DELETE', 'FORM.DELETE', 'ADMIN.EDIT'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
      vm.setView('list');
      vm.init();
    });
  }

  init() {
    let vm = this;
    let userRights = vm.LocalStorage.getUserRights();
    if (!userRights.crudUsers) {
      vm.$location.path('/landing');
    }
    vm.statusText = '';
    vm.listUserInit();
    vm.mode = vm.translations['ADMIN.CREATE_USER'];
  }

  updateUserInit() {
    let vm = this;
    vm.mode = vm.translations['ADMIN.UPDATE_USER'];
    vm.emailEditable = false;
  }

  createUserInit() {
    let vm = this;
    vm.userName = '';
    vm.userEmail = '';
    vm.newDepartment = '';
    vm.departments = [];
    vm.emailEditable = true;
    vm.populateRights();
    vm.populateDepartments();
    vm.selectedDept = '';
    vm.dropdownStatus = false;
    vm.departmentBox = false;
    vm.spinnerVisibility = false;
  }

  listUserInit() {
    var vm = this;
    vm.deleteConfirmModal = false;
    vm.gridOptions = {
      data: [],
      enableColumnMenus: false,
      columnDefs: [{
        field: 'name',
        name: vm.translations.NAME
      }, {
        field: 'email',
        name: vm.translations.EMAIL
      }, {
        field: 'department',
        name: vm.translations.DEPARTMENT
      }, {
        field: 'edit/delete',
        name: vm.translations['ADMIN.EDIT_DELETE'],
        cellTemplate: '<div class="ui-grid-cell-contents"><button ng-click="grid.appScope.user.editUser(row.entity)" class="list-btn edit-button">' +
          vm.translations['ADMIN.EDIT'] + '</button><button class="list-btn delete-button" ng-click="grid.appScope.user.showModal(row.entity)">' + vm.translations['FORM.DELETE'] + '</button></div>' +
          '<div class="ui-grid-cell-contents"></div>'
      }]
    };
    vm.listUsers();

  }

  setView(viewName) {
    var vm = this;
    vm.selectedNav = viewName;
    switch (viewName) {
      case 'create':
        vm.createUserInit();
        break;
      case 'update':
        vm.updateUserInit();
        break;
      default:
        vm.init();
    }
  }

  checkView(viewName) {
    var vm = this;
    return vm.selectedNav === viewName;
  }

  toggleAddDepartment() {
    this.departmentBox = !this.departmentBox;
  }

  isDepartmentAdded() {
    return this.departmentBox;
  }

  addDepartment() {
    let vm = this;
    if (vm.newDepartment) {
      vm.selectedDept = vm.newDepartment;
      vm.departments.push(vm.newDepartment);
      vm.newDepartment = '';
    }
    vm.dropdownStatus = false;
    vm.toggleAddDepartment();
  }

  populateRights() {
    let vm = this;
    vm.UserAdapter.getUserRights().then(function(res) {
      vm.rights = res;
    });
  }

  populateDepartments() {
    let vm = this;
    vm.UserAdapter.getDepartments().then(function(depts) {
      vm.departments = depts;
    }, function() {
      vm.showStatusTimeout(vm.translations['ADMIN.ERROR_POPULATING_DEPTS']);
    });
  }

  selectDepartment(dept, form) {
    let vm = this;
    if (vm.getEditUserData() && vm.getEditUserData().department !== dept) {
      form.$setDirty();
    }
    vm.selectedDept = dept;
    vm.dropdownStatus = false;
  }

  getSortedDepts() {
    if (!this.departments || this.departments.length === 0) {
      return [];
    } else {
      return this.departments.sort(function(a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
    }
  }

  createUser() {
    let vm = this;
    let usrData = {
        'email': vm.userEmail,
        'name': vm.userName,
        'department': vm.selectedDept
      },
      path = 'user/new';
    angular.extend(usrData, vm.getSelectedRights());
    vm.DataService.postData(usrData, path).then(function(res) {
      if (res.data && res.data.createdAt) {
        vm.showStatusTimeout(vm.translations['ADMIN.USER_CREATED']);
      } else if (res.invalidAttributes && res.invalidAttributes.email) {
        vm.showStatusTimeout(vm.translations['STATUS.INVALID_EMAIL']);
      } else {
        vm.showStatusTimeout(vm.translations['ADMIN.ERROR_CREATING_USER']);
      }
    }, function() {
      vm.showStatusTimeout(vm.translations['ADMIN.ERROR_CREATING_USER']);
    });
  }

  updateUser() {
    let vm = this;
    let usrData = {
      'email': vm.userEmail,
      'name': vm.userName,
      'department': vm.selectedDept
    };
    angular.merge(usrData, vm.getSelectedRights());
    vm.UserAdapter.updateUser(vm.getEditUserData().id, usrData).then(function() {
      vm.spinnerVisibility = false;
      vm.showStatusTimeout(vm.translations['ADMIN.USER_UPDATED']);
    }, function() {
      vm.showStatusTimeout(vm.translations['ADMIN.ERROR_UPDATING_USER']);
    });
  }

  editUser(userData) {
    let vm = this;
    vm.editUserData = userData;
    vm.setView('update');
    vm.populateuserData(userData);
  }

  deleteUser() {
    let vm = this;
    vm.spinnerVisibility = true;
    let loadingDone = function() {
      vm.deleteConfirmModal = false;
      vm.spinnerVisibility = false;
    };
    vm.UserAdapter.deleteUser(vm.deleteUserData.id).then(function(res) {
      loadingDone();
      if (res) {
        vm.showStatusTimeout(vm.translations[res.message]);
      } else {
        vm.showStatusTimeout(vm.translations['ADMIN.ERROR_DELETING_USER']);
      }
    }, function(err) {
      loadingDone();
      vm.showStatusTimeout(vm.translations.ERROR + ': ' + err.statusText);
    });
  }

  isForminvalid(form) {
    return !(form.$valid && this.selectedDept.length > 0);
  }

  submitUser() {
    let vm = this;
    vm.spinnerVisibility = true;
    if (vm.selectedNav === 'create') {
      vm.createUser();
    } else {
      vm.updateUser();
    }
  }

  getSelectedRights() {
    var selectedRightsObj = {};
    _.map(this.rights, function(right) {
      selectedRightsObj[right.key] = right.isSelected;
    });
    return selectedRightsObj;
  }

  setSelectedRights(usrData) {
    let selectedRights = [];
    //TODO: remove hard coding
    _.chain(usrData).pick('viewAll', 'updateAllOutComeKpis', 'updateAllOutputKpis', 'updateAllIssueLogs', 'updateAllActivities',
      'updateAllExecutiveSummaries', 'crudArtifacts', 'crudUsers', 'viewParentage').forEach(function(value, key) {
      if (value) {
        selectedRights.push(key);
      }
    }).value();
    this.rights = _.map(this.rights, function(rightDetail) {
      rightDetail.isSelected = _.include(selectedRights, rightDetail.key);
      return rightDetail;
    });
  }

  listUsers() {
    var vm = this;
    vm.UserAdapter.listUsers().then(function(users) {
      vm.users = users;
      vm.gridOptions.data = users;
    }, function() {
      vm.showStatusTimeout(vm.translations['ADMIN.ERROR_GETTING_USER_LIST']);
    }).finally(function() {
      vm.$rootScope.$broadcast('DATA_RECEIVED');
      vm.$rootScope.$broadcast('HIDE_SPINNER');
    });
  }

  showStatusTimeout(errString) {
    let vm = this;
    vm.statusText = errString;
  }

  showModal(userData) {
    let vm = this;
    vm.deleteConfirmModal = true;
    vm.deleteUserData = userData;
  }

  getEditUserData() {
    return this.editUserData;
  }

  populateuserData(userData) {
    let vm = this;
    vm.userEmail = userData.email;
    vm.userName = userData.name;
    vm.selectedDept = userData.department ? userData.department : '';
    vm.UserAdapter.getUserRights().then(function(res) {
      vm.rights = res;
      vm.setSelectedRights(userData);
    });
    vm.populateDepartments();
  }

  closeDropdown() {
    let vm = this;
    vm.dropdownStatus = false;
    vm.departmentBox = false;
    vm.newDepartment = '';
  }
}

export default UserController;
