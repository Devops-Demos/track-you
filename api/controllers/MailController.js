/**
 * MailController
 *
 * @description :: Server-side logic for managing mails
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

module.exports = {

  sendMailToInitiativeOwner : function(req, res){
    var initiativeId = req.body.initiativeId,
      emailMessage = req.body.message,
      allOwners = req.body.allOwners,
      participants = req.body.participants === 'true',
      method = allOwners === 'true' ? 'initiativeOwnersUp' : 'initiativeOwner',
      user = req.user;

    Mailer.interface.initiativeOwner(initiativeId, emailMessage, user, method, participants, console.log);
    res.end('Sending... ');
  }

};
