/**
 * Created by sohamchetan on 03/08/15.
 */
'use strict';
var _ = require('lodash'),
  KpiClass = require('../../classes/KpiClass');

import isNumber from 'isnumber';

var populateActivities = function (initiative, allInitiatives) {
  var childInitiatives = _.filter(allInitiatives, {
    parentId: initiative.initiativeId
  });
  if (initiative.type === 'activity') {
    var status = Custom.aggregators.getActivityStatus(initiative),
      obj = {};
    obj[status] = 1;
    return obj;
  }
  var activities = initiative.activitiesWithStatus || {
    completed: 0,
    delayed: 0,
    onTrack: 0
  };

  var addTo = function (oldActivity, newActivity) {
    _.each(Object.keys(newActivity), function (eachKey) {
      oldActivity[eachKey] = oldActivity[eachKey] || 0;
      oldActivity[eachKey] += newActivity[eachKey];
    });
  };
  _.each(childInitiatives, function (eachChildInitiative) {
    addTo(activities, populateActivities(eachChildInitiative, allInitiatives));
  });
  initiative.activitiesWithStatus = activities;
  Initiative.updateActivities(initiative.initiativeId, activities, function () {
    // console.log('activities of initiative ', initiative.initiativeId, ' are updated');
  });
  // console.log('activities for id:', initiative.initiativeId, 'after', activities);
  return _.clone(activities);
};

var startActivityPopulationJob = function () {
  Initiative.find({}, function (err, data) {
    var master = _.filter(data, {
      type: 'master'
    })[0];
    Custom.recursiveAggregators.populateActivities(master, data);
  });
};

var calculateKpiFromChildren = function (kpi, allKpis) {
  const currentSno = parseInt(kpi.sno);
  const parentKpi = parseInt(kpi.parentKpi);
  if (kpi.isCalculated !== true || parentKpi === currentSno) {
    return {
      baseline: kpi.baseline,
      target: kpi.target
    };
  }
  var childKpis = _.filter(allKpis, eachKpi => (parseInt(eachKpi.parentKpi) === currentSno)),
    childKpiSums = _.map(childKpis, function (eachKpi) {
      return calculateKpiFromChildren(eachKpi, allKpis);
    });

  kpi.baseline = _.sum(_.pluck(childKpiSums, 'baseline'));
  kpi.target = _.sum(_.pluck(childKpiSums, 'target'));
  kpi.finishedCalculation = true;

  // console.log('log:',childKpiSums);
  return {
    baseline: kpi.baseline,
    target: kpi.target
  };
};

var startKpiCalculationJob = function () {
  console.log('Job:Kpi Calculation Job');
  return Artifact2.find({
      select: ['sno', 'baseline', 'target', 'isCalculated', 'parentKpi']
    })
    .then(function (kpiData) {
      kpiData.forEach(function (eachKpi) {
        if (eachKpi.finishedCalculation || eachKpi.isCalculated !== true) {
          return;
        }
        calculateKpiFromChildren(eachKpi, kpiData);
      });
      _.filter(kpiData, {
          finishedCalculation: true
        })
        .forEach(function (eachKpi) {
          Artifact2.update({
            sno: eachKpi.sno
          }, {
            baseline: eachKpi.baseline,
            target: eachKpi.target
          }, function (err, data) {
            if (err) {
              console.log(err);
            }
            //console.log('KPI with sno:', data[0].sno, ' updated');
          });
        });

    });
};

