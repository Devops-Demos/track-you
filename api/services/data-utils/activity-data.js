'use strict';

// import InitiativeClass from ''
import InitiativeClass from '../../classes/InitiativeClass';
import _ from 'lodash';

var removeKey = function(initiativeObj){
  const removeList = ['Executive Summary','KPI','Issues','Budget','KPI Milestone','Risk'];
  _.forEach(removeList,(value)=>{
    //if key exists, delete it
    if(_.has(initiativeObj,value)){
      delete initiativeObj[value];
    }
  });

  if(_.has(initiativeObj, 'owner.password')) {
    delete initiativeObj.owner.password;
  }
  if(_.has(initiativeObj, 'owner.tempPassword')) {
    delete initiativeObj.owner.tempPassword;
  }
  if(_.has(initiativeObj, 'owner.initiatives')) {
     delete initiativeObj.owner.initiatives;
  }

  return initiativeObj;
};

module.exports = {

  getActivity: function(activityId){
    const activityData = Initiative.find({select:['owner','type','initiativeId',
    'parentId','initiative','plannedStartDate','plannedEndDate','actualStartDate',
    'actualEndDate'],where:{initiativeId: activityId}})
    .populate('owner')
    .then((data)=>{
      const newInitiative = new InitiativeClass(data[0]);
      newInitiative.convertDates();
      newInitiative.getDaysDelayed();

      // Keys that need to be removed from the generated JSON
      const cleanedActivity = removeKey(newInitiative);

      return JSON.stringify(cleanedActivity);
    });
    return activityData;
  },

  removeKeyTest: function(initiativeObj){
    return removeKey(initiativeObj);
  }
};
