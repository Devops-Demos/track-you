/**
 * Created by sohamchetan on 25/08/15.
 */

module.exports = {

  sender : require('./mailer/sender'),

  getRecipients : require('./mailer/get-recipients'),

  mailBuilder : require('./mailer/mail-builder'),

  interface : require('./mailer/interface')

};
