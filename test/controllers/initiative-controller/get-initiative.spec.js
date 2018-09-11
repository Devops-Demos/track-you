'use strict';

import {
  spy
} from 'sinon';
import {
  assert
} from 'chai';
import memoizedGetInitiative from '../../../api/controllers/initiative-controller/get-initiative';


describe('get-initiative memoir', function () {

  before(() => {
    spy(Initiative, 'find');
  });

  after(() => {
    Initiative.find.restore();
  });

  it('returns a new object each time', done => {
    let returnedObject;
    memoizedGetInitiative(1).then(data => {
        returnedObject = data;
        return memoizedGetInitiative(1);
      })
      .then(data => {
        assert.notEqual(data, returnedObject);
      })
      .then(done, done);
  });

  it('Hits cache on second call', function (done) {
    let callCount = null;
    memoizedGetInitiative(1).then(data => {
        assert.equal(data.initiativeId, 1);
        callCount = Initiative.find.callCount;
        return memoizedGetInitiative(1);
      })
      .then(data => {
        assert.equal(data.initiativeId, 1);
        assert.equal(Initiative.find.callCount, callCount);
        done();
      }, console.trace);
  });

  it('Hits database on new id call', function (done) {
    let callCount = null;
    memoizedGetInitiative(1).then(data => {
        assert.equal(data.initiativeId, 1);
        callCount = Initiative.find.callCount;
        return memoizedGetInitiative(2);
      })
      .then(data => {
        assert.equal(data.initiativeId, 2);
        assert.equal(Initiative.find.callCount, callCount * 2);
        done();
      }, console.trace);
  });
});