var startAchievementToTargetJob = function () {
  // console.log('Job:Achievement to Target Job');
  var priorities,
    findChildIds = function (ids) {
      priorities = ids;
      var promises = [];
      ids.forEach(function (id) {
        promises.push(Custom.treeUtils.getChildInitiativeIds([id.initiativeId]));
      });
      return Promise.all(promises);
    },
    findKpis = function (initiativeIdArray) {
      //  console.log('Child Initiatives : ', initiativeIdArray);
      var promises = [];
      initiativeIdArray.forEach(function (initiativeIds) {
        // console.log('log:',initiativeIds);
        promises.push(Artifact2.find({
            initiativeId: initiativeIds,
            kpiType: 'output'
          })
          .populate('KPI Milestone'));
      });
      return Promise.all(promises);
    },
    returnKpiRatios = function (kpis) {
      // console.log('---showing ratios---');
      kpis = _.filter(kpis, function (kpi) {
        return kpi.isCalculated !== true;
      });
      kpis = kpis.map(function (kpi) {
        kpi = (new KpiClass(kpi))
          .calculateKpiTargets();
        return kpi;
      });
      return Custom.aggregators.getKpiAveragePerformaceTargetRatio(kpis);
    },
    convertRatiosToValues = function (weightedRatios) {
      var ratioxLength = 0,
        totalLength = 0;
      weightedRatios.forEach(function (eachRatio) {
        if (isNaN(eachRatio.ratio) || isNaN(eachRatio.weight) || eachRatio.weight === null || eachRatio.ratio === null) {
          return;
        }
        ratioxLength += eachRatio.ratio * eachRatio.weight;
        totalLength += eachRatio.weight;
      });
      if (Number(ratioxLength) === 0 || Number(totalLength) === 0) {
        return null;
      }
      // console.log('rlx - tlx ', ratioxLength, totalLength);
      return ratioxLength / totalLength;
    },
    updatePriorityKpiAchievementRatios = function (KpisArray) {
      KpisArray = KpisArray.map(returnKpiRatios);

      var promises = [];
      priorities.forEach(function (priority, i) {
        if (!isNaN(KpisArray[i])) {
          promises.push(
            Initiative.update({
              initiativeId: priority.initiativeId
            }, {
              priorityAchievementTargetRatio: KpisArray[i]
            }));
        }
      });
      return Promise.all(promises);
    };

  return Initiative.find({
      type: 'priority',
      select: ['initiativeId']
    })
    .then(findChildIds)
    //TODO
    .then(findKpis)
    .then(updatePriorityKpiAchievementRatios)
    .then(function (priorities) {
      // console.log('Priority achievement to target ratio updated for :', _.map(priorities, function(priority) {
      //   return priority[0] ? 'id: ' + priority[0].initiativeId + ', ratio: ' + priority[0].priorityAchievementTargetRatio : '? ';
      // }));
    }, console.trace);
};



var updateCalculatedKpi = function (calculatedKpi) {

  return Artifact2.find({
      parentKpi: String(calculatedKpi.sno)
    })
    .populateAll()
    .then(function (childKpis) {
      // console.log('Child Kpis : ',childKpis);
      var childKpiLength = childKpis.length,
        milestones = _.flatten(_.pluck(childKpis, 'KPI Milestone'));
      var findSumOfOutputKpiMilestones = findSumOfOutcomeKpiMilestones;
      var updatedMilestones = findSumOfOutputKpiMilestones(milestones, childKpiLength);
      _.map(updatedMilestones, function (updatedMilestone) {
        updatedMilestone.initiativeId = calculatedKpi.initiativeId;
        updatedMilestone.parentId = calculatedKpi.sno;
      });
      return Artifact6.destroy({
          initiativeId: calculatedKpi.initiativeId,
          parentId: calculatedKpi.sno
        })
        .then(function () {
          return Artifact6.create(updatedMilestones)
            .then(function (test) {
              // console.log('Calculate KPI: ', calculatedKpi.sno,test);
            });
        });
    });

};

