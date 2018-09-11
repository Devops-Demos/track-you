/* globals Fuse */
class SearchController {
  constructor($scope, SearchAdapter, $log, $location, $rootScope, $translate) {
    'ngInject';
    let vm = this;
    vm.$log = $log;
    vm.$location = $location;
    vm.translationHolder = ['OUTCOME_KPI', 'SEARCH.INITIATIVES_/_SUB_INITIATIVES', 'OUTPUT_KPI', 'ACTIVITIES',
      'FORM.OWNER', 'SEARCH.ENTER_SEARCH_QUERY'
    ];
    $translate(vm.translationHolder).then(function(translations) {
      vm.translations = translations;
      $rootScope.$broadcast('DATA_RECEIVED');
      init();
    });
    let init = function() {
      vm.results = {};
      vm.queryString = '';
      vm.SearchAdapter = SearchAdapter;
      vm.searchFilters = SearchAdapter.getSearchFilters();
      vm.$scope = $scope;
      vm.keysToBeSearched = {};
      vm.$rootScope = $rootScope;
      if (vm.isOnline) {
        vm.getSearchResults = () => null;
      } else {
        vm.getSearchResults = vm.doLiveSearch;
        vm.fuseInit();
      }
      $rootScope.$broadcast('HIDE_SPINNER');
    };
  }

  isOnline() {
    return navigator.onLine;
  }

  fuseInit() {
    let vm = this;
    vm.data = vm.SearchAdapter.getSearchData();
    vm.fuseData = vm.SearchAdapter.populateSearchData(vm.data);
    vm.fuse = new Fuse(vm.fuseData, {
      caseSensitive: false,
      includeScore: false,
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 2000,
      maxPatternLength: 32,
      keys: ['name']
    });
  }

  getDisplayNames(name) {
    let vm = this;
    let displayNamesMap;
    if (vm.translations) {
      displayNamesMap = {
        'Outcome KPI': vm.translations.OUTCOME_KPI,
        'Initiatives/ Sub Initiatives': vm.translations['SEARCH.INITIATIVES_/_SUB_INITIATIVES'],
        'Output KPI': vm.translations.OUTPUT_KPI,
        'Activities': vm.translations.ACTIVITIES,
        'Owners': vm.translations['FORM.OWNER']
      };
    }
    return displayNamesMap[name] ? displayNamesMap[name] : name;
  }

  navigateTo(filter, resultObj) {
    let vm = this;
    switch (filter) {
      case 'Output KPI':
        vm.$location.path('/initiative/' + resultObj.initiativeId + '/output');
        break;
      case 'Outcome KPI':
        vm.$location.path('/initiative/' + resultObj.initiativeId + '/outcome/' + resultObj.parentKpi);
        break;
      default: //for activities and initiative/sub initiatives and owners
        if (resultObj.parentId) {
          vm.$location.path('/initiative/' + resultObj.parentId);
        } else {
          vm.$location.path('/landing');
        }
    }
    vm.$rootScope.$broadcast('SHOW_SPINNER');
  }

  searchOnline() {
    let vm = this;
    vm.$rootScope.$broadcast('SHOW_SPINNER');
    vm.populateUniqueKeys();
    vm.SearchAdapter.getResultsFromServer(vm.queryString, vm.keysToBeSearched.keys).then(function(res) {
      vm.results = vm.SearchAdapter.transformOnlineData(res.data);

      vm.highlightQueryString = vm.queryString;
    }).finally(function() {
      vm.$rootScope.$broadcast('HIDE_SPINNER');
    });
  }

  populateUniqueKeys() {
    this.keysToBeSearched.keys = _.chain(this.searchFilters).filter({
      value: true
    }).pluck('name').uniq().value();
  }

  doLiveSearch() {
    let vm = this;
    vm.highlightQueryString = vm.queryString;
    vm.populateUniqueKeys();
    vm.results = _.chain(vm.fuse.search(vm.queryString)).filter(function(result) {
      return _.includes(vm.keysToBeSearched.keys, result.type);
    }).groupBy('type').value();
  }
}
export default SearchController;
