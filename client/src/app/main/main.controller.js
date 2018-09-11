class MainController {
  constructor(DataService, AuthService, $scope, $location, $window, LocalStorage, MainAdapter, $translate, $routeParams,
    $route, pushAppConstants, $rootScope) {
    'ngInject';

    let vm = this;
    vm.$route = $route;
    vm.$rootScope = $rootScope;
    vm.$location = $location;
    vm.window = $window;
    vm.LocalStorage = LocalStorage;
    vm.sidebarVisibility = false;
    vm.toggleFooter = [];
    vm.routeParams = $routeParams;
    vm.isOverflowMenuVisible = false;
    vm.CONSTANTS = pushAppConstants;
    vm.spinner = {
      isVisibile: true
    };
    vm.isMobile = false;

    vm.translationHolder = ['ISSUE.NO_DATA_AVAILABLE', 'FORM.ADD_INITIATIVE', 'FORM.ADD_PRIORITY',
      'FORM.ADD_OUTPUT_KPI', 'FORM.ADD_OUTCOME_KPI', 'FORM.ADD_ACTIVITY'];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });

    vm.isOnline = function() {
      return navigator.onLine;
    };

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      vm.isMobile = true;
      console.log(vm.isMobile);
    }

    vm.isRtl = false;

    vm.iPhoneNotFullscreen = false;

    $(window.applicationCache).bind('updateready', function() {
      window.applicationCache.swapCache();
      location.reload();
    });

    $('body').on('click', function() {
      vm.isOverflowMenuVisible = false;
    });

    $('body').on('click', function() {
      for(var i in vm.toggleFooter) {
        vm.toggleFooter[i]=false;
      }
      $rootScope.$apply();
    });

    if (window.applicationCache.status === 1 || window.applicationCache.status > 3) {
      window.applicationCache.update();
    }

    let noSpinnerPages = ['/login', '/forgot-password', '/no-support'];
    let publicPages = ['/login', '/forgot-password', '/no-support'];
    let pdfPages = [];
    vm.spinner.isVisibile = vm.spinner.isVisibile && _.indexOf(noSpinnerPages,
      vm.$location.path()) === -1;

    if (MainAdapter.isIE() || !MainAdapter.isStorageSupported()) {
      $location.path('/no-support');
    }

    DataService.loadAppConfig();
    if (MainAdapter.isiPhoneSafari() && MainAdapter.isModeFullscreen()) {
      //iphone and not in full screen
      vm.iPhoneNotFullscreen = true;
    } else if (!AuthService.isLoggedIn()) {
      if (($location.path() !== '/forgot-password')) {
        $location.path('/login');
      }
    } else {
      vm.rights = LocalStorage.getUserRights();
    }

    $scope.$on('SHOW_SPINNER', function() {
      vm.spinner.isVisibile = true;
    });

    $scope.$on('HIDE_SPINNER', function() {
      vm.spinner.isVisibile = false;
    });

    $scope.$on('$locationChangeStart', function() {
      // DataService.setSkeleton(true);
      vm.spinner.isVisibile = true;
      if (_.indexOf(pdfPages, vm.$location.path()) !== -1) {
        vm.isPdfPage = true;
      } else {
        vm.isPdfPage = false;
      }
      if (_.indexOf(publicPages, vm.$location.path()) === -1 && !
        AuthService.isLoggedIn()) {
        $location.path('/login');
      } else {
        let userInfo = LocalStorage.getUser();
        if (userInfo && userInfo.isPasswordReset) {
          if (vm.$location.path() !== '/login') {
            $location.path('/reset-password');
          } else {
            AuthService.logout().then(function() {
              vm.$location.path('/login');
            });
          }
        }
      }
    });
  }

  navigateTo(path) {
    this.$location.path(path);
  }
  toggleFooterMenu(a){
    let vm = this;
    vm.toggleFooter[a] = !vm.toggleFooter[a];
  }

  print(){
    window.print();
  }

  getUserRights() {
    return this.LocalStorage.getUserRights();
  }

  windowResize() {
    $(window).trigger('resize');
    this.sidebarVisibility = false;
  }

  isActivityEditable() {
    let vm = this;
    return vm.getUserRights().crudArtifacts;
  }

  isKpiEditable() {
    let vm = this;
    return vm.getUserRights().crudArtifacts;
  }

  backTo() {
    history.back(-1);
  }

  closeMobileMenu() {
    this.sidebarVisibility = false;
  }

  openMobileMenu() {
    this.sidebarVisibility = true;
    this.isOverflowMenuVisible = false;
  }

  toggleMenu() {
    this.sidebarVisibility = !this.sidebarVisibility;
  }

  isView(viewName) {
    return this.$location.path() === viewName;
  }

  onSidebarSwipe(side) {
    let vm = this;
    if (((vm.isRtl && side === 'right') || (!vm.isRtl && side === 'left')) && $(window).width() <= vm.CONSTANTS.mobileWidth) {
      this.closeMobileMenu();
    }
  }

  onBodySwipe(side) {
    let vm = this;
    if (((vm.isRtl && side === 'left') || (!vm.isRtl && side === 'right')) && $(window).width() <= vm.CONSTANTS.mobileWidth) {
      this.openMobileMenu();
    }
  }

  isAddCardsVisible() {
    let vm = this;
    let title = '';
    if (vm.$route.current.$$route && vm.$route.current.$$route.name) {
      title = vm.$route.current.$$route.name;
    }
    if (title && vm.getUserRights().crudArtifacts) {
      if (title === 'output') {
        if (vm.routeParams.kpiId) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  toggleOverflowMenu() {
    let vm = this;
    vm.closeMobileMenu();
    vm.isOverflowMenuVisible = !vm.isOverflowMenuVisible;
  }

  getAddCardTitle() {
    let vm = this;
    let title = '';
    if (vm.$route.current.$$route && vm.$route.current.$$route.name) {
      title = vm.$route.current.$$route.name;
    }
    if (vm.translations) {
      if (title === 'output') {
        title = vm.translations['FORM.ADD_OUTPUT_KPI'];
      } else if (title === 'outcome') {
        title = vm.translations['FORM.ADD_OUTCOME_KPI'];
      } else if (title === 'landing') {
        title = vm.translations['FORM.ADD_PRIORITY'];
      } else {
        vm.$rootScope.$on('HEADER_TITLE', function (event, data) {
          vm.headTitle = data;   
        });
        if(vm.headTitle === 'Activity'){
          title = vm.translations['FORM.ADD_ACTIVITY'];
        }else{
          title = vm.translations['FORM.ADD_INITIATIVE'];
        }
      }
    }
    vm.addCardTitle = title;
    return title;
  }

  openLink(link) {
    let vm = this;
    vm.window.open(link, '_blank');
  }

  addCards() {
    let vm = this;
    let title = '';
    if (vm.$route.current.$$route && vm.$route.current.$$route.name) {
      title = vm.$route.current.$$route.name;
    }
    if (title === 'output') {
      vm.$location.path('/output/' + vm.routeParams.initiativeId + '/form/new/output/0');
    } else if (title === 'outcome') {
      vm.$location.path('/output/' + vm.routeParams.initiativeId + '/form/new/outcome/' + vm.routeParams.kpiId);
    } else if (title === 'landing') {
      vm.$location.path('/initiative/0/form/new/priority');
    } else {
      if(vm.headTitle === 'Activity'){
        vm.$location.path('/activity/' + vm.routeParams.initiativeId + '/form/new');
      }else{
        vm.$location.path('/initiative/' + vm.routeParams.initiativeId + '/form/new');
      }
    }

    //TODO: activity
  }
}

export default MainController;
