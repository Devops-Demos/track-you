class HeaderController {
  constructor($location, $routeParams, $rootScope, HeaderAdapter, AuthService, $route, $scope, DataService,
    OfflineService, $translate, InitiativeAdapter) {
    'ngInject';

    let vm = this;
    vm.$location = $location;
    vm.isDropOpen = false;
    vm.appConfig = undefined;
    vm.$routeParams = $routeParams;
    vm.DataService = DataService;
    vm.AuthService = AuthService;
    vm.OfflineService = OfflineService;
    vm.promptMessage = '';
    vm.$rootScope = $rootScope;
    vm.HeaderAdapter = HeaderAdapter;
    vm.InitiativeAdapter = InitiativeAdapter;
    vm.mobile = {};
    vm.downloadTemplateModal = false;
    vm.uploadMilestonesModal = false;
    vm.mobile.showNavbar = false;
    vm.translationHolder = ['HEADER.INTERNET_CONNECTION_REQUIRED', 'HEADER.SEARCH', 'HEADER.SYNC',
      'HEADER.LOGOUT', 'HEADER.UNSYNCED_DATA_LOST', 'INITIATIVE', 'PRIORITY', 'OUTCOME_KPI', 'OUTPUT_KPI',
      'ITRACK', 'FORGOT_PASSWORD.FORGOT_PASSWORD',
      'FORGOT_PASSWORD.RESET_PASSWORD', 'APP_CONFIG.SYNC_REPORT', 'CARD.WEEKLY_REPORT',
      'CARD.IMP_TRACKER', 'APP_CONFIG.OVERALL_SUMMARY',
      'APP_CONFIG.OVERALL_EXECUTIVE_SUMMARY', 'APP_CONFIG.OVERALL_TRACKER', 'APP_CONFIG.MONITORING_REPORT_SEARCH',
      'APP_CONFIG.USER_MGMT'
    ];
    $scope.$on('CLOSE_DOWNLOAD_MODAL', function() {
      vm.downloadTemplateModal = false;
    });
    $scope.$on('CLOSE_UPLOAD_MODAL', function() {
      vm.uploadMilestonesModal = false;
    });
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
      vm.mobileBottomMenu = [{
        'image': 'search.svg',
        'text': vm.translations['HEADER.SEARCH'],
        'clickMethod': function() {
          vm.$location.path('/search');
        }
      }, {
        'image': 'sync.svg',
        'text': vm.translations['HEADER.SYNC'],
        'clickMethod': function() {
          vm.$location.path('/sync');
        }
      }, {
        'image': 'logout.svg',
        'text': vm.translations['HEADER.LOGOUT'],
        'clickMethod': function() {
          vm.logoutHandler();
        }
      }];
    });

    vm.$rootScope.$on('$locationChangeStart', function() {
      vm.page = null;
    });

    vm.currentRoute = function() {
      if ($route.current.$$route && $route.current.$$route.name) {
        return $route.current.$$route.name === 'output' ? 'initiative' : $route.current.$$route.name;
      }
    };

    vm.logoutHandler = function() {
      let vm = this;
      vm.logoutPrompt = false;
      AuthService.logout().then(function() {
        vm.$location.path('/login');
      });
    };

    vm.getMenuLink = function(item) {
      if (vm.currentInitiativeId) {
        if (item.link === 'outcome') {
          return '#/initiative/' + vm.currentInitiativeId + '/outcome/0';
        } else if (item.link === 'output') {
          return '#/initiative/' + vm.currentInitiativeId;
        } else {
          return '#/' + item.link + '/' + vm.currentInitiativeId;
        }
      } else {
        return '';
      }
    };

    vm.mobile.addCard = function() {
      $location.path(vm.mobile.addCardUrl);
    };

    vm.mobile.changeNav = function(item) {
      vm.mobile.showNavbar = false;
      $location.path(vm.getMenuLink(item).replace(/^#/, ""));
    };

    $('body').on('click', function() {
      vm.isDropOpen = false;
      if (!$scope.$$phase) {
        $scope.$digest();
      }
    });

    let setup = function() {
      //TODO: refactor code to call api on route change, consider appConfig
      vm.appConfig = DataService.getAppConfig();
      if (vm.appConfig) {
        if (AuthService.isLoggedIn()) {
          let pageName = $route.current.$$route.name ? $route.current.$$route.name : 'initiative';
          let initiativeId = $routeParams.initiativeId ? parseInt($routeParams.initiativeId) : 0;
          if (pageName === 'output') {
            initiativeId = $routeParams.kpiId || $routeParams.initiativeId;
          }
          doPageSetup(pageName, initiativeId);
          populateAddViewName();
        } else {
          doPageSetup('login', 0);
        }
      } else {
        DataService.loadAppConfig().then(function() {
          setup();
        });
      }
    };

    function doPageSetup(pageName, initiativeId) {
      vm.mobile.menu = {};
      vm.mobile.menu.title = vm.translations[vm.appConfig.mobileMenu.title];
      vm.mobile.menu.subtitle = vm.appConfig.mobileMenu.subtitle;
      vm.page = vm.appConfig.pages[vm.appConfig.routeMap[pageName]];
      let chain = vm.InitiativeAdapter.getParentChain(vm.$routeParams.initiativeId, true);
      vm.appConfig = DataService.getAppConfig();
      let priorityFound = _.find(chain, function(node) {
        return node.type.toLowerCase() === 'priority';
      });
      if (chain && !priorityFound) {
        delete vm.page.headerMenu;
        vm.page.title = vm.translations.ITRACK;
      }
      vm.pageName = pageName;
      let priority;
      if (initiativeId >= 0) {
        if ($routeParams.kpiId && pageName === 'output') {
          DataService.getKpi(parseInt($routeParams.kpiId)).then(function(kpi) {
            if (kpi) {
              let initiativeId = kpi.initiativeId || kpi.initiative.initiativeId;
              priority = HeaderAdapter.getPriority(initiativeId);
              if (priority) {
                vm.currentInitiativeId = priority.initiativeId;
                if (vm.page.useNameAsTitle) {
                  vm.page.title = priority.initiative;
                }
              }
            }
          });
        } else {
          priority = HeaderAdapter.getPriority(parseInt($routeParams.initiativeId));
          if (priority) {
            vm.currentInitiativeId = priority.initiativeId;
            vm.page.title = priority.initiative;
          }
        }
      }
      if (!$rootScope.$$phase) {
        $rootScope.$digest();
      }
    }

    function populateAddViewName() { //for adding card functionality
      let viewMapper = {
          'initiative': {
            text: vm.translations.INITIATIVE,
            clickMethodArgs: '/initiative/' + $routeParams.initiativeId + '/form/new'
          },
          'outcome': {
            text: vm.translations.OUTCOME_KPI,
            clickMethodArgs: '/output/' + $routeParams.initiativeId + '/form/new/outcome/' + $routeParams.kpiId
          },
          'output': {
            text: vm.translations.OUTPUT_KPI,
            clickMethodArgs: '/output/' + $routeParams.initiativeId + '/form/new/output/0'
          },
          'landing': {
            text: vm.translations.PRIORITY,
            clickMethodArgs: '/initiative/0/form/new/priority'
          }
        },
        currentLocation = $location.path().split('/'),
        viewName = '';
      if (_.includes(['initiative', 'outcome'], currentLocation.slice(-2)[0])) {
        viewName = currentLocation.slice(-2)[0];
      } else if (_.intersection(currentLocation, ['landing', 'output']).length > 0) {
        viewName = currentLocation.slice(-1)[0];
      } else {
        viewName = 'initiative';
      }
      if (viewMapper[viewName]) {
        vm.mobile.addCardText = viewMapper[viewName].text;
        vm.mobile.addCardUrl = viewMapper[viewName].clickMethodArgs;
      }
    }

    $scope.$on('DATA_RECEIVED', setup);
  }

  isPromptRequired() {
    let vm = this;
    vm.promptMessage = navigator.onLine ? vm.translations['HEADER.UNSYNCED_DATA_LOST'] : vm.translations[
      'HEADER.INTERNET_CONNECTION_REQUIRED'];
    return this.OfflineService.isDataSynced();
  }

  currentUser() {
    return this.AuthService.username();
  }

  isInitiativeView() {
    let vm = this,
      paths = vm.$location.path().split('/');
    return paths[paths.length - 2] === 'initiative';
  }

  isOnline() {
    let vm = this;
    if (navigator.onLine) {
      if (vm.OfflineService.isDataSynced()) {
        return false;
      } else {
        return true;
      }
    } else if (vm.lastSyncTime) {
      return false;
    } else {
      let currentDate = new Date();
      let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      vm.lastSyncTime = currentDate.getDate() + ' ' + months[currentDate.getMonth()] + ' ' + currentDate.getFullYear() +
        ' ' + (currentDate.getHours() % 12 || 12) + ':' + currentDate.getMinutes() + ((currentDate.getHours() <
          12) ? ' AM' : ' PM');
      return false;
    }
  }

  postPoneInitiatives() {
    this.$location.path('postponePriority/' + this.currentInitiativeId);
  }

  checkDisabled(crudRole, menuObj) {
    return menuObj.image === 'plus-white.svg' && !crudRole;
  }

  isAddingDisabled() {
    let disableViews = ['form', 'search', 'sync'];
    return _.intersection(this.$location.path().split('/'), disableViews).length > 0;
  }
}

export default HeaderController;
