import { assert } from 'chai';
import agent from 'superagent';
import { baseUrl } from '../constants';
import url from 'url';
let request = agent.agent();
let adminRequest;
beforeEach(() => {
  adminRequest = request.post(url.resolve(baseUrl, '/login'))
    .send({
      email: 'admin@test.com',
      password: 'password'
    });
});

const kpiData = {
  kpiType: 'output',
  kpiMilestones: [{
    sno: 40,
    timePoint: '06/20/2016',
    targetValue: 28.1,
    actualValue: 60.9,
    deleted: false
  }],
  kpiData: {
    kpi: 'KPI sno (3) gimjeak',
    baseline: 39.55,
    target: 18.6,
    sno: 3,
    kpiType: 'output',
    parentKpi: null,
    hasDrillDown: null,
    isCalculated: false,
    statusSeparator1: 6.3,
    statusSeparator2: 48.45,
    initiativeId: 4,
    achievementTargetRatio: -0.7708830548926019,
    percentileActual: 0
  },
  childKpis: [{
    initiativeId: '1',
    kpi: 'abc',
    uom: 'jow',
    baseline: 10,
    target: 20,
    widget: null,
    status: null,
    sno: 9
  }]
};

const newKpiData = {
  kpiType: 'output',
  kpiMilestones: [{
    sno: 40,
    timePoint: '06/20/2016',
    targetValue: 28.1,
    actualValue: 60.9,
    deleted: false
  }],
  kpiData: {
    kpi: 'KPI sno (3) gimjeak',
    baseline: 39.55,
    target: 18.6,
    kpiType: 'output',
    parentKpi: null,
    hasDrillDown: null,
    isCalculated: false,
    statusSeparator1: 6.3,
    statusSeparator2: 48.45,
    initiativeId: 4,
    achievementTargetRatio: -0.7708830548926019,
    percentileActual: 0
  },
  childKpis: [{
    initiativeId: '1',
    kpi: 'abc',
    uom: 'jow',
    baseline: 10,
    target: 20,
    widget: null,
    status: null,
    sno: 9
  }]
};

const returnData = {
  kpiData: {
    kpi: 'KPI sno (3) gimjeak',
    uom: 'opb',
    baseline: '39.55',
    target: '18.6',
    widget: 'bignumber',
    status: null,
    sno: 3,
    description: 'Adji hoz okaivnu kote kivih pozujve tobutek we uksicti ehugoko uwofe bojaaba zanuf zupomfo vohisewag bo.',
    createdAt: '2016-06-21T14:47:10.000Z',
    kpiType: 'output',
    parentKpi: null,
    hasDrillDown: true,
    isCalculated: false,
    statusSeparator1: 6.3,
    statusSeparator2: 48.45,
    initiativeId: 4
  },
  childKpis: [{
    'baseline': '10',
    'createdAt': '2016-06-21T14:47:10.000Z',
    'description': 'Cu olepi gop sufagri fogvokhok ekfenic imipatot jaze wul vapu at oh vapsujag funjufta esligi.',
    'hasDrillDown': null,
    'initiativeId': 1,
    'isCalculated': null,
    'kpi': 'abc',
    'kpiType': 'outcome',
    'parentKpi': 3,
    'sno': 9,
    'status': null,
    'statusSeparator1': 28.45,
    'statusSeparator2': 32.4,
    'target': '20',
    'uom': 'opb',
    'widget': null
  }],
  kpiMilestones: [{
    sno: 40,
    timePoint: '2016-06-19T18:30:00.000Z',
    targetValue: '28.1',
    actualValue: '60.9',
    initiativeId: 4,
    parentId: 3
  }]
};

describe('Upsert kpi API', function() {

  it.skip('properly upsert kpi', done => {
    adminRequest.then(() => {
      return request.post(url.resolve(baseUrl, '/upsert-kpi'))
        .send(kpiData);
    })
      .then(res => {
        assert.equal(res.status, 200);
        delete res.body.kpiData.updatedAt;
        delete res.body.childKpis[0].updatedAt;
        assert.deepEqual(res.body, returnData);
      })
      .then(done, done);
  });

  it.skip('properly upserts new kpi', done => {
    adminRequest.then(() => {
      return request.post(url.resolve(baseUrl, '/upsert-kpi'))
        .send(newKpiData);
    })
      .then(res => {
        assert.equal(res.status, 200);
      })
      .then(done, done);
  });
});
