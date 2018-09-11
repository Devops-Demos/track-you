'use strict';
import {
  assert
} from 'chai';

describe('User model', function () {
  describe('isParticipant', function () {
    it('finds out if a user is a participant of something directly', function (done) {
      User.isParticipant(11, 6)
        .then(isHe => {
          assert.ok(isHe);
        })
        .then(done, done);
    });

    it('finds out if a user is a participant of something down the tree', function (done) {
      Promise.all([User.isParticipant(11, 11), User.isParticipant(11, 23)])
        .then(results => {
          const [result1, result2] = results;
          assert.ok(result1);
          assert.ok(result2);
        })
        .then(done, done);
    });

    it('returns false if a user isnt a participant of something, or is up the tree', function (done) {
      Promise.all([User.isParticipant(11, 2), User.isParticipant(11, 7), User.isParticipant(11, 19)])
        .then(results => {
          const [result1, result2, result3] = results;
          assert.notOk(result1);
          assert.notOk(result2);
          assert.notOk(result3);
        })
        .then(done, done);
    });

  });
});
