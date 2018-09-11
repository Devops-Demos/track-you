/**
 * Created by sohamchetan on 27/08/15.
 */
'use strict';

var _ = require('lodash');

module.exports = {

  initiativeOwner: function (initiativeId, cb) {
    Initiative.findOne({
      initiativeId: initiativeId
    }).populate('owner').exec(function (err, data) {
      var email = _.has(data, 'owner.email') ? data.owner.email : null;
      cb([email]);
    });
  },

  initiativeOwnersUp: function (initiativeId, cb) {
    var query = getQueries.queries
      .getInitiativeOwnersUp
      .replace('{initiativeId}', initiativeId);

    Initiative.query(query, function (err, data) {
      if (err) {
        console.trace(err);
      }
      data = data.rows || data;
      cb(DataUtils.sanitize.removeNulls(_.map(data[0])));
    });
  },

  participantEmails: initiativeId => Initiative.findOne({
      initiativeId,
      select: ['initiativeId']
    })
    .populate('participants')
    .then(({
      participants
    }) => participants.map(participant => participant.email))

};
