'use strict';


const mocktree = require('./mocktree.json');
const populateActivities = require('../../jobs/populate-activities-job');


describe('populateActivities',function(){
  it('should have number of activities equal to sum of activityCounts in master',function(){
    const result = populateActivities._test.startPopulationJob(mocktree);
    const master = result.filter((data) => (data.initiativeId === 0))[0];
    const totalActivities = mocktree.filter((data) => (data.type === 'activity')).map(Custom.aggregators.getActivityStatus).filter(a => (a !== 'unknown')).length;
    const totalMaster = master.activityCount.completed + master.activityCount.delayed + master.activityCount.onTrack;

    expect(totalMaster).to.equal(totalActivities);
  });

  it('should have master.activityCount undefined if there are no activities',function(){
    const notActivities = mocktree.filter((data) => (data.type !== 'activity'));
    const result = populateActivities._test.startPopulationJob(notActivities);
    const master = result.filter((data) => (data.initiativeId === 0))[0];

    expect(master.activityCount).to.equal(undefined);
  });

  it('should return same object without any change if activity parentid doesnot exist',function(){
    var activity = [{
      'initiativeId':24,
      'parentId':345,
      'initiative':'activity',
      'type':'activity'
    }];
    // parentid 345 doesnot exist
    const result = populateActivities._test.startPopulationJob(activity);
    expect(result).to.deep.equal(activity);
  });

});
