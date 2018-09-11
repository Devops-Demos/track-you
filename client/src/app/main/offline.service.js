class OfflineService {
  constructor() {
    'ngInject';

    let vm = this;
    vm.db = new loki('push-app.json', {
      autosave: true
    });
    vm.db.loadDatabase();
    if (!vm.db.getCollection('initiative')) {
      vm.db.addCollection('initiative');
    }
    if (!vm.db.getCollection('kpi')) {
      vm.db.addCollection('kpi');
    }
    if (!vm.db.getCollection('user-list')) {
      vm.db.addCollection('user-list');
    }
    if (!vm.db.getCollection('dept-list')) {
      vm.db.addCollection('dept-list');
    }
    if (!vm.db.getCollection('offline-request')) {
      vm.db.addCollection('offline-request');
    }
    if (!vm.db.getCollection('owned-initiative')) {
      vm.db.addCollection('owned-initiative');
    }
    if (!vm.db.getCollection('participating-initiatives')) {
      vm.db.addCollection('participating-initiatives');
    }
  }

  clearLocalData() {
    let vm = this,
      clearOffline = ['initiative', 'kpi', 'user-list', 'offline-request', 'dept-list', 'owned-initiative',
        'participating-initiatives'];
    _.each(clearOffline, function(collection) {
      let removeData = vm.db.getCollection(collection);
      removeData.removeDataOnly();
    });
  }

  clearBeforeSync() {
    let vm = this,
      clearOffline = ['initiative', 'kpi', 'user-list', 'dept-list'];
    _.each(clearOffline, function(collection) {
      let removeData = vm.db.getCollection(collection);
      removeData.removeDataOnly();
    });
  }

  isDataSynced() {
    let vm = this;
    return vm.db.getCollection('offline-request').data.length > 0;
  }

  upsert(collectionName, object, idColumn) {
    let collection = this.db.getCollection(collectionName);
    let searchObject = {};
    searchObject[idColumn] = object[idColumn];
    let result = collection.find(searchObject);
    if (result && result.length > 0) {
      result = _.merge(object, result[0]);
      this.db.getCollection(collectionName).update(result);
    } else {
      this.db.getCollection(collectionName).insert(object);
    }
  }

  createOffline(object) {
    this.db.getCollection('offline-request').insert(object);
  }

  removeObj(object) {
    this.db.getCollection('offline-request').remove(object);
  }

  remove(collectionName, idColumn, id) {
    let collection = this.db.getCollection(collectionName);
    let deleteObject = {};
    deleteObject[idColumn] = id;
    let result = collection.find(deleteObject);
    this.db.getCollection(collectionName).remove(result);
  }

  getcollection(collectionName) {
    return this.db.getCollection(collectionName).chain().data();
  }

}

export default OfflineService;
