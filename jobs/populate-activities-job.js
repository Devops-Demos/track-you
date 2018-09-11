'use strict';

import _ from 'lodash';
import async from 'async';
import debug from 'debug';
let log = debug('cron:activity-population');

/**
 * Checks if an initative is an activity
 * @param  {object} arrayElement     Takes a JSON object representing an Initiative
 * @return {boolean}                 Returns true if object is an activity
 */
const checkActivity = (arrayElement) => (arrayElement.type === 'activity');


/**
 * Returns a JSON object of the Initiative which matches the initiativeId
 * @param  {array}  activities    JSON Object of all the initiatives
 * @param  {number} initiativeId The initiativeId required
 * @return {object}              JSON Object of the matching initiativeId
 */
const getInitiativeById = (initiatives, initiativeId) => initiatives.filter((data) => (data.initiativeId === initiativeId));


/**
 * The main function that populates the status of each initiative
 * @param  {object} activity JSON object of each activity
 */
const populateStatus = (initiatives) => function (activity) {
  const activityStatusObj = {
    completed: 0,
    delayed: 0,
    onTrack: 0
  };
  // gets the status of the activity
  const activityCount = Custom.aggregators.getActivityStatus(activity);
  // assigns value 1 to the activityStatusObj depending on the status
  activityStatusObj[activityCount] = 1;
  // parentId of the current activity
  let parentId = activity.parentId;

  // Activity's status is found and corresponding value is incremented above
  // For each parent of the Activity, the corresponding status value gets updated while going
  // from the Activity to its parent.
  // This continues until the the master is reached
  //
  // Bottom-up approach
  while (parentId >= 0) {
    const newActivity = getInitiativeById(initiatives, parentId)[0];
    if (newActivity) {
      if (_.has(newActivity, 'activityCount.onTrack') && _.has(newActivity, 'activityCount.completed') && _.has(newActivity, 'activityCount.onTrack')) {
        newActivity.activityCount.onTrack += activityStatusObj.onTrack;
        newActivity.activityCount.completed += activityStatusObj.completed;
        newActivity.activityCount.delayed += activityStatusObj.delayed;
      } else {
        newActivity.activityCount = _.clone(activityStatusObj);
      }

      // updateInitiative(newActivity.initiativeId, statusObj);

      parentId = newActivity.parentId;
    } else {
      console.error('Activity does not have a Parent : ', parentId);
      break;
    }
  }
};


const startPopulationJob = data => {
  const initiatives = _.cloneDeep(data);
  const activities = initiatives.filter(checkActivity);
  const populateActivity = populateStatus(initiatives);
  activities.forEach(populateActivity);
  return initiatives;
};

const updateInitiative = (initiativeId, activityCount) => cb => {
  log('Initiative', initiativeId, ' activityCount updating,', JSON.stringify(activityCount));
  Initiative.updateActivities(initiativeId, activityCount, () => {
    log('Initiative', initiativeId, ' activityCount updated,');
    cb();
  });
};

module.exports = () => {
  Initiative.find({
      select: ['initiativeId', 'actualEndDate', 'actualStartDate', 'plannedStartDate', 'plannedEndDate',
        'parentId', 'type'
      ]
    })
    .then(data => {
        const calculatedInitiatives = startPopulationJob(data);
        const tasks = calculatedInitiatives.filter(i => i.activityCount)
          .map(initiative => updateInitiative(initiative.initiativeId, initiative.activityCount));
        async.series(tasks, () => console.log('Acitvity population is done.'));
      },
      console.trace);
};

module.exports._test = {
  startPopulationJob
};