var startKpiTargetJob = function (allKpis) {
  var calculatedKpis = _.filter(allKpis, eachKpi => eachKpi.isCalculated);


  var getKpiTargets = function (kpi) {
    if (kpi.isCalculated) {
      return getAvgMilestoneOfChildren(kpi.sno);
    }
    return (new KpiClass(kpi))
      .calculateKpiTargets()
      .targetBenchmarks;
  };

  var getAvgMilestoneOfChildren = function (sno) {
    var children = _.filter(allKpis, {
        parentKpi: String(sno)
      }),
      kpiTargets = children.map(getKpiTargets),
      allMilestones = _.flatten(_.pluck(children, 'KPI Milestone')),
      returnedTarget = {
        currentTarget: 0,
        actual: 0
      };
    // console.log('KPI targets for children: ', kpiTargets);
    kpiTargets.forEach(function (target) {
      if (!isNaN(target.currentTarget) && target.currentTarget !== null && returnedTarget.currentTarget !== null) {
        returnedTarget.currentTarget += target.currentTarget;
      } else {
        returnedTarget.currentTarget = null;
      }
      if (!isNaN(target.actual) && target.actual !== null && returnedTarget.actual !== null) {
        returnedTarget.actual += target.actual;
      } else {
        returnedTarget.actual = null;
      }
    });
    returnedTarget.timePointTarget = _.result(Custom.aggregators.getNearestPastKpiMilestone(allMilestones), 'timePoint');
    returnedTarget.timePointActual = _.result(Custom.aggregators.getNearestPastKpiMilestoneWithActual(allMilestones), 'timePoint');
    //console.log('calc stuff: ', allMilestones, returnedTarget);
    return returnedTarget;
  };

  calculatedKpis.forEach(function (eachKpi) {
    // console.log('calculating kpis for :', eachKpi.sno);
    eachKpi.targetBenchmarks = getAvgMilestoneOfChildren(eachKpi.sno);
    // console.log('target benchmarks for :', eachKpi.sno, ' are ', eachKpi.targetBenchmarks);
  });

  return calculatedKpis;
};

var calculateAllKpiTargetBenchMarks = function () {
  console.log('Job:Calculate All Kpi Target benchmarks');
  return Artifact2.find([{
      kpiType: 'Output'
    }, {
      kpiType: 'output'
    }])
    .populate('KPI Milestone')
    .then(function (allKpis) {
      var calculatedKpis = startKpiTargetJob(allKpis),
        milestoneUpdates = calculatedKpis.map(updateCalculatedKpi);
      Promise.all(milestoneUpdates)
        .then(function (updatedData) {
          // console.log('Targets calculated and assigned to milestones : ', updatedData.map(function(eachUpdatedData) {
          //   return _.pluck(_.flatten(eachUpdatedData), 'sno');
          //   // return Array.isArray(eachUpdatedData) ? eachUpdatedData[0].sno : eachUpdatedData.sno;
          // }));
        }, console.log);
    });
};

var findSumOfOutcomeKpiMilestones = function (milestones, kpiLength) {

  var uniqueTimepoints = _.chain(milestones)
    .pluck('timePoint')
    .sortBy()
    .uniq(String)
    .value();
  var childKpiIds = _.chain(milestones)
    .pluck('parentId')
    .sortBy()
    .uniq(String)
    .value();

  var childKpisTrack = {};
  childKpiIds.forEach((kpiId) => {
    childKpisTrack[kpiId] = {
      targetValue: 0,
      actualValue: 0
    };
  });

  return uniqueTimepoints.map((t) => {

    let filteredMilestonesByTimepointKeyed = _.indexBy(_.chain(milestones)
      .filter((m) => {
        return (new Date(m.timePoint))
          .getTime() === (new Date(t))
          .getTime();
      })
      .value(), 'parentId');

    let targetSum = 0;
    let actualSum = 0;

    childKpiIds.forEach((eachKpiId) => {
      const targetValue = parseInt(_.result(filteredMilestonesByTimepointKeyed[eachKpiId], 'targetValue'));
      const actualValue = parseInt(_.result(filteredMilestonesByTimepointKeyed[eachKpiId], 'actualValue'));
      targetSum += isNumber(targetValue) ? targetValue : childKpisTrack[eachKpiId].targetValue;
      actualSum += isNumber(actualValue) ? actualValue : childKpisTrack[eachKpiId].actualValue;
      childKpisTrack[eachKpiId].targetValue = isNumber(targetValue) ? targetValue : childKpisTrack[eachKpiId].targetValue;
      childKpisTrack[eachKpiId].actualValue = isNumber(actualValue) ? actualValue : childKpisTrack[eachKpiId].actualValue;
    });

    return {
      timePoint: t,
      targetValue: targetSum,
      actualValue: actualSum
    };
  });

};

