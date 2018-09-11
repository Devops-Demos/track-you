class Breadcrumb {
  constructor() {
    'ngInject';
    this.templateUrl = 'app/components/breadcrumb/breadcrumb.html';
    this.restrict = 'AE';
    this.scope = {
      crumbs: '=',
      isRtl: '='
    };
    this.link = function(scope) {
      scope.breadCrumb = {};
      scope.breadCrumb.isOpen = false;
      scope.lastItem = _.last(scope.crumbs);
      scope.crumbs = _.map(scope.crumbs, function(crumb) {
        if (crumb.type) {
          crumb.url = (crumb.type.toLowerCase() === 'kpi') ? '#/output/' + crumb.sno : '#/initiative/' + crumb.sno;
        }
        return crumb;
      });
    };
  }
}
export default Breadcrumb;
