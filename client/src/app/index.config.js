function config($logProvider, $httpProvider, $translateProvider) {
  'ngInject';

  if (window.matchMedia) {
    var mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener(function() {
      $('.kpi__chart, .chart-wrap').each(function() {
        var w = $(this)[0].offsetWidth,
        h = $(this)[0].offsetHeight;
        if ($(this).highcharts()) {
          var chart = $(this).highcharts();
          chart.setSize(w,h,false);
        }
      });
      $('.activity__chart').each(function() {
        $(this).highcharts().reflow();
      });
    });
  }

  $logProvider.debugEnabled(true);
  $httpProvider.interceptors.push(function($q, $location, LocalStorage, OfflineService, $rootScope, $injector) {
    var timer;
    var handleSessionExpire = function() {
      var DataService = $injector.get('DataService');
      var AuthService = $injector.get('AuthService');
      localStorage.removeItem('user');
      localStorage.setItem('forced', true);
      DataService.clearMemory();
      AuthService.logout().then(function() {
        $location.path('/login');
      });
    };
    return {
      response: function(response) {
        if (response.data.status === 'error') {
          if (response.data.message === 'User not Authenticated.') {
            handleSessionExpire();
          }
        }
        return response;
      },
      responseError: function(rejection) {
        if (rejection.status === 403) {
          handleSessionExpire();
        }
        $rootScope.$broadcast('HIDE_SPINNER');
        return $q.reject(rejection);
      },
      request: function(config) {
        var AuthService = $injector.get('AuthService');
        var DataService = $injector.get('DataService');
        config.timeout = 10000;
        clearTimeout(timer);
        if (AuthService.isLoggedIn()) {
          timer = setTimeout(function() {
            if (navigator.onLine) {
              if (window.confirm('Session is about to expire, to stay in session click ok and to logout click cancel')) {
                DataService.getCurrentVersion();
              }else{
                handleSessionExpire();
              }
            }
          }, 1000 * 60 * 25);
        }
        return config;
      }
    };
  });

  $translateProvider.preferredLanguage('en');
  $translateProvider.useLoader('TranslateLoader');
  $translateProvider.fallbackLanguage('en');
  $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
}

export default config;
