class LineChart {
  constructor(HighChartService, pushAppConstants, MainAdapter, GraphService, $compile, $templateCache, $http, $translate) {
    'ngInject';

    let vm = this;

    vm.template = '<div></div>';
    vm.restrict = 'AE';
    vm.scope = {
      kpi: '=',
      view: '=',
      isRtl: '='
    };

    vm.link = function(scope, element) {
      let kpis,
        translationHolder = ['ACTUAL', 'TARGET', 'DELTA', 'DATE', 'FINAL_TARGET'],
        translations;
      scope.isLastMilestone = false;
      scope.chartNavigation = function(kpi) {
        GraphService.navigateTo(GraphService.navigationPath(kpi));
      };

      let draw = function(data) {
        let highObject = HighChartService.getLineChart();
        data.actual = _.map(data.actual, function(kpi) {
          return _.omit(kpi, 'color');
        });
        highObject.yAxis.plotLines = [{
          value: Math.round(scope.kpi.target),
          color: pushAppConstants.statusColor.unknown,
          dashStyle: 'dot',
          width: 2,
          zIndex: 4,
          label: {
            useHTML: true,
            align: 'right',
            style: {
              fontSize: 10
            },
            text: translations.FINAL_TARGET + ': ' + Math.round(scope.kpi.target),
            x: 0,
            y: 10
          }
        }];
        highObject.xAxis.labels = {
          formatter: function() {
            return data.timepoint[this.value];
          }
        };
        highObject.tooltip = {
          headerFormat: '',
          useHTML: true,
          formatter: function() {
            var tooltipVal = '';
            if (!scope.kpi.showChildren && (this.series.name === translations.ACTUAL)) {
              tooltipVal = translations.ACTUAL + ': ' + MainAdapter.formatNumberString(this.y) + '<br>' + translations.DELTA + ': ' + MainAdapter.formatNumberString(MainAdapter.roundOffToNDecimals(data.target[0].data[this.x] - this.y, 0));
            } else if (!scope.kpi.showChildren && (this.series.name === translations.TARGET)) {
              tooltipVal = translations.TARGET + ': ' + MainAdapter.formatNumberString(this.y);
              if (!_.isNull(scope.kpi.rollingAvg) && !_.isUndefined(scope.kpi.rollingAvg)) {
                tooltipVal = tooltipVal + '<br>' + translations.ROLLING_AVG + ': ' + MainAdapter.formatNumberString(Math.round(scope.kpi.rollingAvg));
              }
            } else {
              tooltipVal = MainAdapter.formatNumberString(this.y);
            }
            return tooltipVal;
          }
        };
        if (scope.isRtl) {
          highObject.tooltip.style = {
            direction: 'rtl'
          };
        }
        highObject.yAxis = highObject.yAxis || {};
        if(scope.kpi.target < 0){
          var minTargetPoint = _.min(data.target[0].data);
          highObject.yAxis.min = scope.kpi.target < minTargetPoint ? scope.kpi.target - 10 : minTargetPoint - 10;
        }else{
          highObject.yAxis.min = _.min(data.actual[0].data) >= 0 && _.min(data.target[0].data) >= 0 ? 0 : null;  
        }
        
        highObject.yAxis.labels = {
          formatter: function() {
            return MainAdapter.formatNumberString(this.value);
          }
        };
        highObject.xAxis.title = {
          text: translations.DATE
        };
        highObject.yAxis.title = {
          text: scope.kpi.uom
        };

        highObject.series = [{
          name: translations.ACTUAL,
          data: data.actual[0].data,
          color: pushAppConstants.chart.line.actualColor,
          url: data.actual[0].url
        }, {
          name: translations.TARGET,
          data: data.target[0].data,
          color: pushAppConstants.chart.line.targetColor,
          url: data.target[0].url
        }, {
          name: 'Goal',
          type: 'scatter',
          marker: {
            enabled: false
          },
          showInLegend: false,
          data: [Math.round(scope.kpi.target)]
        }];
        highObject.plotOptions = {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function() {
                  let self = this;
                  _.each(this.series.chart.options.series, function(series) {
                    if (self.series.name === series.name) {
                      GraphService.navigateTo(series.url);
                    }
                  });
                }
              }
            }
          }
        };

        if (scope.kpi) {
          $(element).on('click', function() {
            scope.chartNavigation(scope.kpi);
          });
        }

        setTimeout(function() {
          $(element).highcharts(highObject);
        }, 0);
      };

      if (scope.kpi) {
        kpis = [scope.kpi];

        if (GraphService.hasChart(scope.kpi, scope.view, scope.isLastMilestone)) {
          $translate(translationHolder).then(function(response) {
            translations = response;
            draw(GraphService.getMultiKpiGraphData(kpis, scope.view));
          });
        } else {
          $http.get('app/components/graphs/no-data.html', {
            cache: $templateCache
          }).then(function(response) {
            let template = $compile(response.data)(scope);
            element.empty().append(template);
          });
        }
      }
    };
  }
}

export default LineChart;
