class HeaderAdapter {
  constructor(DataService, $q, $http, pushAppConstants) {
    'ngInject';

    this.DataService = DataService;
    this.$q = $q;
    this.$http = $http;
    this.pushAppConstants = pushAppConstants;
  }

  getPriority(initiativeId) {
    let initiatives = this.DataService.getInitiatives();
    if (initiatives) {
      let parent = this.getParent(initiativeId, initiatives);
      return parent;
    }
  }

  getParent(initiativeId, initiatives) {
    if (initiatives) {
      var current = _.find(initiatives, function(initiative) {
        return parseInt(initiative.initiativeId) === parseInt(initiativeId);
      });
      if (current && current.parentId === 0) {
        return current;
      } else if (current && current.parentId) {
        return this.getParent(current.parentId, initiatives);
      } else {
        return null;
      }
    }
  }
}

export default HeaderAdapter;
