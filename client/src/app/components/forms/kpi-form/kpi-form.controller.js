class KpiFormController {
  constructor($rootScope, $routeParams, MainAdapter, DataService, FormService, $location, LocalStorage, $translate) {
    'ngInject';

    let vm = this;
    let userRights = LocalStorage.getUserRights();
    vm.translationHolder = ['OUTPUT_KPI', 'OUTCOME_KPI', 'INITIATIVE', 'PRIORITY', 'FORM.LINE',
      'FORM.DIAL', 'FORM.BIG_NUMBER', 'FORM.SPEEDOMETER', 'FORM.SAVE_KPI', 'FORM.ADD_KPI',
      'FORM.SHOULD_HAVE_AT_LEAST_ONE_CHILD_KPI',
      'FORM.SUM_CHILD_KPI_BASELINE_EQUALS_PARENT_KPI_BASELINE',
      'FORM.SUM_CHILD_KPI_TARGET_EQUALS_PARENT_KPI_TARGET', 'FORM.SYNC_THE_REQUEST_ONCE_ONLINE',
      'FORM.UPDATED_SUCCESSFULLY', 'FORM.DELETED_SUCCESSFULLY', 'FORM.ADDED_SUCCESSFULLY',
      'FORM.SOMETHING_WENT_WRONG', 'CARD.MILESTONE', 'FORM.PERCENTAGE', 'FORM.PERCENTILE', 'FORM.NUMBER', 'FORM.SEPARATOR_ERROR', 'FORM.TARGET_MISMATCH_ERROR'
    ];
    vm.isEdit = ($routeParams.formStatus === 'edit');
    vm.currentPage = 0;
    vm.isOutput = $routeParams.kpiType === 'output';
    vm.btnSpinner = false;
    let milestoneObj = {
      timePoint: null,
      targetValue: null,
      actualValue: null,
      deleted: false
    };
    let childKpiObj = {
      kpi: null,
      initiativeId: null,
      baseline: null,
      target: null,
      kpiType: null,
      deleted: false
    };
    vm.kpiData = {
      kpi: null,
      baseline: null,
      target: null,
      uom: null,
      initiativeId: null,
      isCalculated: false,
      kpiType: null,
      deleted: false,
      fom: null
    };
    vm.isLastLevelInitiative = false;
    vm.errorModel = false;
    vm.totalChildKpi = [angular.copy(childKpiObj)];
    vm.totalMilestones = [angular.copy(milestoneObj)];
    vm.baselineMsg = '';
    vm.targetMsg = '';
    vm.hasChildren = false;
    vm.parentKpi = null;

    DataService.getSkeleton($routeParams.initiativeId).then(function() {
      $rootScope.$broadcast('DATA_RECEIVED');
    });

    let hideSpinner = function() {
      $rootScope.$broadcast('HIDE_SPINNER');
    };

    let init = function() {
      if (vm.isOutput) {
        DataService.getInitiativeTree($routeParams.initiativeId).then(function(initiatives) {
          vm.childInitiatives = _.filter(initiatives, function(initiative) {
            return (initiative.type.toLowerCase() === 'initiative' && initiative.parentId === parseInt(
              $routeParams.initiativeId));
          });
        });
      }

      if (!vm.isEdit) {
        if (!userRights.crudArtifacts && !userRights.updateAllOutputKpis && !userRights.updateAllOutComeKpis) {
          $location.path('/landing');
        }
        DataService.getSingleInitiative($routeParams.initiativeId, false, true).then(function(initiatives) {
          vm.isLastLevelInitiative = !initiatives.hasChildren;
          vm.current = initiatives;
          vm.initiative = vm.current ? vm.current.initiative : '';
          vm.kpiData.initiativeId = vm.current ? vm.current.initiativeId : '';
          vm.milestonesNotDeleted = _.where(vm.totalMilestones, {
            'deleted': false
          }).length;
          if (!vm.isOutput) {
            vm.kpiData.parentKpi = $routeParams.sno;
            vm.isLastLevelInitiative = false;
          }
          if (vm.kpiData.parentKpi && vm.kpiData.parentKpi !== '0' && vm.kpiData.parentKpi !== null) {
            DataService.getKpi(vm.kpiData.parentKpi).then(function(data) {
              vm.parentKpi = data ? data.kpi : null;
            }).finally(function() {
              hideSpinner();
            });
          } else {
            hideSpinner();
          }
        });
      } else {
        vm.deleteCheck = true;
        DataService.getSingleInitiative($routeParams.initiativeId, false, true).then(function(initiative) {
          if (!userRights.crudArtifacts && !userRights.updateAllOutputKpis && !userRights.updateAllOutComeKpis &&
            !initiative.isEditable) {
            $location.path('/landing');
          }
          vm.current = initiative;
          vm.initiative = vm.current.initiative;
          vm.kpiData = _.where(vm.current.KPI, {
            'sno': parseInt($routeParams.sno)
          })[0];

          if (vm.kpiData.linkKpi && !vm.isOutput) {
            vm.editLinkKpiData = _.find(vm.linkKpis, function(kpi) {
              return kpi.sno === vm.kpiData.linkKpi;
            });
          }
          vm.isChildKpi = vm.kpiData.parentKpi === 0 || vm.kpiData.parentKpi === null ? false : true;
          vm.kpiData.target = parseFloat(vm.kpiData.target);
          vm.kpiData.baseline = parseFloat(vm.kpiData.baseline);
          vm.kpiData['KPI Milestone'] = _.forEach(vm.kpiData['KPI Milestone'], function(milestone) {
            milestone.timePoint = new Date(milestone.timePoint);
            milestone.actualValue = parseFloat(milestone.actualValue);
            milestone.targetValue = parseFloat(milestone.targetValue);
            milestone.deleted = false;
          });

          if (vm.kpiData.parentKpi && vm.kpiData.parentKpi !== '0' && vm.kpiData.parentKpi !== null) {
            DataService.getKpi(vm.kpiData.parentKpi).then(function(data) {
              vm.parentKpi = data.kpi;
            });
          }

          FormService.getChildKpis(parseInt($routeParams.sno)).then(function(childKpis) {
            vm.totalChildKpi = _.chain(childKpis).map(function(eachKpi) {
              if (eachKpi.initiativeId) {
                eachKpi.initiativeId = eachKpi.initiativeId.initiativeId;
              }
              return eachKpi;
            }).sortBy(function(kpi) {
              return kpi.createdAt;
            }).value();

            if (!vm.isOutput) {
              vm.isLastLevelInitiative = false;
            } else {
              vm.isLastLevelInitiative = vm.childInitiatives && vm.childInitiatives.length > 0 ? false :
                true;
            }

            vm.hasChildren = vm.totalChildKpi.length > 0 ? true : false;
            vm.totalChildKpi = _.forEach(vm.totalChildKpi, function(childKpi) {
              childKpi.target = parseFloat(childKpi.target);
              childKpi.baseline = parseFloat(childKpi.baseline);
              childKpi.deleted = false;
            });
            if (vm.kpiData.isCalculated) {
              vm.totalMilestones = [];
            } else {
              vm.totalMilestones = _.sortBy(angular.copy(vm.kpiData['KPI Milestone']), 'timePoint').reverse();
              vm.milestonesNotDeleted = _.where(vm.totalMilestones, {
                'deleted': false
              }).length;
            }
            if (!vm.kpiData.widget) {
              vm.kpiData.widget = vm.isOutput ? 'speedometer' : 'line';
            }
            vm.kpiData = _.omit(vm.kpiData, 'KPI Milestone');
          }).finally(function() {
            hideSpinner();
          });
        });
      }
    };

    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
      vm.kpiLabel = vm.isOutput ? vm.translations.OUTPUT_KPI : vm.translations.OUTCOME_KPI;
      vm.widgets = [vm.translations['FORM.DIAL'], vm.translations['FORM.BIG_NUMBER'], vm.translations['FORM.SPEEDOMETER']];
      vm.parentLabel = vm.isOutput ? vm.translations.INITIATIVE : vm.translations.PRIORITY;
      vm.widgets = _.sortBy(vm.widgets);
      vm.buttonName = vm.isEdit ? vm.translations['FORM.SAVE_KPI'] : vm.translations['FORM.ADD_KPI'];
      init();
    });

    //TODO: Refactor method
    vm.addKpi = function() {
      vm.btnSpinner = true;
      let reqObj = {};
      vm.baselineMsg = '';
      vm.targetMsg = '';
      vm.errorMsg = '';
      vm.actualMsg = '';
      reqObj.kpiType = $routeParams.kpiType;
      if (!vm.isEdit) {
        vm.kpiData.kpiType = $routeParams.kpiType;
        reqObj.kpiData = vm.kpiData;
        reqObj.childKpis = _.forEach(vm.totalChildKpi, function(child) {
          child.kpiType = $routeParams.kpiType;
          if (!vm.isOutput) {
            child.initiativeId = $routeParams.initiativeId;
          }
        });
        reqObj.kpiMilestones = _.chain(angular.copy(vm.totalMilestones)).forEach(function(milestone) {
          milestone.timePoint = MainAdapter.convertDateMmDdYyyy(milestone.timePoint);
        }).filter({
          'deleted': false
        }).value();
      } else {
        reqObj.kpiMilestones = _.chain(angular.copy(vm.totalMilestones)).forEach(function(milestone) {
          milestone.timePoint = MainAdapter.convertDateMmDdYyyy(milestone.timePoint);
        }).reject(function(milestone) {
          return !milestone.sno && milestone.deleted;
        }).value();
        vm.kpiData.initiativeId = vm.kpiData.parentInitiative ? vm.kpiData.parentInitiative.initiativeId : vm.kpiData
          .initiativeId;
        delete vm.kpiData.parentInitiative;
        reqObj.kpiData = vm.kpiData;
        vm.totalChildKpi = _.forEach(vm.totalChildKpi, function(child) {
          child.kpiType = $routeParams.kpiType;
          if (!vm.isOutput) {
            child.initiativeId = $routeParams.initiativeId;
          }
        });
        reqObj.childKpis = vm.totalChildKpi;
      }

      vm.separatorMsg = '';
      if (reqObj.kpiType.toLowerCase() === 'outcome') {
        if (reqObj.kpiData.statusSeparator1 < reqObj.kpiData.statusSeparator2) {
          vm.separatorMsg = vm.translations['FORM.SEPARATOR_ERROR'];
        }
      }
      vm.targetMismatchError = '';
      let lastMilestone = _.chain(reqObj.kpiMilestones).filter({
        deleted: false
      }).sortBy(function(milestone) {
        return new Date(milestone.timePoint);
      }).value().reverse();
      if (lastMilestone[0] && (!reqObj.kpiData.isCalculated) && Math.round(reqObj.kpiData.target * 100) / 100 !== Math.round(lastMilestone[0].targetValue * 100) / 100) {
        vm.targetMismatchError = vm.translations['FORM.TARGET_MISMATCH_ERROR'];
      }
      if (!vm.hasChildren) {
        _.each(reqObj.childKpis, function(childkpi) {
          childkpi.deleted = true;
        });
        vm.kpiData.isCalculated = false;
      }
      if (reqObj.kpiData.isCalculated && vm.hasChildren) {
        vm.errorMsg = (reqObj.childKpis && reqObj.childKpis.length === 0) ? vm.translations[
          'FORM.SHOULD_HAVE_AT_LEAST_ONE_CHILD_KPI'] : '';
        if (vm.kpiData.baseline !== _.chain(vm.totalChildKpi).filter(function(milestone) {
            return !milestone.deleted;
          }).pluck('baseline').sum().value()) {
          vm.baselineMsg = vm.translations['FORM.SUM_CHILD_KPI_BASELINE_EQUALS_PARENT_KPI_BASELINE'];
        } else {
          vm.baselineMsg = '';
        }
        if (vm.kpiData.target !== _.chain(vm.totalChildKpi).filter(function(milestone) {
            return !milestone.deleted;
          }).pluck('target').sum().value()) {
          vm.targetMsg = vm.translations['FORM.SUM_CHILD_KPI_TARGET_EQUALS_PARENT_KPI_TARGET'];
        } else {
          vm.targetMsg = '';
        }
      }

      if (reqObj.kpiData.isCalculated) {
        reqObj.kpiMilestones = [];
      }

      reqObj.childKpis = _.map(reqObj.childKpis, function(kpi) {
        kpi.statusSeparator1 = reqObj.kpiData.statusSeparator1;
        kpi.statusSeparator2 = reqObj.kpiData.statusSeparator2;
        return kpi;
      });

      if (vm.baselineMsg === '' && vm.targetMsg === '' && vm.errorMsg === '' && vm.actualMsg === '' && vm.separatorMsg === '' && vm.targetMismatchError === '') {
        DataService.postData(reqObj, 'upsert-kpi').then(function(res) {
          vm.afterRequest(res, (vm.isEdit ? 'edit' : 'add'));
        });
      } else {
        vm.errorModel = true;
      }

    };

    vm.deleteKpi = function() {
      vm.btnSpinner = true;
      DataService.deleteData('kpi/' + vm.kpiData.sno).then(function(res) {
        vm.afterRequest(res, 'delete');
      });
    };

    vm.afterRequest = function(res, type) {
      if (res && res.isOffline) {
        vm.statusMsg = vm.translations['FORM.SYNC_THE_REQUEST_ONCE_ONLINE'];
      } else if (res && res.status && res.status.toLowerCase() === 'error') {
        vm.isError = true;
        vm.statusMsg = res.message;
      } else {
        let msg = {
          'add': res ? vm.kpiLabel + ' ' + vm.translations['FORM.ADDED_SUCCESSFULLY'] : vm.translations[
            'FORM.SOMETHING_WENT_WRONG'],
          'edit': res ? vm.kpiLabel + ' ' + vm.translations['FORM.UPDATED_SUCCESSFULLY'] : vm.translations[
            'FORM.SOMETHING_WENT_WRONG'],
          'delete': res ? vm.kpiLabel + ' ' + vm.translations['FORM.DELETED_SUCCESSFULLY'] : vm.translations[
            'FORM.SOMETHING_WENT_WRONG']
        };
        vm.statusMsg = msg[type];
      }
      vm.deleteModel = false;
      vm.statusModel = true;
      vm.btnSpinner = true;
    };

    vm.addMilestone = function() {
      vm.currentPage = 0;
      vm.totalMilestones.unshift(angular.copy(milestoneObj));
      vm.milestonesNotDeleted = _.where(vm.totalMilestones, {
        'deleted': false
      }).length;
    };

    vm.addChildKpi = function() {
      vm.totalChildKpi.push(angular.copy(childKpiObj));
    };

    vm.deleteMilestone = function(milestone) {
      milestone.deleted = true;
      vm.milestonesNotDeleted = _.where(vm.totalMilestones, {
        'deleted': false
      }).length;
      if (this.currentPage !== 0 && this.milestonesNotDeleted % 5 === 0) {
        this.currentPage -= 1; //go to previous page if it is the only element in current page
      }
    };

    vm.deleteChildKpi = function(index) {
      vm.totalChildKpi[index].deleted = true;
    };

    vm.editChild = function(childKpi) {
      $location.path('/output/' + childKpi.initiativeId + '/form/edit/' + childKpi.kpiType.toLowerCase() + '/' +
        childKpi.sno);
    };

    vm.update = function() {
      vm.editLinkKpiData = false;
    };

  }

}

export default KpiFormController;
