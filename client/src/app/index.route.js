function routerConfig($routeProvider) {
  'ngInject';

  $routeProvider
    .when('/summary/:initiativeId', {
      templateUrl: 'app/components/summary/summary.html',
      name: 'summary'
    })
    .when('/initiative/:initiativeId', {
      templateUrl: 'app/components/initiative/initiative.html',
      name: 'initiative'
    })
    .when('/initiative/:initiativeId/form/:formStatus', {
      templateUrl: 'app/components/forms/initiative/initiative.html',
      name: 'initiativeForm'
    })
    .when('/output/:initiativeId/form/:formStatus/:kpiType/:sno', {
      templateUrl: 'app/components/forms/kpi-form/kpi-form.html',
      name: 'outputKpiForm'
    })
    .when('/initiative/:initiativeId/output', {
      templateUrl: 'app/components/output/output.html',
      name: 'output'
    })
    .when('/output/:kpiId', {
      templateUrl: 'app/components/output/output.html',
      name: 'output'
    })
    .when('/initiative/:initiativeId/form/:formStatus/:priority', {
      templateUrl: 'app/components/forms/initiative/initiative.html',
      name: 'initiativeForm'
    })
    .when('/activity/:initiativeId/form/:formStatus', {
      templateUrl: 'app/components/forms/activity/activity.html',
      name: 'activityForm'
    })
    .when('/issues/:initiativeId', {
      templateUrl: 'app/components/issues/issues.html',
      name: 'initiative'
    })
    .when('/initiative/:initiativeId/outcome/:kpiId', {
      templateUrl: 'app/components/outcome/outcome.html',
      name: 'outcome'
    })
    .when('/login', {
      templateUrl: 'app/components/login/login.html',
      name: 'login'
    })
    .when('/search', {
      templateUrl: 'app/components/search/search.html',
      name: 'search'
    })
    .when('/forgot-password', {
      templateUrl: 'app/components/forgot-password/forgot-password.html',
      name: 'forgotPassword'
    })
    .when('/admin/users', {
      templateUrl: 'app/components/admin/users/users.html',
      name: 'admin'
    })
    .when('/reset-password', {
      templateUrl: 'app/components/reset-password/reset-password.html',
      name: 'resetPassword'
    })
    .when('/landing', {
      templateUrl: 'app/components/initiative/initiative.html',
      name: 'landing'
    })
    .when('/sync', {
      templateUrl: 'app/components/sync/sync.html',
      name: 'sync'
    })
    .when('/postponePriority/:initiativeId', {
      templateUrl: 'app/components/admin/postpone/postpone.html',
      name: 'postponePriority'
    })
    .when('/no-support', {
      templateUrl: 'app/components/no-support/no-support.html'
    })
    .otherwise({
      redirectTo: '/landing'
    });
}

export default routerConfig;
