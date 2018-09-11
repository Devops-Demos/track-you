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
describe('Evidence APIs', function() {

  it('Initiatives should have evidence', done => {
    adminRequest
      .end(function() {
        request.get(url.resolve(baseUrl, '/initiative?initiativeId=2'))
          .end((err, res) => {
            assert.ok(Array.isArray(res.body.evidence));
            done();
          });
      });
  });

  it.skip('should be able to add new evidence', done => {
    Initiative.findOne(1)
      .populate('evidence')
      .then(initiative => {
        initiative = Custom.aggregators.assignEvidence(initiative, [{
          type: 'add',
          title: 'test1',
          url: 'http://testurl1.com'
        }, {
          type: 'add',
          title: 'test2',
          url: 'http://testurl2.com'
        }]);
        return initiative.save({
          populate: false
        });
      })
      .then(() => Initiative.findOne(1)
        .populate('evidence'))
      .then(initiative => {
        assert.equal(initiative.evidence.length, 2);
        assert.deepEqual(initiative.evidence.map(d => d.title), ['test1', 'test2']);
        done();
      });
  });

  it.skip('should be able to remove evidence', done => {
    Initiative.findOne(2)
      .populate('evidence')
      .then(initiative => {
        initiative = Custom.aggregators.assignEvidence(initiative, [{
          type: 'remove',
          sno: 1
        }]);
        return initiative.save({
          populate: false
        });
      })
      .then(() => Initiative.findOne(2)
        .populate('evidence'))
      .then(initiative => {
        assert.equal(initiative.evidence.length, 1);
        assert.deepEqual(initiative.evidence.map(d => d.title), ['test1']);
        done();
      });
  });


  it.skip('Integration test', done => {
    adminRequest
      .end(function() {
        request.put(url.resolve(baseUrl, '/initiative/2'))
          .send({
            evidence: [{
              type: 'remove',
              sno: 2
            }, {
              type: 'add',
              title: 'test3',
              url: 'http://test3.com'
            }, {
              title: 'this should do nothing',
              url: 'http://thishsoulddonothing.com'
            }]
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0].initiativeId, 2);
            Initiative.findOne(2)
              .populate('evidence')
              .then(initiative => {
                assert.equal(initiative.evidence.length, 1);
                assert.deepEqual(initiative.evidence.map(d => d.title), ['test3']);
                done();
              });
          });
      });
  });

  it.skip('Integration test - update', done => {
    adminRequest
      .then(function() {
        return request.put(url.resolve(baseUrl, '/initiative/2'))
          .send({
            evidence: [{
              sno: 13,
              type: 'update',
              title: 'test3u',
              link: 'http://test3u.com'
            }]
          });
      })
      .then((res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].initiativeId, 2);
        return Initiative.findOne(2)
          .populate('evidence');
      })
      .then(initiative => {
        assert.equal(initiative.evidence.length, 1);
        assert.equal(initiative.evidence[0].title, 'test3u');
        assert.equal(initiative.evidence[0].sno, 13);
        assert.equal(initiative.evidence[0].link, 'http://test3u.com');
      })
      .then(done, done);
  });

  it('Integration test - without evidence', done => {
    adminRequest
      .then(function() {
        return request.put(url.resolve(baseUrl, '/initiative/2'))
          .send({
          });
      })
      .then((res) => {
        assert.equal(res.status, 200);
      })
      .then(done, done);
  });


});
