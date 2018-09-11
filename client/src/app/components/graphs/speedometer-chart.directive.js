class SpeedometerChart {
  constructor(HighChartService, pushAppConstants, MainAdapter, GraphService, $compile, $templateCache, $http) {
    'ngInject';

    let vm = this;

    vm.constants = pushAppConstants;

    vm.template = '<div></div>';
    vm.restrict = 'AE';
    vm.scope = {
      initiative: '=',
      kpi: '=',
      view: '='
    };

    vm.link = function(scope, element) {
      scope.isNearestMilestone = true;
      scope.chartNavigation = function(kpi) {
        GraphService.navigateTo(GraphService.navigationPath(kpi));
      };
      let draw = function() {
        let triangleColor = function(value) {
          if (markerPositions[0] === value) {
            return 'triangle-blue';
          } else if (markerPositions[1] === value) {
            return 'triangle-green';
          }
        };

        let guageColor = function(value) {
          if (scope.initiative) {
            return (value < 50) ? 'delayed-text' : (value < 95) ? 'on-track-text' : 'completed-text';
          } else {
            return scope.kpi.statusClass + '-text';
          }
        };

        let getUnit = function() {
          return '%';
        };

        let highObject = HighChartService.getGaugeChart();
        let minVal = 0,
          maxVal = 119.999999,
          markerPositions,
          plotBandRanges;

        if (scope.initiative) {
          scope.actual = scope.initiative.KpiAchievementToTarget ? parseFloat((scope.initiative.KpiAchievementToTarget * 100).toFixed(2)) : 0;
          plotBandRanges = [0, 50, 95, 119.999999];
          markerPositions = [50, 95];
        } else {
          if (scope.kpi.kpiType.toLowerCase() === 'output') {
            scope.kpi.statusSeparator2 = 50;
            scope.kpi.statusSeparator1 = 95;
          }
          markerPositions = [scope.kpi.statusSeparator2, scope.kpi.statusSeparator1];
          if(scope.kpi.achievementTargetRatio === 'Infinity'){
            scope.actual = 110;  
          }else {
            scope.actual = scope.kpi.achievementTargetRatio ? parseFloat((scope.kpi.achievementTargetRatio * 100).toFixed(2)) : 0;  
          }
          plotBandRanges = [0, scope.kpi.statusSeparator2, scope.kpi.statusSeparator1, maxVal];
        }

        highObject.yAxis = [{
          min: minVal,
          max: maxVal,
          lineColor: 'transparent',
          tickPositions: markerPositions,
          tickLength: 0,
          minorTickLength: 0,
          labels: {
            distance: 0,
            useHTML: true,
            rotation: 'auto',
            formatter: function() {
              if (!_.isNaN(this.value)) {
                return '<div class="' + triangleColor(this.value) + '"></div><div class="triangle__label">' + MainAdapter.formatNumberString(this.value) + getUnit() + '</div>';
              } else {
                return '';
              }
            }
          },
          plotBands: [{
            from: plotBandRanges[0],
            to: plotBandRanges[1],
            color: vm.constants.statusColor.delayed,
            thickness: '30%'
          }, {
            from: plotBandRanges[1],
            to: plotBandRanges[2],
            color: vm.constants.statusColor.ontrack,
            thickness: '30%'

          }, {
            from: plotBandRanges[2],
            to: plotBandRanges[3],
            color: vm.constants.statusColor.completed,
            thickness: '30%'
          }]
        }];
        highObject.tooltip = {
          enabled: false
        };
        highObject.series = [{
          data: [scope.actual],
          overshoot: -5,
          dataLabels: {
            useHTML: true,
            formatter: function() {
              let guageValue = 0;
              if(scope.kpi && scope.kpi.achievementTargetRatio === 'Infinity'){
                guageValue = '> 100%';
              }else{
                guageValue = MainAdapter.formatNumberString(scope.actual) + getUnit();
              }
              return '<div class="gauge-data-format ' + guageColor(MainAdapter.formatNumberString(scope.actual)) + '">' + guageValue + '</div>';
            }
          }
        }];
        if (scope.kpi) {
          $(element).on('click', function() {
            scope.chartNavigation(scope.kpi);
          });
        }

        setTimeout(function() {
          $(element).highcharts(highObject);
        }, 0);

      };

      if (scope.kpi && GraphService.hasChart(scope.kpi, scope.view, scope.isNearestMilestone)) {
        draw();
      } else if (scope.initiative) {
        draw();
      } else {
        $http.get('app/components/graphs/no-data.html', {
          cache: $templateCache
        }).then(function(response) {
          let template = $compile(response.data)(scope);
          element.empty().append(template);
        });
      }

    };
  }
}

export default SpeedometerChart;
