class DialChart {
  constructor(HighChartService, pushAppConstants, GraphService, $compile, $templateCache, $http, $translate) {
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
      let translationHolder = ['ACTUAL'],
        translations;
      scope.chartNavigation = function(kpi) {
        GraphService.navigateTo(GraphService.navigationPath(kpi));
      };

      let drawChart = function() {
        let highObject = HighChartService.getDialChart();
        let color = [0],
          actual = [];

        let data = GraphService.getChartTypeValues(angular.copy(scope.kpi));

        color[1] = pushAppConstants.statusColor[scope.kpi.statusClass];
        actual[0] = data.actualValue;
        highObject.yAxis.stops = [color];
        highObject.yAxis.min = 0;
        highObject.yAxis.max = 100;
        highObject.tooltip = {
          headerFormat: '',
          useHTML: true,
          pointFormat: translations.ACTUAL + ': ' + data.actualValue + ' ' + data.uom
        };
        if (scope.isRtl) {
          highObject.tooltip.style = {
            direction: 'rtl'
          };
        }
        let dataLabelHtml;
        if (data.uom) {
          dataLabelHtml = '<div style="text-align:center"><span class="f24" style="color:' + color[1] + '">' + data.actualValue + '<span class="f12 dial-unit"> ' + data.uom + '</span></span>';
        } else {
          dataLabelHtml = '<div style="text-align:center"><span class="f24" style="color:' + color[1] + '">' + data.actualValue + '</span>';
        }
        let dataval = scope.kpi.achievementTargetRatio * 100;
        actual[0] = dataval;
        highObject.series = [{
          name: 'Actual',
          data: actual,
          dataLabels: {
            format: dataLabelHtml
          }
        }];

        $(element).on('click', function() {
          scope.chartNavigation(scope.kpi);
        });

        setTimeout(function() {
          $(element).highcharts(highObject);
        }, 0);

      };

      if (scope.kpi.nearestActualMilestone) {
        $translate(translationHolder).then(function(response) {
          translations = response;
          drawChart();
        });
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

export default DialChart;
