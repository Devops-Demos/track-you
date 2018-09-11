'use strict';

import _ from 'lodash';
module.exports = {

  cleanInitiatives: function(initiatives, milestonePeriod) {
    var self = this;
    return _.map(initiatives, function(initiative) {
      if (initiative.type.toLowerCase() !== 'activity') {
        delete initiative.actualStartDate;
        delete initiative.actualEndDate;
        delete initiative.plannedStartDate;
        delete initiative.plannedEndDate;
      }
      delete initiative.description;
      delete initiative.details;
      delete initiative.Budget;
      delete initiative.levelOfAchievment;
      delete initiative.avgAchievmentLevel;
      delete initiative.kpiSums;
      delete initiative.priorityAchievementTargetRatio;
      initiative.KPI = self.cleanKpis(initiative.KPI, milestonePeriod);
      return initiative;
    });
  },

  cleanKpis: function(kpis, milestonePeriod) {
    // milestonePeriod = milestonePeriod || 365;
    return _.map(kpis, function(kpi) {
      if (milestonePeriod) {
        var timePeriod = new Date().setDate(new Date().getDate() - milestonePeriod);
        kpi['KPI Milestone'] = _.filter(kpi['KPI Milestone'], function(milestone) {
          return (new Date(milestone.timePoint).getTime() >= new Date(timePeriod).getTime());
        });
      }
      kpi['KPI Milestone'] = _.map(kpi['KPI Milestone'], function(milestone) {
        delete milestone.parentId;
        delete milestone.createdAt;
        delete milestone.updatedAt;
        delete milestone.initiativeId;
        return milestone;
      });
      return kpi;
    });
  }

};
