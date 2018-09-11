'use strict';

module.exports = {

  resetUserPassword: function(user, password) {
    var emails = Mailer.mailBuilder.newUser(user, password);
    Mailer.sender.sendTo(emails.userEmail, console.log);
    Mailer.sender.sendTo(emails.passwordEmail, console.log);
  },

  initiativeOwner: function(initiativeId, message, user, method, participants, cb) {
    const getParticipantEmails = participants ? Mailer.getRecipients.participantEmails(initiativeId) : new Promise(resolve => resolve([]));

    getParticipantEmails.then(participantEmails => Mailer.getRecipients[method](initiativeId, (emailId) => Mailer.sender.sendTo({
      receiver: [...participantEmails, ...emailId],
      subject: 'Automated mail',
      message: message,
      cc: (user && user.email) ? user.email : undefined
    }, cb)));
  },

  weeklyUpcomingMail: function(emailData, owner) {
    return new Promise(function(fulfilled) {
      var email = Mailer.mailBuilder.weeklyStatusUpdate(emailData, owner);
      Mailer.sender.sendTo(email, fulfilled);
    });
  },

  adminChangeEmail: ({oldData, newData, user, type}) => Mailer.mailBuilder.adminChangeEmail[type]({
    oldData,
    newData,
    user
  })
    .then(mailBody => {
      if (!mailBody) {
        return [];
      }
      return Promise.all([User.find({
        crudArtifacts: true,
        select: ['email']
      }), mailBody]);
    })
    .then(([recipients, mailBody]) => new Promise(resolve => {
      if (!recipients || !mailBody) {
        return resolve(null);
      }
      const emails = recipients.map(r => r.email);
      Mailer.sender.sendTo({
        bcc: emails,
        subject: `iTrack data modification : Values changed for ${type === 'kpi' ? `${newData.kpiType || ''} KPI ${oldData.kpi.kpi}` : oldData.initiative + ' 3-ft action'}`,
        message: mailBody
      }, msg => {
        console.log(`Admin change ${type} ${oldData.initiativeId || oldData.sno}`, msg);
        resolve(msg);
      });
    }))

};
