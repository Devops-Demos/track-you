/**
 * Created by sohamchetan on 30/07/15.
 */
'use strict';

import isNumber from 'isnumber';

var moment = require('moment'),
  _ = require('lodash'),
  activityKeyword = 'activity',
  InitiativeClass = require('../../classes/InitiativeClass');

const classifyRatio = (ratio, limits) => {
  const {lower, upper} = limits;
  ratio = parseFloat(ratio);
  if (isNaN(ratio)) {
    return 3;
  }
  if (ratio < lower) {
    return 0;
  }
  if (ratio >= lower && ratio < upper) {
    return 1;
  }
  if (ratio >= upper) {
    return 2;
  }
  return 3;
};

module.exports = {
  getKpiAvg: function(milestones) {
    var sum = 0,
      length = 0;

    _.each(milestones, function(milestone) {
      if (milestone !== undefined && !isNaN(milestone.targetValue) && !isNaN(milestone.actualValue) && Number(milestone.targetValue) !== 0) {
        sum += (Number(milestone.actualValue) / Number(milestone.targetValue));
        length += 1;
      }
    });
    return sum / length;
  },

  getLatestKpiMilestone: function(milestones) {
    var nearestFutureMilestone,
      nearestPastMilestone,
      currentDate = moment(new Date());
    _.each(milestones, function(milestone) {
      var milestoneDate = moment(new Date(milestone.timePoint));
      if (currentDate > milestoneDate && (nearestPastMilestone === undefined || milestoneDate > moment(new Date(nearestPastMilestone.timePoint)))) {
        nearestPastMilestone = _.clone(milestone);
      }
      if (currentDate <= milestoneDate && (nearestFutureMilestone === undefined || milestoneDate < moment(new Date(nearestFutureMilestone.timePoint)))) {
        nearestFutureMilestone = _.clone(milestone);
      }
    });

    return nearestFutureMilestone || nearestPastMilestone;
  },

  getNearestPastKpiMilestone: function(milestones) {
    var nearestPastMilestone,
      currentDate = moment(new Date());
    _.each(milestones, function(milestone) {
      var milestoneDate = moment(new Date(milestone.timePoint));
      if (currentDate > milestoneDate && (nearestPastMilestone === undefined || milestoneDate > moment(new Date(nearestPastMilestone.timePoint)))) {
        nearestPastMilestone = _.clone(milestone);
      }
    });

    return nearestPastMilestone || {};
  },
  getNearestPastKpiMilestoneWithActual: function(milestones) {
    var nearestPastMilestone,
      currentDate = moment(new Date());
    _.each(milestones, function(milestone) {
      var milestoneDate = moment(new Date(milestone.timePoint)),
        hasActual = (!isNaN(milestone.actualValue) && milestone.actualValue !== null);
      if (currentDate > milestoneDate && (nearestPastMilestone === undefined || milestoneDate > moment(new Date(nearestPastMilestone.timePoint))) && hasActual) {
        nearestPastMilestone = _.clone(milestone);
      }
    });

    return nearestPastMilestone;
  },

  getAchievementToTargetRatio: function(kpi) {
    if (!(_.isObject(kpi) && _.isObject(kpi.latestMilestone) && _.isObject(kpi.nearestActualMilestone) && !isNaN(parseFloat(kpi.baseline)) && !isNaN(parseFloat(kpi.target)))) {
      return null;
    }
    var baseline = parseFloat(kpi.baseline),
      targetValue = parseFloat(kpi.latestMilestone.targetValue || kpi.nearestActualMilestone.targetValue) - baseline,
      actualValue = parseFloat(kpi.nearestActualMilestone.actualValue) - baseline,
      isInverted = false, //(Number(kpi.baseline) > Number(kpi.target)),
      ratio = isInverted ? targetValue / actualValue : actualValue / targetValue;
    if (Math.abs(ratio) === Infinity) {
      return 'Infinity';
    }
    if (!isNumber(targetValue) || !isNumber(actualValue)) {
      return null;
    }
    if (targetValue === 0 && actualValue === 0) {
      return 1;
    }
    return ratio;
  },

  getKpiAveragePerformaceTargetRatio: function(Kpis) {
    var self = this;
    var ratios = _.map(Kpis, self.getAchievementToTargetRatio),
      sanitizedRatios = DataUtils.sanitize.removeNulls(ratios);
    if (sanitizedRatios.length === 0) {
      return null;
    }
    return _.sum(sanitizedRatios) / sanitizedRatios.length;
  },

  getActivityStatusAmount: function(allInitiatives, currentInitiativeId) {

    var initiatives = _.filter(allInitiatives, {
        parentId: currentInitiativeId,
        type: activityKeyword
      }),
      activityGroups = _.groupBy(initiatives, 'status');
    _.each(Object.keys(activityGroups), function(status) {
      activityGroups[status] = activityGroups[status].length;
    });
    return activityGroups;
  },

  classifyInitiative: function(data) {
    var eachData = _.cloneDeep(data);
    eachData.parentId = eachData.parentId || 0;
    if (eachData.parentId === 0) {
      eachData.type = 'priority';
    }
    eachData.type = eachData.type === '' ? 'initiative' : eachData.type;
    return eachData;
  },

  getInitiativeStatus: (kpiRatio, activityDistribution) => {
    const statuses = ['delayed', 'onTrack', 'completed', 'unknown'];
    const statusMatrix = [
      [0, 0, 0, 0],
      [0, 1, 1, 1],
      [0, 1, 2, 2],
      [0, 1, 2, 3]
    ];
    const limits = {
      upper: 0.95,
      lower: 0.5
    };
    const delayedActivities = activityDistribution ? activityDistribution.Delayed || activityDistribution.delayed || 0 : 0;
    let currentDelayed = delayedActivities / _.sum(_.map(activityDistribution));
    if ((isNaN(currentDelayed) || currentDelayed === null) && (isNaN(kpiRatio) || kpiRatio === null)) {
      return statuses[3];
    }

    currentDelayed = isNaN(currentDelayed) || currentDelayed === null ? 0 : currentDelayed;
    const currentOnTrack = 1 - currentDelayed;
    kpiRatio = isNaN(kpiRatio) || kpiRatio === null ? 1 : kpiRatio;

    const statusNumber = statusMatrix[classifyRatio(kpiRatio, limits)][classifyRatio(currentOnTrack, limits)];
    return statuses[statusNumber];
  },

  getLastKpiMilestone: function(milestones) {
    var last;

    _.each(milestones, function(milestone) {
      last = last || milestone;
      var date1 = new Date(last.timePoint),
        date2 = new Date(milestone.timePoint);

      last = date2 > date1 ? milestone : last;
    });

    return last;
  },

  getKpiTargets: function(kpi) {
    var lastActualMilestone = kpi.nearestActualMilestone || {},
      lastTargetMilestone = kpi.latestMilestone || {},
      lastMilestone = this.getLastKpiMilestone(kpi['KPI Milestone']) || {};

    kpi.targetBenchmarks = {
      currentTarget: Number(lastTargetMilestone.targetValue),
      actual: Number(lastActualMilestone.actualValue),
      lastTarget: Number(lastMilestone.targetValue)
    };

    kpi.calculateKPIStatus();

    return kpi;
  },

  getActivityStatus: function(activity) {
    var psd = new Date(activity.plannedStartDate || 'invalid'),
      ped = new Date(activity.plannedEndDate || 'invalid'),
      asd = new Date(activity.actualStartDate || 'invalid'),
      aed = new Date(activity.actualEndDate || 'invalid'),
      current = new Date(),
      isValidDate = function(date) {
        return date.toString()
            .toLowerCase() !== 'invalid date';
      };
    if (!isValidDate(psd) || psd > current) {
      if (isValidDate(aed) && aed < current) {
        return 'completed';
      }
      if (isValidDate(asd) && asd < current) {
        return 'onTrack';
      }
      return 'unknown';
    }
    if (isValidDate(aed) && aed <= current) {
      return 'completed';
    }
    if ((current > psd && !isValidDate(asd)) || (isValidDate(ped) && ped < current)) {
      return 'delayed';
    }
    return 'onTrack';

  },


  numberOfDaysDelayed: function(initiative, today) {
    var current,
      plannedStartDate,
      plannedEndDate,
      oneDay,
      daysBetween;
    if (initiative.status !== 'delayed') {
      return 0;
    }
    current = new Date(today);
    plannedStartDate = new Date(initiative.plannedStartDate);
    plannedEndDate = new Date(initiative.plannedEndDate);
    oneDay = 86400000;
    daysBetween = function(day1, day2) {
      return Math.round((day1 - day2) / oneDay);
    };

    if (current > plannedEndDate && (typeof initiative.actualStartDate === 'string') && initiative.actualStartDate.toLowerCase() !== 'invalid date') {
      return daysBetween(current, plannedEndDate);
    }
    return daysBetween(current, plannedStartDate);
  },

  activitiesThisWeek: function(activities) {
    var activitiesThisWeek = [];
    activities.forEach(function(eachActivity) {
      var activity = new InitiativeClass(eachActivity);
      activity.convertDates();
      if (activity.completesThisWeek()) {
        activitiesThisWeek.push(activity);
      }
    });
    return activitiesThisWeek;
  },

  sumNulls: function(data) {
    var sanitizedData = DataUtils.sanitize.removeNulls(data);
    return sanitizedData.length === 0 ? null : _.sum(sanitizedData);
  },

  assignParticipants: (initiative, participants) => {
    if (!Array.isArray(participants)) {
      return initiative;
    }
    participants.forEach(participant => {
      const {type, id} = participant;
      if (type === 'add') {
        initiative.participants.add(id);
      }
      if (type === 'remove') {
        initiative.participants.remove(id);
      }
    });
    return initiative;
  },

  assignEvidence: (initiative, evidence) => {
    if (!Array.isArray(evidence)) {
      return initiative;
    }
    evidence.forEach(eachEvidence => {
      const {type, sno} = eachEvidence;
      if (type === 'add') {
        initiative.evidence.add(eachEvidence);
      }
      if (type === 'remove') {
        initiative.evidence.remove(sno);
      }
    });
    return initiative;
  },

  generateEvidenceUpdates: evidence => evidence
    .filter(e => (e.sno && e.type === 'update'))
    .map(e => Evidence.update({
      sno: e.sno
    }, e)),

  generateFutureMilestoneQuery: kpis => kpis.map(({sno}) => {

  })

};
