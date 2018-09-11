/**
 * Created by sohamchetan on 07/09/15.
 */
'use strict';
var moment = require('moment'),
  _ = require('lodash');

describe('Initiative Class', function () {
  var InitiativeClass = require('../../api/classes/InitiativeClass'),
    mockInitiatives = require('./mockInitiatives'),
    mockInitiative = mockInitiatives.raw;


  describe('Constructor', function () {
    it('is an instance of InitiativeClass', function () {
      expect((new InitiativeClass(mockInitiative)) instanceof InitiativeClass)
        .to.equal(true);
    });
  });

  describe('nestData', function () {
    it('nests sub data inside other data', function () {
      var initiative = new InitiativeClass(mockInitiative),
        nestedMilestones;
      initiative.nestData();
      nestedMilestones = initiative.KPI[0]['KPI Milestone'];
      expect(nestedMilestones.length)
        .to.equal(2);
      expect(nestedMilestones[0].parentId)
        .to.equal(1);
    });
  });

  describe('convertDates', function () {
    it.skip('converts dates to standard format', function () {
      var initiative = new InitiativeClass(mockInitiative);
      initiative.aggregate();
      expect(initiative.plannedStartDate)
        .to.equal('2015-09-06T18:30:00.000Z');
      expect(initiative.plannedEndDate)
        .to.equal('2015-09-06T18:30:00.000Z');
      expect(initiative.actualStartDate)
        .to.equal('2015-09-06T18:30:00.000Z');
      expect(initiative.actualEndDate)
        .to.equal('2015-09-06T18:30:00.000Z');
    });
  });

  describe('calculate kpi target ratio', function () {
    it('calculates ratio accurately', function () {
      var initiative = new InitiativeClass(mockInitiative);
      initiative.priorityAchievementTargetRatio = 1.234;
      initiative.calculateKpiRatio();
      expect(initiative.KpiAchievementToTarget)
        .to.equal(1.234);
    });
    it('calculates ratio for priority as its priorityAchievementTargetRatio', function () {
      var mockPriority = _.clone(mockInitiative),
        initiative;
      mockPriority.type = 'priority';
      mockPriority.priorityAchievementTargetRatio = 0.4;
      initiative = new InitiativeClass(mockPriority);
      initiative.nestData();
      initiative.calculateKpiRatio();
      expect(initiative.KpiAchievementToTarget)
        .to.equal(0.4);
    });
  });

  describe('calculate initiative status', function () {
    it('calculates status of initiative (Completed)', function () {
      var completedInitiatives = mockInitiatives.completedInitiatives;
      completedInitiatives.forEach(function (eachInitiative) {
        var initiative = new InitiativeClass(eachInitiative);
        initiative.calculateInitiativeStatus();
        expect(initiative.status)
          .to.equal('completed');
      });
    });
    it('calculates status of initiative (On Track)', function () {
      var completedInitiatives = mockInitiatives.onTrackInitiatives;
      completedInitiatives.forEach(function (eachInitiative) {
        var initiative = new InitiativeClass(eachInitiative);
        initiative.calculateInitiativeStatus();
        expect(initiative.status)
          .to.equal('onTrack');
      });
    });
    it('calculates status of initiative (Delayed)', function () {
      var completedInitiatives = mockInitiatives.delayedInitiatives;
      completedInitiatives.forEach(function (eachInitiative) {
        var initiative = new InitiativeClass(eachInitiative);
        initiative.calculateInitiativeStatus();
        expect(initiative.status)
          .to.equal('delayed');
      });
    });
    it('calculates status of initiative (unknown)', function () {
      var unknownInitiative = mockInitiatives.unknownInitiative;
      var initiative = new InitiativeClass(unknownInitiative);
      initiative.calculateInitiativeStatus();
      expect(initiative.status)
        .to.equal('unknown');
    });
  });

  describe('calculate KPI targets', function () {
    it('calculates KPI targets', function () {
      var initiative = new InitiativeClass(mockInitiative);
      initiative.nestData();
      initiative.aggregate();
      assert.deepEqual(initiative.KPI[0].targetBenchmarks, {
        currentTarget: 84.7,
        actual: 84.7,
        lastTarget: 88.1
      });
    });
    it('calculates nearest KPI milestone with actual ', function () {
      var initiative = new InitiativeClass(mockInitiative);
      initiative.convertDates();
      initiative.nestData();
      initiative.calculateKpiTargets();
      expect(initiative.KPI[0].nearestActualMilestone)
        .to.not.equal(undefined);
      expect(initiative.KPI[0].nearestActualMilestone.timePoint)
        .to.equal('12/31/2014');
      expect(initiative.KPI[0].nearestActualMilestone.actualValue)
        .to.equal('84.7');
    });
  });

  describe('calculate activity status', function () {
    it('calculates activity status (on track)', function () {
      var onTrackActivity = mockInitiatives.onTrackActivity,
        initiative = new InitiativeClass(onTrackActivity);
      expect(initiative.status)
        .to.equal('onTrack');
    });
  });

  describe('is an upcoming activity', function () {
    it('checks if an activity is upcoming this week', function () {
      var upcomingDate = moment()
        .add(3, 'days')
        .toISOString(),
        upcomingActivity = {
          type: 'activity',
          plannedEndDate: upcomingDate
        };
      expect(new InitiativeClass(upcomingActivity)
          .completesThisWeek())
        .to.equal(true);
    });
    it('checks if an activity is not upcoming this week', function () {
      var upcomingDate = moment()
        .add(8, 'days')
        .toISOString(),
        upcomingActivity = {
          type: 'activity',
          plannedEndDate: upcomingDate
        };
      expect(new InitiativeClass(upcomingActivity)
          .completesThisWeek())
        .to.equal(false);
    });
    it('returns false if activity doesnt have dates', function () {
      var upcomingActivity = {
        type: 'activity'
      };
      expect(new InitiativeClass(upcomingActivity)
          .completesThisWeek())
        .to.equal(false);
    });
    it('returns false if activity has invalid dates', function () {
      var upcomingActivity = {
        type: 'activity',
        plannedEndDate: 'invalid'
      };
      expect(new InitiativeClass(upcomingActivity)
          .completesThisWeek())
        .to.equal(false);
    });
  });

  describe('get Weighted Kpi Achievement To Target Ratio', function () {
    it('gets weighted kpiToAchievementRatio', function () {
      var initiative = (new InitiativeClass(mockInitiative));
      initiative.nestData();
      initiative.aggregate();
      const weightedRatio = initiative.getWeightedKpiAchievementToTargetRatio();
      expect(weightedRatio.ratio)
        .to.equal(1.234);
      expect(weightedRatio.weight)
        .to.equal(7);
    });
  });

});
