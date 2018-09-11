'use strict';

var _ = require('lodash'),
  InitiativeClass = require('../../classes/InitiativeClass'),
  KpiClass = require('../../classes/KpiClass'),

  formEmailData = function(initiatives) {
    var returnData = {
      activities: {
        delayed: [],
        upcoming: []
      },
      kpis: {
        delayed: [],
        upcoming: []
      }
    };
    initiatives.forEach(function(eachInitiative) {
      var initiative = new InitiativeClass(eachInitiative);
      initiative.aggregate();
      if (initiative.type === 'activity' && initiative.status === 'delayed') {
        returnData.activities.delayed.push(initiative);
      } else if (initiative.type === 'activity' && initiative.completesThisWeek()) {
        returnData.activities.upcoming.push(initiative);
      }
      initiative.KPI.forEach(function(eachKpi) {
        var kpi = new KpiClass(eachKpi);
        if (kpi.hasDelayedMilestones()) {
          returnData.kpis.delayed.push(kpi);
        } else if (kpi.hasUpcomingMilestone()) {
          returnData.kpis.upcoming.push(kpi);
        }
      });
    });
    return returnData;
  };
module.exports = {

  sendActivityNotification: function(user) {
    var initiativeIds = _.pluck(user.initiatives, 'initiativeId'),
      emailData;
    return new Promise(function(fullfill, reject) {
      Initiative.find({
          initiativeId: initiativeIds
        })
        .populateAll()
        .then(function(initiatives) {
            emailData = formEmailData(initiatives);
            fullfill(emailData);
          },reject);
    });

  },
  //
  // sendKpiNotification: function(user) {

  // }

};
