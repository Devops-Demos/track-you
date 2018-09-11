'use strict';
var async = require('async');

module.exports = {

  upsertMilestone : function(milestone){
    return Artifact6.findOne({
        sno: milestone.sno
      })
      .then(function(data) {
        if (!data) {
          return Artifact6.create(milestone);
        }
        return Artifact6.update({
          sno: milestone.sno
        }, milestone);
      });
  },

  upsertKpi: function(kpiData) {
    return Artifact2.findOne({
        sno: kpiData.sno
      })
      .then(function(data) {
        if (!data) {
          return Artifact2.create(kpiData);
        }
        return Artifact2.update({
          sno: kpiData.sno
        }, kpiData);
      });
  },

  upsertChildren: function(kpis, inheritedSpecs, cb) {
    var self = this,
      tasks = [],
      pushUpsertKpi = function(kpi) {
        delete kpi['KPI Milestone'];
        kpi.parentKpi = inheritedSpecs.parentKpi;
        kpi.uom = inheritedSpecs.uom;
        kpi.initiativeId = inheritedSpecs.initiativeId ? inheritedSpecs.initiativeId : kpi.initiativeId;
        if(kpi.deleted === true){
          return tasks.push(function(cb){
            Artifact2.destroy({sno: kpi.sno}, cb);
          });
        }
        tasks.push(function(cb) {
          self.upsertKpi(kpi).then(function(data){
            cb(null, DataUtils.sanitize.arraysToObjects(data));
          });
        });
      };
    kpis.forEach(pushUpsertKpi);
    async.parallel(tasks, cb);
  },

  upsertMilestones : function(milestones, inheritedSpecs, cb){
    var self = this,
      tasks = [],
      pushUpsertMilestone = function(milestone) {
        milestone.parentId = inheritedSpecs.parentKpi;
        milestone.initiativeId = inheritedSpecs.initiativeId;
        if(milestone.deleted === true){
          tasks.push(function(cb){
            Artifact6.destroy({sno: milestone.sno}, cb);
          });
        }
        tasks.push(function(cb) {
          self.upsertMilestone(milestone).then(function(data){
            cb(null, DataUtils.sanitize.arraysToObjects(data));
          });
        });
      };
    milestones.forEach(pushUpsertMilestone);
    async.parallel(tasks, cb);
  }
};
