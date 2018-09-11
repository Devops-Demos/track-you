import { assert } from 'chai';
import { stub } from 'sinon';
import testDataGen from '../../test-data/mailer-data';
const testData = testDataGen();

describe('Send admin email on change', function() {
  it('should send the correct mail', done => {
    stub(Mailer.sender, 'sendTo', (opts, cb) => cb());
    Mailer.interface.adminChangeEmail({
      oldData: testData.oldData,
      newData: testData.newData.oneChange,
      user: testData.user,
      type: 'initiative'
    })
      .then(() => {
        const emailInfo = Mailer.sender.sendTo.args[0][0];
        assert.equal(emailInfo.message, testData.results.adminInitiativeChange2);
        assert.equal(emailInfo.subject, 'iTrack data modification : Values changed for Identify the most popularly requested species based on permit applications 3-ft action');
        assert.deepEqual(emailInfo.bcc, ['admin@test.com', 'user2@test.com']);
        Mailer.sender.sendTo.restore();
      })
      .then(done, done);
  });

  it('shouldnt send mail if it is not an activity', done => {
    stub(Mailer.sender, 'sendTo', (opts, cb) => cb());
    Mailer.interface.adminChangeEmail({
      oldData: Object.assign(testData.oldData, {
        type: 'initiative'
      }),
      newData: testData.newData.oneChange,
      user: testData.user,
      type: 'initiative'
    })
      .then(() => {
        const {callCount} = Mailer.sender.sendTo;
        assert.equal(callCount, 0);
        Mailer.sender.sendTo.restore();
      })
      .then(done, done);
  });

  it('shouldnt send mail if it is no change', done => {
    stub(Mailer.sender, 'sendTo', (opts, cb) => cb());
    Mailer.interface.adminChangeEmail({
      oldData: testData.oldData,
      newData: testData.newData.same,
      user: testData.user,
      type: 'initiative'
    })
      .then(() => {
        const {callCount} = Mailer.sender.sendTo;
        assert.equal(callCount, 0);
        Mailer.sender.sendTo.restore();
      })
      .then(done, done);
  });

  it.skip('should send kpi mail', done => {
    stub(Mailer.sender, 'sendTo', (opts, cb) => cb());
    Mailer.interface.adminChangeEmail(Object.assign(testData.kpi, {
      type: 'kpi'
    }))
      .then(() => {
        const emailInfo = Mailer.sender.sendTo.args[0][0];
        assert.deepEqual(emailInfo.message.split('\n'), testData.kpi.result.split('\n'));
        assert.equal(emailInfo.subject, 'iTrack data modification : Values changed for output KPI KPI sno (3) gimjeak');
        assert.deepEqual(emailInfo.bcc, ['admin@test.com', 'user2@test.com']);
        Mailer.sender.sendTo.restore();
      })
      .then(done, done);
  });

});
