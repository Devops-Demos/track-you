/**
 * Created by rahul on 17/09/15.
 */
class LocalStorage {
  constructor() {
    'ngInject';
    this.user = {};
    this.userRights = {};
    this.init();
  }

  init() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.populateRights();
  }

  setData(data) {
    this.user = JSON.parse(data);
  }

  getUser() {
    return this.user;
  }

  getUserId() {
    return this.user.id;
  }

  populateRights() {
    this.userRights = _.pick(this.user, 'viewAll', 'updateAllOutComeKpis', 'updateAllOutputKpis', 'updateAllIssueLogs', 'updateAllActivities',
      'updateAllExecutiveSummaries', 'crudArtifacts', 'crudUsers');
  }

  getUserName() {
    return this.user ? this.user.name : '';
  }

  getUserRights() {
    return this.userRights;
  }

  clearData() {
    this.user = {};
    this.userRights = {};
  }
}
export default LocalStorage;
