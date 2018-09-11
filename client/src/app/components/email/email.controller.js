  class EmailController {
  constructor(DataService, $translate, InitiativeAdapter, AuthService){
    'ngInject';
    let vm = this;
    vm.DataService = DataService;
    vm.InitiativeAdapter = InitiativeAdapter;
    vm.mailContent = '';
    vm.emailToDept = {
      parentOwners: false,
      participants: false
    };
    vm.user = AuthService.username();
    vm.translationHolder = ['EMAIL_OWNER.HAS_LEFT_MSG', 'EMAIL_OWNER.HELLO', 'EMAIL_OWNER.MR/MS', 'EMAIL_OWNER.SEND_TO_PARTICIPANTS'];
      $translate(vm.translationHolder).then(function(translations) {
        vm.translations = translations;
      });
  }

  sendEmailTo(receiver, initiativeId) {
    let vm = this;
    vm.fullParentChain = _.forEach(vm.InitiativeAdapter.getParentChain(initiativeId,
      true), function(level) {
      level.type = _.capitalize(level.type);
    });
    let emailMsg = {
      hello: '',
      hierarchy: '',
      content: ''
    };
    emailMsg.hello = vm.translations['EMAIL_OWNER.HELLO'] + ' ' + receiver.name +
      ',\n';
    emailMsg.content = '\n' + vm.mailContent;
    emailMsg.hierarchy = vm.translations['EMAIL_OWNER.MR/MS'] + ' ' + vm.user +
      ' ' + vm.translations['EMAIL_OWNER.HAS_LEFT_MSG'] + '\n';
    _.forEach(vm.fullParentChain, function(n, index) {
      emailMsg.hierarchy += n.type + ' ' + '"' + n.name + '"';
      if (vm.fullParentChain.length > 1 && index !== (vm.fullParentChain.length -
          1)) {
        emailMsg.hierarchy += ',\n';
      }
    });
    let emailText = '';
    _.forEach(emailMsg, function(value) {
      emailText = emailText + value + '\n';
    });
    let allOwners = vm.emailToDept.parentOwners ? "true" : "false";
    let participants = vm.emailToDept.participants ? "true" : "false";
    let data = {
        initiativeId: initiativeId,
        message: emailText,
        allOwners: allOwners,
        participants: participants
      },
      path = 'send-mail';
    vm.mailContent = '';
    vm.DataService.postData(data, path);
  }
}

export default EmailController;
