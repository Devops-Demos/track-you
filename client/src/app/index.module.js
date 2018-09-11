import config from './index.config';

import routerConfig from './index.route';

import constant from './index.constant';

import runBlock from './index.run';

import MainController from './main/main.controller';
import IssuesController from './components/issues/issues.controller';
import OutcomeController from './components/outcome/outcome.controller';
import SummaryController from './components/summary/summary.controller';
import InitiativeController from './components/initiative/initiative.controller';
import HeaderController from './components/header/header.controller';
import LoginController from './components/login/login.controller';
import OutputController from './components/output/output.controller';
import SearchController from './components/search/search.controller';
import ForgotPasswordController from './components/forgot-password/forgot-password.controller';
import UserController from './components/admin/users/user.controller';
import ResetPasswordController from './components/reset-password/reset-password.controller';
import KpiFormController from './components/forms/kpi-form/kpi-form.controller';
import PostponeController from './components/admin/postpone/postpone.controller';
import InitiativeFormController from './components/forms/initiative/initiative-form.controller';
import ActivityFormController from './components/forms/activity/activity-form.controller';
import SyncController from './components/sync/sync.controller';
import NoSupportController from './components/no-support/no-support.controller';
import EmailController from './components/email/email.controller';
import UploadMilestoneController from './components/upload-milestone/upload-milestone.controller';
import DownloadTemplateController from './components/download-template/download-template.controller';

import Breadcrumb from './components/breadcrumb/breadcrumb.directive';
import Rtl from './main/rtl.directive';

import DataService from './main/data.service';
import AuthService from './main/auth.service';
import HighChartService from './main/highchart.service';
import OfflineService from './main/offline.service';
import UserAdapter from './components/admin/users/user.adapter';
import FormService from './main/forms.service';
import LocalStorage from './main/local-storage.service';
import TranslateLoader from './main/translate.loader.factory';

import HeaderAdapter from './components/header/header.adapter';
import InitiativeAdapter from './components/initiative/initiative.adapter';
import MainAdapter from './main/main.adapter';
import SearchAdapter from './components/search/search.adapter';
import GraphService from './components/graphs/graph.service';

import SpeedometerChart from './components/graphs/speedometer-chart.directive';
import NumberChart from './components/graphs/number-chart.directive';
import LineChart from './components/graphs/line-chart.directive';
import DialChart from './components/graphs/dial-chart.directive';
import PieChart from './components/graphs/pie-chart.directive';
import Chart from './components/graphs/chart.directive';
import DisableControl from './components/forms/disable-control.directive';
import DateValidatorHack from './components/forms/activity/date-validator-hack.directive';
import DropdownNameMapper from './components/forms/dropdown-name-mapper.directive';
import RoundOffInput from './components/forms/round-off.directive';
import InputFile from './components/upload-milestone/input-file.directive';

import Highlight from './components/search/highlight.filter';
import Pagination from './components/forms/kpi-form/pagination.filter';
import MathCeil from './components/forms/kpi-form/math.ceil.filter';

angular.module('pushApp', ['ngRoute', 'dibari.angular-ellipsis', 'ui.grid', 'ui.grid.pagination', 'ngSanitize',
    'ngTouch', 'rt.asyncseries', 'pascalprecht.translate', 'ngAnimate', 'isteven-multi-select'])
  .config(config)

.config(routerConfig)

.constant('pushAppConstants', constant())

.run(runBlock)

.service('DataService', DataService)
  .service('AuthService', AuthService)
  .service('HighChartService', HighChartService)
  .service('HeaderAdapter', HeaderAdapter)
  .service('InitiativeAdapter', InitiativeAdapter)
  .service('SearchAdapter', SearchAdapter)
  .service('MainAdapter', MainAdapter)
  .service('UserAdapter', UserAdapter)
  .service('FormService', FormService)
  .service('OfflineService', OfflineService)
  .service('LocalStorage', LocalStorage)
  .service('GraphService', GraphService)
  .factory('TranslateLoader', ($http, $q) => new TranslateLoader($http, $q))

.controller('MainController', MainController)
  .controller('NoSupportController', NoSupportController)
  .controller('IssuesController', IssuesController)
  .controller('OutcomeController', OutcomeController)
  .controller('SummaryController', SummaryController)
  .controller('HeaderController', HeaderController)
  .controller('LoginController', LoginController)
  .controller('InitiativeController', InitiativeController)
  .controller('IssuesController', IssuesController)
  .controller('OutputController', OutputController)
  .controller('SearchController', SearchController)
  .controller('ForgotPasswordController', ForgotPasswordController)
  .controller('UserController', UserController)
  .controller('ResetPasswordController', ResetPasswordController)
  .controller('InitiativeFormController', InitiativeFormController)
  .controller('KpiFormController', KpiFormController)
  .controller('PostponeController', PostponeController)
  .controller('ActivityFormController', ActivityFormController)
  .controller('SyncController', SyncController)
  .controller('EmailController', EmailController)
  .controller('UploadMilestoneController', UploadMilestoneController)
  .controller('DownloadTemplateController', DownloadTemplateController)

.filter('highlight', ($sce) => new Highlight($sce))
  .filter('startFrom', () => new Pagination())
  .filter('ceilFilter', () => new MathCeil())

.directive('breadcrumb', () => new Breadcrumb())
  .directive('disableControl', () => new DisableControl())
  .directive('dropdownNameMapper', ($translate) => new DropdownNameMapper($translate))
  .directive('numberChart', (GraphService, $compile, $templateCache, $http, MainAdapter) => new NumberChart(
    GraphService, $compile, $templateCache, $http, MainAdapter))
  .directive('speedometerChart', (HighChartService, pushAppConstants, MainAdapter, GraphService, $compile,
    $templateCache, $http) => new SpeedometerChart(HighChartService, pushAppConstants, MainAdapter, GraphService,
    $compile, $templateCache, $http))
  .directive('pieChart', (HighChartService, $location, $rootScope) => new PieChart(HighChartService,
    $location, $rootScope))
  .directive('lineChart', (HighChartService, pushAppConstants, MainAdapter, GraphService, $compile, $templateCache,
    $http, $translate) => new LineChart(HighChartService, pushAppConstants, MainAdapter, GraphService, $compile,
    $templateCache, $http, $translate))
  .directive('dialChart', (HighChartService, pushAppConstants, GraphService, $compile, $templateCache, $http,
    $translate) => new DialChart(HighChartService, pushAppConstants, GraphService, $compile, $templateCache,
    $http, $translate))
  .directive('chart', ($compile, $templateCache, $http, GraphService) => new Chart($compile,
    $templateCache, $http, GraphService))
  .directive('rtl', () => new Rtl())
  .directive('dateValidatorHack', () => new DateValidatorHack())
  .directive('roundOff', () => new RoundOffInput())
  .directive('fileread', () => new InputFile());
