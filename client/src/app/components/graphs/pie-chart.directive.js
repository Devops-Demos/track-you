class PieChart {
  constructor(HighChartService, $location, $rootScope) {
    'ngInject';

    this.restrict = 'AE';
    this.scope = {
      value: '=',
      id: '=',
      hasChild: '='
    };
    this.link = function(scope, element) {
      scope.navigateTo = function(path) {
        $location.path(path);
      };

      if (Object.keys(scope.value).length > 0) {
        let highObject = HighChartService.getPieChart();
        highObject.plotOptions.series.events = {
          click: function() {
            if (!navigator.onLine && !scope.hasChild) {
              $rootScope.$broadcast('ONLINE_REQUIRED');
            } else {
              scope.navigateTo('/initiative/' + scope.id);
            }
          }
        };
        let initObject = {
          'onTrack': 0,
          'completed': 0,
          'delayed': 0
        };
        let dataObject = _.assign(initObject, scope.value);
        let foundHighObj = [];
        Object.keys(dataObject).forEach(function(key) {
          if (dataObject[key]) {
            foundHighObj = _.filter(highObject.series[0].data, {
              'name': key
            });
            if (foundHighObj.length > 0) {
              foundHighObj[0].y = parseFloat(dataObject[key]);
            }
          } else {
            highObject.series[0].data = _.reject(highObject.series[0].data, function(datum) {
              return datum.name === key;
            });
          }
        });
        $(element).highcharts(highObject);
      }
    };
  }
}

export default PieChart;
