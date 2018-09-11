  class Chart {
    constructor($compile, $templateCache, $http, GraphService) {
      'ngInject';

      let vm = this;
      vm.template = '<div></div>';
      vm.restrict = 'AE';
      vm.scope = {
        kpi: '=',
        view: '=',
        isRtl: '='
      };

      vm.chartMappings = {
        'dial': 'dial-chart',
        'speedometer': 'speedometer-chart',
        'bignumber': 'number-chart'
      };

      vm.link = function(scope, element) {

        scope.chartNavigation = function(kpi) {
          GraphService.navigateTo(GraphService.navigationPath(kpi));
        };

        let draw = function() {
          if (scope.kpi) {
            scope.view = scope.view || 'current';
            let chartType;
            if (scope.view === 'current') {
              chartType = vm.chartMappings[scope.kpi.widget] ? vm.chartMappings[scope.kpi.widget] : 'speedometer-chart';
            } else {
              chartType = 'line-chart';
            }
            let chart = $compile('<div style="width:100%;" class="chart-wrap"' + chartType + ' data-kpi="kpi", data-view="view", data-is-rtl="isRtl"' + ' ></div>')(scope);
            element.empty().append(chart);
            $(window).trigger('resize');
          } else {
            $http.get('app/components/graphs/no-data.html', {
              cache: $templateCache
            }).then(function(response) {
              let template = $compile(response.data)(scope);
              element.empty().append(template);
            });
          }
        };

        scope.$watch('kpi', draw);
        scope.$watch('view', draw);
      };
    }
  }

  export default Chart;
