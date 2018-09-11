/**
 * Created by sohamchetan on 10/09/15.
 */
'use strict';
import _ from 'lodash';

module.exports = {

  weeklyEmailToOwners: function () {
    User.find({})
      .populateAll()
      .then(function (users) {
        users.filter((user) => (_.result(user, 'initiatives.length', 0) > 0))
          .forEach(function (user) {
            Custom.notifiers.sendActivityNotification(user)
              .then(function (emailData) {
                return Mailer.interface.weeklyUpcomingMail(emailData, user);
              })
              .then(console.log);
          });
        // users.forEach(Custom.notifiers.sendKpiNotification);
      });
  }

};
