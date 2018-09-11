'use strict';

import {
  spy
} from 'sinon';
import async from 'async';
import {
  assert
} from 'chai';
import memoizedGetPermissions from '../../../api/controllers/initiative-controller/get-permissions';


describe('get-permissions memoir', function () {

  before(() => {
    spy(Initiative, 'isOwnerOfTree');
  });

  after(() => {
    Initiative.isOwnerOfTree.restore();
  });

  it('Sanity', done => {
    const tasks = ['a', null, undefined, {},
      []
    ].map(badInput => cb => {
      memoizedGetPermissions(1, badInput)
        .then(console.trace, err => {
          assert.ok(err);
          cb();
        });
    });
    async.series(tasks, done);
  });

  it('returns a new object each time', done => {
    let returnedObject;
    memoizedGetPermissions(1, 1, {})
      .then(data => {
        returnedObject = data;
        return memoizedGetPermissions(1, 1);
      })
      .then(data => {
        assert.notEqual(data, returnedObject);
      })
      .then(done, done);
  });

  it('Hits cache on second call', function (done) {
    let callCount = null;
    memoizedGetPermissions(1, 1)
      .then(() => {
        callCount = Initiative.isOwnerOfTree.callCount;
        return memoizedGetPermissions(1, 1);
      })
      .then(() => {
        assert.equal(Initiative.isOwnerOfTree.callCount, callCount);
      })
      .then(done, done);
  });

  describe('results : gives appropriate permissions for someone who is ', function () {
    it('an owner but not a participant', done => {
      memoizedGetPermissions(9, 1)
        .then(results => {
          const [isOwner, isParticipant] = results;
          assert.ok(isParticipant);
          assert.ok(isOwner);
        })
        .then(done, done);
    });

    it('not an owner but a participant', done => {
      memoizedGetPermissions(11, 6)
        .then(results => {
          const [isOwner, canView] = results;
          assert.ok(canView);
          assert.notOk(isOwner);
        })
        .then(done, done);
    });

    it('an owner and a participant', done => {
      memoizedGetPermissions(9, 2)
        .then(results => {
          const [isOwner, isParticipant] = results;
          assert.ok(isParticipant);
          assert.ok(isOwner);
        })
        .then(done, done);
    });

    it('not an owner and not a participant', done => {
      memoizedGetPermissions(1, 11)
        .then(results => {
          const [isOwner, isParticipant] = results;
          assert.notOk(isParticipant);
          assert.notOk(isOwner);
        })
        .then(done, done);
    });

    it('not an owner and not a participant', done => {
      memoizedGetPermissions(1, 11)
        .then(results => {
          const [isOwner, isParticipant] = results;
          assert.notOk(isParticipant);
          assert.notOk(isOwner);
        })
        .then(done, done);
    });

    it('an owner of a child, but without viewParentage rights', done => {
      memoizedGetPermissions(1, 2)
        .then(results => {
          const [isOwner, isParticipant] = results;
          assert.notOk(isParticipant);
          assert.notOk(isOwner);
        })
        .then(done, done);
    });

    it('an owner of a child, but with viewParentage rights', done => {
      memoizedGetPermissions(1, 2, {
          viewParentage: true
        })
        .then(results => {
          const [isOwner, canView] = results;
          assert.ok(canView);
          assert.notOk(isOwner);
        })
        .then(done, done);
    });

  });
});
