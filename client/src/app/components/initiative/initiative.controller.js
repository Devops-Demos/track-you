class InitiativeController {
  constructor(InitiativeAdapter, $routeParams, MainAdapter, DataService, AuthService, $route, $rootScope,
    $location, $window, pushAppConstants, $translate, LocalStorage) {
    'ngInject';

    let arraysToUpdate = ['initiatives', 'leftInitiatives', 'rightInitiatives'];

    let arraysToUpdateLandingPage = ['leftLandingInitiatives', 'rightLandingInitiatives', 'leftActivities',
      'rightActivities', 'leftPriorities', 'rightPriorities', 'leftActivities', 'rightActivities'
    ];

    let vm = this;
    vm.onlineRequiredPopup = false;
    vm.DataService = DataService;
    vm.InitiativeAdapter = InitiativeAdapter;
    vm.location = $location;
    vm.window = $window;
    vm.$rootScope = $rootScope;
    vm.routeParams = $routeParams;
    vm.CONSTANTS = pushAppConstants;
    vm.LocalStorage = LocalStorage;
    vm.selectedPeriod = 'current';
    vm.sendEmail = false;
    vm.translationHolder = ['INITIATIVE_PAGE.INVALID_DATE', 'ACTIVITY', 'PRIORITY', 'INITIATIVE'];
    vm.pageTitle = {
      PRIORITY: 'Priority',
      INITIATIVE: 'Initiative',
      ACTIVITY: 'Activity'
    };
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
    });

    vm.isNaN = isNaN;
    vm.isOverall = false;
    let spinnerVisible = true;

    let processInitiative = function(initiative) {
      let activitiesWithStatusTotal = 0,
        activitiesWithStatusActual = 0;

      initiative.showSpinner = vm.DataService.isOnline() ? true : false;
      if (initiative.type.toLowerCase() !== 'activity') {
        initiative.hasChart = initiative.activityCount && (initiative.activityCount.completed || initiative.activityCount
          .delayed || initiative.activityCount.onTrack);
        _.each(initiative.activityCount, function(status, key) {
          if (key === 'onTrack' || key === 'completed') {
            activitiesWithStatusActual += status;
          }
          if (_.indexOf(['onTrack', 'completed', 'delayed'], key) !== -1) {
            activitiesWithStatusTotal += status;
          }
        });
        initiative.hasChild = initiative.hasChildren || InitiativeAdapter.isLastInitiative(initiative.initiativeId);
      } else {
        initiative.hasChild = false;
      }

      initiative.statusClass = initiative.status ? vm.CONSTANTS.statusMap[initiative.status] : 'unknown';
      initiative.activityShedule = Math.round((activitiesWithStatusActual / activitiesWithStatusTotal) * 100);
      initiative.activityStatusClass = !_.isNull(initiative.activityShedule) ? initiative.activityShedule < 70 ?
        'delayed' : initiative.activityShedule < 100 ? 'on-track' : 'completed' : 'unknown';
      initiative.updatedAtString = MainAdapter.convertDate(initiative.updatedAt);
      initiative.plannedStartDateString = initiative.plannedStartDate && initiative.plannedStartDate !==
        'Invalid date' ? MainAdapter.convertDate(initiative.plannedStartDate) : '';
      initiative.plannedEndDateString = initiative.plannedEndDate && initiative.plannedEndDate !==
        'Invalid date' ? MainAdapter.convertDate(initiative.plannedEndDate) : '';
      initiative.actualStartDateString = initiative.actualStartDate && initiative.actualStartDate !==
        'Invalid date' ? MainAdapter.convertDate(initiative.actualStartDate) : '';
      initiative.actualEndDateString = initiative.actualEndDate && initiative.actualEndDate !== 'Invalid date' ?
        MainAdapter.convertDate(initiative.actualEndDate) : '';
      initiative.executiveSummary = {
        lastUpdatedOn: initiative['Executive Summary'] && initiative['Executive Summary'][0] ? MainAdapter.convertDate(
          initiative['Executive Summary'][0].updatedAt) : undefined
      };
      initiative.cardType = vm.cardTypeHash[initiative.type.toLowerCase()] ? vm.cardTypeHash[initiative.type.toLowerCase()] :
        'initiative';
      initiative.outcomeKpi = {
        lastUpdatedOn: initiative.KPI && initiative.KPI.length ?
          MainAdapter.convertDate((_.pluck(initiative.KPI, 'updatedAt')).sort()[
            initiative.KPI.length - 1]) : undefined
      };
      return initiative;
    };

    vm.$rootScope.$on('ONLINE_REQUIRED', function() {
      if (!vm.$rootScope.$$phase) {
        vm.$rootScope.$apply(function() {
          vm.onlineRequiredPopup = true;
        });
      } else {
        vm.onlineRequiredPopup = true;
      }
    });

    let processData = function() {
      let initiativeId = $routeParams.initiativeId ? parseInt($routeParams.initiativeId) : 0;
      vm.initiativeid = $routeParams.initiativeId;
      vm.initiatives = angular.copy(InitiativeAdapter.getInitiatives(initiativeId));
      _.map(vm.initiatives, processInitiative);
      vm.initiatives = _.sortBy(vm.initiatives, 'initiativeId');
      _.each(vm.initiatives, function(currentInitiative) {
        vm.initiativeOwner = currentInitiative.owner;
        vm.initiativeDept = currentInitiative.dept;
        vm.leftInitiatives = [];
        vm.rightInitiatives = [];
        if (MainAdapter.isMobile()) {
          vm.leftInitiatives = vm.initiatives;
        } else {
          _.each(vm.initiatives, function(initiative, index) {
            if (index % 2 === 0) {
              vm.leftInitiatives.push(initiative);
            } else {
              vm.rightInitiatives.push(initiative);
            }
          });
        }
        let initiativeTypes = _.uniq(_.pluck(vm.initiatives, 'type'));
        let headTitle = initiativeTypes[0] ? initiativeTypes[0].split(' ')[0].toUpperCase() : '';
        if (headTitle) {
          vm.heading = vm.pageTitle[headTitle];
        } else {
          vm.heading = (vm.location.path() === '/landing') ? 'Priority' : 'Initiative';
        }
        $rootScope.$emit('HEADER_TITLE', vm.heading);
        vm.isCurrentTargetVisible = (vm.translations && vm.heading === 'Activity') ? false :
          true;
        vm.isLegendVisible = (vm.translations && vm.heading === 'Priority') ? false : true;
      });
      if (!spinnerVisible || !vm.isLandingPage) {
        $rootScope.$broadcast('HIDE_SPINNER');
      } else {
        spinnerVisible = false;
      }
      $(window).trigger('resize');
    };

    let processLandingPageData = function(initiatives) {
      vm.landingPriorities = vm.landingPriorities || [];
      vm.landingInitiatives = vm.landingInitiatives || [];
      vm.landingActivities = vm.landingActivities || [];
      _.each(initiatives, function(initiative) {
        if (initiative) {
          if (initiative.type.toLowerCase() === 'priority') {
            vm.landingPriorities.push(initiative);
          } else if (initiative.type.toLowerCase() === 'activity') {
            vm.landingActivities.push(initiative);
          } else if (initiative.type) {
            vm.landingInitiatives.push(initiative);
          }
          vm.landingPriorities = _.chain(vm.landingPriorities).uniq(function(initiative) {
            return initiative.initiativeId;
          }).map(processInitiative).sortBy(
            'initiativeId').value();
          vm.landingInitiatives = _.chain(vm.landingInitiatives).uniq(function(initiative) {
            return initiative.initiativeId;
          }).map(processInitiative).sortBy(
            'initiativeId').value();
          vm.landingActivities = _.chain(vm.landingActivities).uniq(function(initiative) {
            return initiative.initiativeId;
          }).map(processInitiative).sortBy(
            'initiativeId').value();

          vm.landingActivities = _.sortByOrder(vm.landingActivities, 'initiativeId');
          vm.leftPriorities = [];
          vm.rightPriorities = [];
          if (MainAdapter.isMobile()) {
            vm.leftPriorities = vm.landingPriorities;
          } else {
            vm.landingPriorities.forEach(function(priority, index) {
              if (index % 2 === 0) {
                vm.leftPriorities.push(priority);
              } else {
                vm.rightPriorities.push(priority);
              }
            });
          }

          vm.leftLandingInitiatives = [];
          vm.rightLandingInitiatives = [];
          if (MainAdapter.isMobile()) {
            vm.leftLandingInitiatives = vm.landingInitiatives;
          } else {
            vm.landingInitiatives.forEach(function(initiative, index) {
              if (index % 2 === 0) {
                vm.leftLandingInitiatives.push(initiative);
              } else {
                vm.rightLandingInitiatives.push(initiative);
              }
            });
          }

          vm.leftActivities = [];
          vm.rightActivities = [];
          if (MainAdapter.isMobile()) {
            vm.leftActivities = vm.landingActivities;
          } else {
            vm.landingActivities.forEach(function(priority, index) {
              if (index % 2 === 0) {
                vm.leftActivities.push(priority);
              } else {
                vm.rightActivities.push(priority);
              }
            });
          }
        }
      });
      vm.isMyProject = (vm.landingPriorities.length > 0 || vm.landingInitiatives.length > 0 || vm.landingActivities
        .length > 0);
      if (vm.isMyProject) {
        vm.selectedTab = 'my-projects';
      } else {
        vm.selectedTab = 'overall';
      }
      $rootScope.$broadcast('DATA_RECEIVED');
      if (!spinnerVisible) {
        $rootScope.$broadcast('HIDE_SPINNER');
      } else {
        spinnerVisible = false;
      }
      let initiativeTypes = _.uniq(_.pluck(vm.initiatives, 'type'));
      let headTitle = initiativeTypes[0] ? initiativeTypes[0].split(' ')[0].toUpperCase() : '';
      if (headTitle) {
        vm.heading = vm.pageTitle[headTitle];
      } else {
        vm.heading = (vm.location.path() === '/landing') ? 'Priority' : 'Initiative';
      }
    };

    let init = function() {
      let initiativeId = parseInt($routeParams.initiativeId);
      if ($route.current.$$route.name === 'landing') {
        vm.isLandingPage = true;
        DataService.getInitiativeTree(0).then(function() {
          processData();
          DataService.getOwnedInitiatives().then(function(initiatives) {
            processLandingPageData(initiatives);
          });
          DataService.getParticipatingInitiatives().then(function(initiatives) {
            processLandingPageData(initiatives);
          });
        });
      } else {
        DataService.getSkeleton(initiativeId).then(function() {
          vm.breadCrumb = InitiativeAdapter.getParentChain($routeParams.initiativeId, false);
          $rootScope.$broadcast('DATA_RECEIVED');
        });
        DataService.getInitiativeTree(initiativeId).then(function() {
          processData();
        });
      }
    };

    vm.cardTypeHash = {
      'priority': 'priority',
      'activity': 'activity'
    };

    init();

    $rootScope.$on('INITIATIVE_RECEIVED', function(scope, initiative) {
      initiative = processInitiative(initiative);
      initiative.showSpinner = false;
      arraysToUpdate.forEach(function(key) {
        vm[key] = _.map(vm[key], function(init) {
          if (initiative.initiativeId === init.initiativeId) {
            initiative.showSpinner = false;
            return initiative;
          } else {
            return init;
          }
        });
      });
      if (vm.isLandingPage) {
        arraysToUpdateLandingPage.forEach(function(key) {
          vm[key] = _.map(vm[key], function(init) {
            if (initiative.initiativeId === init.initiativeId) {
              initiative.showSpinner = false;
              return initiative;
            } else {
              return init;
            }
          });
        });
      }
    });
  }

  canSendMail(initiative) {
    let vm = this;
    vm.emailInitiative = initiative;
    vm.emailInitiativeId = initiative.initiativeId;
    vm.fullParentChain = _.forEach(vm.InitiativeAdapter.getParentChain(initiative.initiativeId,
      true), function(level) {
      if(level.type.toLowerCase() === 'priority'){
        level.type = 'Sector';
      }else if(level.type.toLowerCase() === 'activity'){
        level.type = '3-feet action';
      }else{
        level.type = _.capitalize(level.type);  
      }
    });
    vm.sendEmail = true;
  }

  editCards(initiative, type) {
    let vm = this;
    if (type === 'priority') {
      vm.location.path('/initiative/' + initiative.initiativeId + '/form/edit/priority');
    } else {
      vm.location.path('/' + type + '/' + initiative.initiativeId + '/form/edit');
    }
  }

  speedometerNavigate(initiativeId) {
    this.location.path('/initiative/' + initiativeId + '/output/');
  }

  toggleFooterMenu(){
    console.log('a');
  }

  onActivityChartClick(initiative) {
    let vm = this;
    if (!navigator.onLine && !initiative.hasChild) {
      vm.$rootScope.$broadcast('ONLINE_REQUIRED');
    } else {
      vm.location.path('/initiative/' + initiative.initiativeId);
    }
  }

  addCards() {
    let vm = this;
    vm.heading = vm.heading || 'Initiative';
    let pageHeading = _.findKey(vm.pageTitle, function(title) {
      return title === vm.heading;
    });
    if (pageHeading.toLowerCase() === 'priority') {
      vm.location.path('/initiative/0/form/new/priority');
    } else {
      vm.location.path('/' + pageHeading.toLowerCase() + '/' + vm.routeParams.initiativeId + '/form/new');
    }
  }
}

export default InitiativeController;
