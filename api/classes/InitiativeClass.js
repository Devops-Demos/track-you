/**
 * Created by sohamchetan on 04/09/15.
 */
'use strict';
import isNumber from 'isnumber';

var _ = require('lodash'),
  config = require('../../app-config/model-config.json'),
  KpiClass = require('./KpiClass');

var InitiativeClass = function (initiative) {

  var self = this;
  self = _.assign(self, _.cloneDeep(initiative));
  //self.activitiesWithStatus = {};
  // self.convertDates();
  if (self.type === 'activity') {
    self.status = Custom.aggregators.getActivityStatus(self);
  }
  if (!self.type || self.type === '') {
    self.type = 'initiative';
  }

};

InitiativeClass.prototype.nestData = function () {
  var self = this,
    nestedPairs = DataUtils.getNestedPairs(config);
  self = DataUtils.generateNestedData(nestedPairs)(self);
};

InitiativeClass.prototype.convertDates = function () {
  var self = this;
  self.plannedStartDate = DataUtils.transformDate(self.plannedStartDate);
  self.plannedEndDate = DataUtils.transformDate(self.plannedEndDate);
  self.actualStartDate = DataUtils.transformDate(self.actualStartDate);
  self.actualEndDate = DataUtils.transformDate(self.actualEndDate);
};

InitiativeClass.prototype.calculateKpiRatio = function () {
  var self = this;

  if (self.isPartOfJob) {
    const ratios = self.KPI.map(kpi => kpi.achievementTargetRatio);
    self.KpiAchievementToTarget = (_.sum(ratios) / ratios.length);
    return;
  }

  if (isNumber(self.priorityAchievementTargetRatio)) {
    self.KpiAchievementToTarget = parseFloat(self.priorityAchievementTargetRatio);
    delete self.priorityAchievementTargetRatio;
    return;
  }
};

InitiativeClass.prototype.calculateInitiativeStatus = function () {
  var self = this,
    activityCount;
  if (self.type !== 'activity') {
    activityCount = _.clone(self.activityCount);
    if (activityCount) {
      delete activityCount.createdAt;
      delete activityCount.updatedAt;
      delete activityCount.initiativeId;
      delete activityCount.id;
    }
    self.status = Custom.aggregators.getInitiativeStatus(self.KpiAchievementToTarget, activityCount);
  } else {
    self.status = Custom.aggregators.getActivityStatus(self);
  }
};

InitiativeClass.prototype.calculateKpiTargets = function () {
  var self = this;
  self.KPI = _.map(self.KPI, function (eachKpi) {
    return (new KpiClass(eachKpi))
      .calculateKpiTargets();
  });
};

InitiativeClass.prototype.getDaysDelayed = function () {
  var self = this;
  if (self.type !== 'activity') {
    return;
  }
  self.daysDelayed = Custom.aggregators.numberOfDaysDelayed(self, new Date());
};

InitiativeClass.prototype.completesThisWeek = function () {
  var self = this,
    oneDay = 86400000,
    plannedEndDate = new Date(self.plannedEndDate),
    today = new Date(),
    daysLeft = (plannedEndDate - today) / oneDay;
  return (daysLeft > 0 && daysLeft < 7);
};

InitiativeClass.prototype.aggregate = function () {
  var self = this;
  self.convertDates();
  self.KPI = _.cloneDeep(self.KPI);
  self.calculateKpiTargets();
  self.calculateKpiRatio();
  self.getDaysDelayed();

  //after all calculations are made, get status of initiative
  self.calculateInitiativeStatus();

  self.removeUserPasswordData();
  delete self['KPI Milestone'];
  return self;
};

InitiativeClass.prototype.aggregateForJob = function () {
  var self = this;
  self.convertDates();
  self.calculateKpiTargets();
  self.calculateKpiRatio();

  delete self['KPI Milestone'];
  return self;
};

InitiativeClass.prototype.hasOwner = function (ownerId) {
  var self = this;
  return self.owner && self.owner.id === ownerId;
};

InitiativeClass.prototype.getWeightedKpiAchievementToTargetRatio = function () {
  var self = this,
    kpisWithMilestones = _.filter(self.KPI, function (eachKpi) {
      return (_.isObject(eachKpi.nearestActualMilestone)); //(eachKpi['KPI Milestone'] && eachKpi['KPI Milestone'].length > 0);
    })
    .length;
  return {
    ratio: self.KpiAchievementToTarget,
    weight: kpisWithMilestones
  };
};

InitiativeClass.prototype.removeUserPasswordData = function () {
  var self = this;

  if (typeof self.owner === 'object') {
    delete self.owner.password;
    delete self.owner.tempPassword;
    delete self.owner.isPasswordReset;
  }

  return self;
};

InitiativeClass.prototype.getKpiSums = function () {
  var self = this,
    kpis = self.KPI,
    sumNulls = Custom.aggregators.sumNulls,
    baselines = _.pluck(kpis, 'baseline'),
    lastTargets = _.pluck(kpis, 'target'),
    actuals = kpis.map(function (kpi) {
      return kpi.nearestActualMilestone ? kpi.nearestActualMilestone.actualValue : null;
    }),
    targets = kpis.map(function (kpi) {
      return kpi.latestMilestone ? kpi.latestMilestone.targetValue : null;
    });
  self.kpiSums = {
    baseline: sumNulls(baselines),
    target: sumNulls(targets),
    lastTarget: sumNulls(lastTargets),
    actual: sumNulls(actuals)
  };
  return self;
};


module.exports = InitiativeClass;
