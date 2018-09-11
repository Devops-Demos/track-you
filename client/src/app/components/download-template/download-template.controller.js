class DownloadTemplateController {
  constructor(pushAppConstants, $rootScope) {
    'ngInject';
    let vm = this;
    vm.$rootScope = $rootScope;
    vm.showDownloadModal = true;
    vm.CONSTANTS = pushAppConstants;
  }

  downloadTemplate() {
    let vm = this;
    window.open(vm.CONSTANTS.server.url + 'milestoneformat', '_blank');
    vm.closeModal();
  }

  closeModal() {
    let vm = this;
    vm.showDownloadModal = false;
    vm.$rootScope.$broadcast('CLOSE_DOWNLOAD_MODAL');
  }
}

export default DownloadTemplateController;
