class NumberChart {
  constructor(GraphService, $compile, $templateCache, $http, MainAdapter) {
    'ngInject';
    this.restrict = 'AE';
    this.template = '<div class="text-center number-container"><span class="number-val {{kpi.statusClass}}' + '-text' + '">{{actualValue}}</span><span class="f24 kpi-uom">{{data.uom}}</span></div>';
    this.scope = {
      kpi: '='
    };
    this.link = function(scope, element) {

      scope.chartNavigation = function(kpi) {
        GraphService.navigateTo(GraphService.navigationPath(kpi));
      };

      let drawChart = function() {
        scope.data = GraphService.getChartTypeValues(angular.copy(scope.kpi));
        scope.actualValue = MainAdapter.formatNumberString(scope.data.actualValue);
        $(element).on('click', function() {
          scope.chartNavigation(scope.kpi);
        });
      };

      scope.isNearestMilestone = true;
      if (GraphService.hasChart(scope.kpi, scope.isNearestMilestone)) {
        drawChart();
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

export default NumberChart;
