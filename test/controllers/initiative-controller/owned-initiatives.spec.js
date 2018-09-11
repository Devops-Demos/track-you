'use strict';

import memoizedOwnedInitiatives from '../../../api/controllers/initiative-controller/owned-initiatives';
import chai from 'chai';
import {
  spy
} from 'sinon';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const {
  expect
} = chai;
describe('Memoized owned initiatives', function () {

  beforeEach(() => {
    memoizedOwnedInitiatives.ref.clear();
    spy(Initiative, 'find');
  });

  afterEach(() => {
    Initiative.find.restore();
  });

  it('Sanity', () => {
    expect(memoizedOwnedInitiatives()
        .constructor)
      .to.equal(Promise);
    expect(typeof memoizedOwnedInitiatives.ref)
      .to.eq('function');
  });

  it('returns a new object each time', done => {
    let returnedObject;
    memoizedOwnedInitiatives(1)
      .then(data => {
        returnedObject = data;
        return memoizedOwnedInitiatives(1);
      })
      .then(data => {
        assert.notEqual(data, returnedObject);
      })
      .then(done, done);
  });

  it('Gets array of owned initiatives', done => {
    memoizedOwnedInitiatives(1)
      .then(initiatives => {
        expect(initiatives.length)
          .to.eq(3);
        expect(Initiative.find.callCount)
          .to.eq(1);
      })
      .then(done, done);
  });

  it('Calls cache on second call', done => {
    memoizedOwnedInitiatives(1)
      .then(() => {
        expect(Initiative.find.callCount)
          .to.eq(1);
        return memoizedOwnedInitiatives(1);
      })
      .then(() => {
        expect(Initiative.find.callCount)
          .to.eq(1);
      })
      .then(done, done);
  });

  it('updates on creating an initiative', (done) => {
    let createdId;
    memoizedOwnedInitiatives(1)
      .then(() => {
        expect(Initiative.find.callCount)
          .to.eq(1);
        return Initiative.create({
          owner: 1
        });
      })
      .then((createdInitiative) => {
        createdId = createdInitiative.initiativeId;
        return memoizedOwnedInitiatives(1);
      })
      .then(initiatives => {
        expect(Initiative.find.callCount)
          .to.eq(2);
        expect(initiatives.length)
          .to.eq(4);
        return Initiative.destroy({
          initiativeId: createdId
        });
      })
      .then(() => {
        return memoizedOwnedInitiatives(1);
      })
      .then(initiatives => {
        expect(Initiative.find.callCount)
          .to.eq(3);
        expect(initiatives.length)
          .to.eq(3);
      })
      .then(done, done);
  });

});
