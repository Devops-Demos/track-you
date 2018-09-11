class OutcomeController {
  constructor($scope, MainAdapter, $routeParams, $rootScope, DataService,
    $location, GraphService) {
    'ngInject';

    let vm = this;
    vm.routeParams = $routeParams;
    vm.location = $location;
    vm.DataService = DataService;
    vm.isProgressEditable = false;
    vm.selectedPeriod = 'current';
    vm.GraphService = GraphService;
    vm.btnSpinner = false;
    vm.newMilestone = false;

    let init = function() {
      vm.kpiId = parseInt($routeParams.kpiId);
      let initiativeId = parseInt($routeParams.initiativeId);
      DataService.getSkeleton(initiativeId).then(function() {
        $rootScope.$broadcast('DATA_RECEIVED');
      });
      DataService.getSingleInitiative(initiativeId).then(function(initiative) {
        $rootScope.$broadcast('DATA_RECEIVED');
        vm.initiative = initiative;
        if (initiative) {
          vm.kpis = initiative.KPI;
          vm.kpis = _.filter(vm.kpis, function(kpi) {

            if (vm.kpiId === 0) {
              return kpi.kpiType.toLowerCase() === 'outcome' && (kpi.parentKpi === 0 || kpi.parentKpi ===
                null);
            } else {
              return kpi.kpiType.toLowerCase() === 'outcome' && kpi.parentKpi === vm.kpiId;
            }
          });

          if (initiative['Executive Summary'][0]) {
            vm.progress = initiative['Executive Summary'][0].progressSummary;
          }

          vm.kpis = _.chain(vm.kpis).map(function(kpi) {
            kpi.parentKpi = parseInt(kpi.parentKpi);
            kpi.statusClass = GraphService.getStatus(kpi);
            if (kpi.latestMilestone && kpi.latestMilestone.timePoint) {
              kpi.lastMilestone = MainAdapter.convertDate(kpi.latestMilestone.timePoint);
            }
            if (kpi.nearestActualMilestone && kpi.nearestActualMilestone.timepoint) {
              kpi.lastUpdate = MainAdapter.convertDate(kpi.nearestActualMilestone.timePoint);
            }
            return kpi;
          }).sortBy('createdAt').value();
          vm.isProgressVisible = !(!!parseInt($routeParams.kpiId));
          if (!!parseInt($routeParams.kpiId)) {
            vm.kpis = _.filter(vm.kpis, function(kpi) {
              return kpi.parentKpi === parseInt($routeParams.kpiId);
            });
          } else {
            vm.kpis = _.filter(vm.kpis, function(kpi) {
              return !!!kpi.parentKpi;
            });
          }

          vm.leftkpis = [];
          vm.rightkpis = [];
          vm.fullWidthkpis = [];
          if (MainAdapter.isMobile()) {
            vm.leftkpis = vm.kpis;
          } else {
            _.each(vm.kpis, function(kpi, index) {
              if (kpi.emphasis) {
                vm.fullWidthkpis.push(kpi);
              } else {
                if (index % 2 === 0) {
                  vm.leftkpis.push(kpi);
                } else {
                  vm.rightkpis.push(kpi);
                }
              }
            });
          }

          if (!$scope.$$phase) {
            $scope.$digest();
          }

        }
      }).finally(function() {
        $rootScope.$broadcast('HIDE_SPINNER');
      });
    };

    init();
  }

  addCards() {
    let vm = this;
    vm.location.path('/output/' + vm.routeParams.initiativeId + '/form/new/outcome/' + vm.routeParams.kpiId);
  }

  editKPI(kpi) {
    let vm = this;
    vm.location.path('/output/' + vm.routeParams.initiativeId +
      '/form/edit/outcome/' + kpi.sno);
  }

  periodChanged() {
    let vm = this;
    _.each(vm.kpis, function(kpi) {
      kpi.hasChart = vm.GraphService.hasChart(kpi, vm.selectedPeriod);
    });
  }

}

export default OutcomeController;
