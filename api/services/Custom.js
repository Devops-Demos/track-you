/**
 * Created by sohamchetan on 30/07/15.
 */
import async from 'async';
module.exports = {

  aggregators: require('./custom/Aggregators'),
  recursiveAggregators: require('./custom/RecursiveAggregators'),
  cronJobs: require('./custom/cron-jobs'),
  notifiers: require('./custom/notifiers'),
  treeUtils: require('./custom/tree-utils'),
  milestoneVerifier: require('./custom/milestoneVerifier'),
  cleaners: require('./custom/cleaners'),
  refreshCache : require('./custom/refresh-cache'),
  refreshCacheMultiple : (multipleArtifacts, originalCb) => {
    const tasks = multipleArtifacts.map(artifact => cb => Custom.refreshCache(artifact, cb));
    async.series(tasks, err =>{
      if(err){
        console.trace(err);
      }
      originalCb();
    });
  }
};