/*
In this job, we are finding the sum of all kpi milestones of child kpis of outcome kpis.
Here, milestones of child kpis which have the same timepoint are summed up.
This is only done if all child KPIs contain milestones containing same timepoint, i.e. if there is even one child kpi which does not contain a milestone with the same timepoint,
that milestone will not be included at all in the parent kpi.
*/
var findOutComeKpiMilestones = function () {
  console.log('Job:Find Outcome Kpi Milestones');
  var outcomeKpiIds,
    kpiMilestoneSum,
    addKpiId = function (kpiId) {
      return function (milestone) {
        milestone.parentId = kpiId.sno;
        milestone.initiativeId = kpiId.initiativeId;
        return milestone;
      };
    };
  return Artifact2.find({
      or: [{
        kpiType: 'Outcome',
        isCalculated: true
      }, {
        kpiType: 'outcome',
        isCalculated: true
      }],
      select: ['sno', 'initiativeId']
    })
    .then(function (kpiIds) {
      outcomeKpiIds = kpiIds;
      var promises = [];
      kpiIds.forEach(function (kpiId) {
        promises.push(Artifact2.find({
            parentKpi: kpiId.sno
          })
          .populate('KPI Milestone'));
      });
      return Promise.all(promises);
    })
    .then(function (childKpisArray) {
      kpiMilestoneSum = childKpisArray.map(function (childKpis) {
        var childKpiLength = childKpis.length,
          milestones = _.flatten(_.pluck(childKpis, 'KPI Milestone'));
        return findSumOfOutcomeKpiMilestones(milestones, childKpiLength);
      });
      //destroy all exisiting milestones for kpis before updating new ones
      var outComeKpiSnos = _.pluck(outcomeKpiIds, 'sno');
      var destroyQuery = outComeKpiSnos.length === 0 ? null : outComeKpiSnos;
      return Artifact6.destroy({
        parentId: destroyQuery
      });
    })
    .then(function (destroyedData) {
      // console.log('destroyed ids : ', _.pluck(destroyedData, 'sno'));
      var promises = [];
      outcomeKpiIds.forEach(function (kpiId, i) {
        var milestones = kpiMilestoneSum[i].map(addKpiId(kpiId));
        promises.push(Artifact6.create(milestones));
      });
      return Promise.all(promises);
    })
    .then(function (milestonesArray) {
      // console.log('Milestones updated for Outcome KPIs');
      milestonesArray.forEach(function (milestones) {
        var kpiId = milestones.length > 0 ? milestones[0].parentId : null;
        // console.log('KPI : ', kpiId, ' Milestones : ', JSON.stringify(_.pluck(milestones, 'sno')));
      });
    }, console.log);
};


var startCron = function () {
  console.log('Cron Started');
  startAchievementToTargetJob()
    // Initiative.count({})
    .then(function () {
      return startKpiCalculationJob();
    })
    .then(function () {
      return calculateAllKpiTargetBenchMarks();
    })
    .then(function () {
      return findOutComeKpiMilestones();
    })
    .then(function () {
      return findOutComeKpiMilestones();
    })
    .then(function () {
      console.log('Cron Ended');
    });
};

module.exports = {
  populateActivities: populateActivities,
  startActivityPopulationJob: startActivityPopulationJob,
  startKpiCalculationJob: startKpiCalculationJob,
  calculateKpiFromChildren: calculateKpiFromChildren,
  startAchievementToTargetJob: startAchievementToTargetJob,
  startKpiTargetJob: startKpiTargetJob,
  calculateAllKpiTargetBenchMarks: calculateAllKpiTargetBenchMarks,
  findSumOfOutcomeKpiMilestones: findSumOfOutcomeKpiMilestones,
  findOutComeKpiMilestones: findOutComeKpiMilestones,
  startCron: startCron
};
