'use strict';
let COMPLETED = 'completed';
let ONTRACK = 'ontrack';
let DELAYED = 'delayed';
let UNKNOWN = 'unknown';
describe('KpiClass', function() {
  let KpiClass = require('../../api/classes/KpiClass');
  let mockKpis = require('./mockKpis.json');

  describe('calculateKPIStatus', function() {
      it('should give status for output kpis',()=>{
        let kpiOntrack = new KpiClass(mockKpis[0]);
        let kpiDelayed = new KpiClass(mockKpis[1]);
        let kpiCompleted = new KpiClass(mockKpis[2]);
        let kpiUnknown = new KpiClass(mockKpis[3]);

        kpiOntrack.calculateKPIStatus();
        kpiDelayed.calculateKPIStatus();
        kpiCompleted.calculateKPIStatus();
        kpiUnknown.calculateKPIStatus();

        expect(kpiOntrack.status).to.equal(ONTRACK);
        expect(kpiDelayed.status).to.equal(DELAYED);
        expect(kpiCompleted.status).to.equal(COMPLETED);
        expect(kpiUnknown.status).to.equal(UNKNOWN);
      });

      it('should give status for outcome kpis',()=>{
        let kpiOntrack = new KpiClass(mockKpis[4]);
        let kpiDelayed = new KpiClass(mockKpis[5]);
        let kpiCompleted = new KpiClass(mockKpis[6]);
        let kpiUnknown = new KpiClass(mockKpis[7]);

        kpiOntrack.calculateKPIStatus();
        kpiDelayed.calculateKPIStatus();
        kpiCompleted.calculateKPIStatus();
        kpiUnknown.calculateKPIStatus();

        expect(kpiOntrack.status).to.equal(ONTRACK);
        expect(kpiDelayed.status).to.equal(DELAYED);
        expect(kpiCompleted.status).to.equal(COMPLETED);
        expect(kpiUnknown.status).to.equal(UNKNOWN);
      });

  });
});
