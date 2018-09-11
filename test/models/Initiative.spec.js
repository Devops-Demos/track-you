import {
  assert
} from 'chai';

describe('Initiative', function () {

  describe('findAndPopulateOne', function () {
    it.skip('gives initiative with max 12 milestones before today when no flgs are given', function (done) {
      Initiative.findAndPopulateOne(1)
        .then(initiative => {
          assert.ok(initiative.KPI.length > 0);
          assert.ok(initiative.KPI[0]['KPI Milestone'].length > 0);
        })
        .then(done, done);
    });

    it('gives initiative with no KPIs when removeKPIs flag is given', function (done) {
      Initiative.findAndPopulateOne(1, {
          removeKpi: true
        })
        .then(initiative => {
          assert.equal(initiative.KPI.length, 0);
        })
        .then(done, done);
    });

    it('all milestones before todays date', function (done) {
      Initiative.findAndPopulateOne(1)
        .then(initiative => initiative.KPI.forEach(kpi => {
          kpi['KPI Milestone'].forEach(milestone => {
            assert.ok(new Date(milestone.timePoint) < new Date());
          });
        }))
        .then(done, done);
    });

  });

});
