import { assert} from 'chai';
import agent from 'superagent';
import { baseUrl} from '../constants';
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

describe('First future milestone', function() {

  it.skip('should return the first future milestone', done => {
    adminRequest.then(() => {
      return request.get(url.resolve(baseUrl, '/initiative?initiativeId=5'));
    })
      .then(res => {
        const now = new Date();
        const milestoneDates = res.body.KPI[0]['KPI Milestone'].map(m => new Date(m.timePoint));
        assert.isTrue(milestoneDates[0] < now);
        assert.isTrue(milestoneDates[1] < now);
        assert.isTrue(milestoneDates[2] < now);
        assert.isTrue(milestoneDates[3] > now);
      })
      .then(done, done);
  });
});
