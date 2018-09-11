'use strict';

var _ = require('lodash');
var PERCENTILE_TIME = 90;
var COMPLETED = 'completed';
var ONTRACK = 'ontrack';
var DELAYED = 'delayed';
var UNKNOWN = 'unknown';

var KpiClass = function (kpi) {
  var self = this;
  self = _.assign(self, _.cloneDeep(kpi));
};

KpiClass.prototype.hasUpcomingMilestone = function () {
  var self = this,
    upcomingMilestone = Custom.aggregators.getLatestKpiMilestone(self['KPI Milestone']),
    actualValue = upcomingMilestone.actualValue;
  return (!actualValue || actualValue === '');
};

KpiClass.prototype.calculateKPIStatus = function () {

  var kpi = this;
  var statusSeparator1 = kpi.statusSeparator1;
  var statusSeparator2 = kpi.statusSeparator2;
  kpi.status = UNKNOWN;
  if (kpi.kpiType === 'output') {
    statusSeparator2 = 50.0;
    statusSeparator1 = 95.0;
  }

  if (isNaN(kpi.achievementTargetRatio) || kpi.achievementTargetRatio === null || !statusSeparator1 || !statusSeparator2) {
    return kpi;
  }
  var calculatedValue = kpi.achievementTargetRatio * 100;

  if (calculatedValue >= statusSeparator2 && calculatedValue < statusSeparator1) {
    kpi.status = ONTRACK;
  } else if (calculatedValue < statusSeparator2) {
    kpi.status = DELAYED;
  } else if (calculatedValue >= statusSeparator1) {
    kpi.status = COMPLETED;
  }

  return kpi;
};


KpiClass.prototype.hasDelayedMilestones = function () {
  var self = this,
    nearestPastMilestone = Custom.aggregators.getNearestPastKpiMilestone(self['KPI Milestone']),
    actualValue = _.result(nearestPastMilestone, 'actualValue', null);
  return (!actualValue || actualValue === '');
};

KpiClass.prototype.calculateActualPercentile = function () {
  var self = this;
  var timePeriod = new Date()
    .setDate(new Date()
      .getDate() - PERCENTILE_TIME);
  var kpiMilestones = _.chain(self['KPI Milestone'])
    .filter(function (milestone) {
      return (new Date(milestone.timePoint)
        .getTime() > new Date(timePeriod)
        .getTime());
    })
    .value();
  var actualMilestone = _.filter(kpiMilestones, function (milestone) {
    return milestone.actualValue < self.latestMilestone.actualValue;
  });
  self.percentileActual = (kpiMilestones.length > 0) ? parseFloat(((actualMilestone.length / kpiMilestones.length) * 100)
    .toFixed(2)) : 100;
  return self;
};

KpiClass.prototype.calculateKpiTargets = function () {
  var self = this;
  self.latestMilestone = Custom.aggregators.getNearestPastKpiMilestone(self['KPI Milestone']);
  self.nearestActualMilestone = Custom.aggregators.getNearestPastKpiMilestoneWithActual(self['KPI Milestone']);
  self.achievementTargetRatio = Custom.aggregators.getAchievementToTargetRatio(self);
  self = Custom.aggregators.getKpiTargets(self);
  self = self.calculateActualPercentile();
  // delete self['KPI Milestone'];
  return self;
};

KpiClass.prototype.renameKeys = function () {
  var self = this;
  self.name = self.kpi;
  delete self.kpi;
  self.type = self.kpiType;
  delete self.kpiType;
  self.id = self.sno;
  delete self.sno;
  return self;
};

module.exports = KpiClass;
