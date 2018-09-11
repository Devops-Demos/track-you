class OutputController {
  constructor($scope, $routeParams, InitiativeAdapter, MainAdapter, $location, DataService, $rootScope, GraphService) {
    'ngInject';

    let vm = this;
    vm.location = $location;
    vm.routeParams = $routeParams;
    vm.isDrillDown = false;
    vm.selectedPeriod = 'current';

    let processKpis = function() {
      vm.leftKpis = [];
      vm.rightKpis = [];
      vm.fullWidthkpis = [];

      _.map(vm.kpis, function(kpi) {
        if (kpi.latestMilestone && kpi.latestMilestone.timePoint) {
          kpi.lastMilestone = MainAdapter.convertDate(kpi.latestMilestone.timePoint);
        }
        if (kpi.nearestActualMilestone && kpi.nearestActualMilestone.timepoint) {
          kpi.lastUpdate = MainAdapter.convertDate(kpi.nearestActualMilestone.timePoint);
        }
        vm.initiative = (kpi.initiative) ? kpi.initiative : vm.initiative;
        kpi.baseline = parseFloat(kpi.baseline);
        kpi.target = parseFloat(kpi.target);
        if (parseInt(kpi.parentKpi)) {
          let localKpi = _.find(DataService.getLocalKPIS(), {
            sno: kpi.parentKpi
          });
          if (!localKpi) {
            DataService.getSingleKpi(kpi.parentKpi).then(function(response) {
              if (response) {
                kpi.parentKPIName = (!!kpi.parentKpi) ? response.kpi : 'N / A';
                kpi.parentKpiLink = parseInt(response.parentKpi) ? '#/output/' + response.parentKpi : '#/initiative/' + response.initiative.initiativeId + '/output';
              } else {
                kpi.parentKpiLink = '';
              }
            });
          } else {
            kpi.parentKPIName = (!!kpi.parentKpi) ? localKpi.kpi : 'N / A';
            kpi.parentKpiLink = parseInt(localKpi.parentKpi) ? '#/output/' + localKpi.parentKpi : '#/initiative/' + localKpi.initiativeId + '/output';
          }
        }
        kpi.parentInitiative = vm.initiative;

        kpi.statusClass = GraphService.getStatus(kpi);

        return kpi;
      });

      $rootScope.$broadcast('HIDE_SPINNER');

      if (MainAdapter.isMobile()) {
        vm.leftKpis = vm.kpis;
      } else {
        _.each(vm.kpis, function(kpi, index) {
          if (kpi.emphasis) {
            vm.fullWidthkpis.push(kpi);
          } else {
            if (index % 2 === 0) {
              vm.leftKpis.push(kpi);
            } else {
              vm.rightKpis.push(kpi);
            }
          }
        });
      }

      if (!$scope.$$phase) {
        $scope.$digest();
      }
    };

    let initInitiaveKpis = function() {
      let initiativeId = $routeParams.initiativeId;
      DataService.getSingleInitiative(initiativeId).then(function(initiative) {
        if (initiative) {
          vm.initiative = initiative;
          vm.kpis = initiative.KPI && initiative.KPI.length > 0 ? _.sortBy(initiative.KPI, 'createdAt') : [];
          vm.initiativeOwner = initiative.owner;
          vm.initiativeDept = initiative.dept;
          vm.breadCrumb = InitiativeAdapter.getParentChain(initiativeId, false);
          processKpis();
        }
      }).finally(function() {
        $rootScope.$broadcast('HIDE_SPINNER');
      });
    };

    let initKpis = function() {
      let kpiId = $routeParams.kpiId;
      DataService.getKpiChain([kpiId]).then(function(kpis) {
        if (kpis && kpis.length > 0) {
          let kpi = _.find(kpis, {
            sno: parseInt(kpiId)
          });
          let initiativeId = kpi.initiativeId || kpi.initiative.initiativeId;
          DataService.getSkeleton(initiativeId).then(function() {
            $rootScope.$broadcast('DATA_RECEIVED');
            vm.breadCrumb = InitiativeAdapter.getParentChain(initiativeId, false) || [];
            vm.breadCrumb.push({
              name: kpi.kpi,
              sno: kpiId,
              type: 'kpi'
            });
          });
          vm.kpis = _.filter(DataService.getLocalKPIS(), {
            parentKpi: parseInt(kpiId)
          });
          processKpis();
        } else {
          $rootScope.$broadcast('DATA_RECEIVED');
        }
      }).finally(function() {
        $rootScope.$broadcast('HIDE_SPINNER');
      });
    };

    if ($routeParams.kpiId) {
      vm.isDrillDown = true;
      initKpis();
    } else {
      initInitiaveKpis();
      DataService.getSkeleton($routeParams.initiativeId).then(function() {
        $rootScope.$broadcast('DATA_RECEIVED');
      });
    }
  }

  addCards() {
    let vm = this;
    vm.location.path('/output/' + vm.routeParams.initiativeId + '/form/new/output/0');
  }

  editKPI(kpi) {
    let vm = this;
    vm.location.path('/output/' + kpi.parentInitiative.initiativeId + '/form/edit/output/' + kpi.sno);
  }

  drilldown(kpi) {
    if (kpi.hasDrillDown) {
      this.location.path('/output/' + kpi.sno);
    }
  }

  setSelectedPeriod(type) {
    this.selectedPeriod = type;
  }

  isSelectedPeriod(type) {
    return this.selectedPeriod === type;
  }

}

export default OutputController;
