'use strict';
/*
In this job, we are finding the sum of all kpi milestones of child kpis of outcome kpis.
Here, milestones of child kpis which have the same timepoint are summed up.
This is only done if all child KPIs contain milestones containing same timepoint, i.e. if there is even one child kpi which does not contain a milestone with the same timepoint,
that milestone will not be included at all in the parent kpi.
*/
import _ from 'lodash';
import debug from 'debug';

const log = debug('cron:outcome-kpi-milestones');

var findSumOfOutcomeKpiMilestones = function(milestones, kpiLength) {
  var milestonesByTimePoint = _.map(_.groupBy(milestones, 'timePoint')),
    resultantMilestones = [],
    getSumOf = function(data, key) {
      var dataArray = _.pluck(data, key);
      return DataUtils.sanitize.removeNulls(dataArray).length === 0 ? null : _.sum(dataArray.map(Number));
    };
  milestonesByTimePoint.forEach(function(milestoneGroup) {
    if (milestoneGroup.length !== Number(kpiLength)) {
      return;
    }
    resultantMilestones.push({
      timePoint: milestoneGroup[0].timePoint,
      targetValue: getSumOf(milestoneGroup, 'targetValue'),
      actualValue: getSumOf(milestoneGroup, 'actualValue')
    });
  });
  return resultantMilestones;
};

module.exports = () => {
  var outcomeKpiIds,
    kpiMilestoneSum,
    addKpiId = function(kpiId) {
      return function(milestone) {
        milestone.parentId = kpiId.sno;
        milestone.initiativeId = kpiId.initiativeId;
        return milestone;
      };
    };
  Artifact2.find({
      kpiType: 'outcome',
      isCalculated: true,
      select: ['sno', 'initiativeId']
    })
    .then(function(kpiIds) {
      outcomeKpiIds = kpiIds;
      var promises = [];
      kpiIds.forEach(function(kpiId) {
        promises.push(Artifact2.find({
          parentKpi: kpiId.sno
        }).populate('KPI Milestone'));
      });
      return Promise.all(promises);
    })
    .then(function(childKpisArray) {
      kpiMilestoneSum = childKpisArray.map(function(childKpis) {
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
    .then(function() {
      var promises = [];
      outcomeKpiIds.forEach(function(kpiId, i) {
        var milestones = kpiMilestoneSum[i].map(addKpiId(kpiId));
        promises.push(Artifact6.create(milestones));
      });
      return Promise.all(promises);
    })
    .then(function(milestonesArray) {
      milestonesArray.forEach(function(milestones) {
        var kpiId = milestones.length > 0 ? milestones[0].parentId : null;
        log('KPI : ', kpiId, ' Milestones : ', JSON.stringify(_.pluck(milestones, 'sno')));
      });
      console.log('log:','outcome kpi milestones job completed', new Date());
    }, console.log);
};
