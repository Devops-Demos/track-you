class UploadMilestoneController {
  constructor(DataService, pushAppConstants, $rootScope, $translate) {
    'ngInject';
    let vm = this;
    vm.DataService = DataService;
    vm.$rootScope = $rootScope;
    vm.CONSTANTS = pushAppConstants;
    vm.showUploadModal = true;
    vm.showErrorModal = false;
    vm.showSuccessModal = false;
    vm.translationHolder = ['MILESTONE_TEMPLATE.SNO', 'MILESTONE_TEMPLATE.ERROR_TYPE', 'MILESTONE_TEMPLATE.INITIATIVE_ID', 'MILESTONE_TEMPLATE.INITIATIVE_NAME', 'MILESTONE_TEMPLATE.PARENT_ID', 'MILESTONE_TEMPLATE.KPI_NAME', 'MILESTONE_TEMPLATE.TIME_POINT', 'MILESTONE_TEMPLATE.TARGET_VALUE', 'MILESTONE_TEMPLATE.ACTUAL_VALUE', 'MILESTONE_TEMPLATE.MILESTONE_UPDATED_SUCCESSFULLY'];
    $translate(vm.translationHolder).then(function (translations) {
      vm.translations = translations;
      vm.errorHeadings = [vm.translations['MILESTONE_TEMPLATE.SNO'], vm.translations['MILESTONE_TEMPLATE.ERROR_TYPE'], vm.translations['MILESTONE_TEMPLATE.INITIATIVE_ID'], vm.translations['MILESTONE_TEMPLATE.INITIATIVE_NAME'], vm.translations['MILESTONE_TEMPLATE.PARENT_ID'], vm.translations['MILESTONE_TEMPLATE.KPI_NAME'], vm.translations['MILESTONE_TEMPLATE.TIME_POINT'], vm.translations['MILESTONE_TEMPLATE.TARGET_VALUE'], vm.translations['MILESTONE_TEMPLATE.ACTUAL_VALUE']];
    });
    vm.keys = ['initiativeId', 'initiativeName', 'parentId', 'kpiName', 'timePoint', 'targetValue', 'actualValue'];
  }

  CSVToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");

    var arrData = [
      []
    ];
    var arrMatches = objPattern.exec(strData);
    while (arrMatches) {
      var strMatchedDelimiter = arrMatches[1];
      if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)) {
        arrData.push([]);
      }
      var strMatchedValue;
      if (arrMatches[2]) {
        strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
      } else {
        strMatchedValue = arrMatches[3];
      }
      arrData[arrData.length - 1].push(strMatchedValue);
      arrMatches = objPattern.exec(strData);
    }
    return (arrData);
  }

  CSV2JSON(csv) {
    var array = this.CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
      objArray[i - 1] = {};
      for (var k = 0; k < array[0].length && k < array[i].length; k++) {
        var key = array[0][k];
        objArray[i - 1][key] = array[i][k];
      }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
  }

  uploadTemplate() {
    let vm = this;
    vm.btnSpinner = true;
    let path = 'uploadmilestone';
    let reader = new FileReader();
    reader.readAsText(document.getElementById('milestoneData').files[0]);
    reader.onload = function (event) {
      var csvData = event.target.result;
      var data = JSON.parse(vm.CSV2JSON(csvData));
      data = _.reject(data, {
        sno: ""
      });
      vm.DataService.postData({
        milestone: data
      }, path).then(function (response) {
        vm.btnSpinner = false;
        if (response.status && response.status.toLowerCase() === 'errors') {
          vm.showUploadModal = false;
          vm.errorData = response.errors;
          vm.showErrorModal = true;
        } else if (response.status && response.status.toLowerCase() === 'error') {
          vm.showUploadModal = false;
          vm.modalMessage = response.message;
          vm.showSuccessModal = true;
        } else {
          vm.showUploadModal = false;
          vm.modalMessage = vm.translations['MILESTONE_TEMPLATE.MILESTONE_UPDATED_SUCCESSFULLY'];
          vm.showSuccessModal = true;
        }
      });
    };
  }

  closeUploadModal() {
    let vm = this;
    vm.$rootScope.$broadcast('CLOSE_UPLOAD_MODAL');
    vm.showUploadModal = false;
    vm.newMilestone = false;
    vm.milestoneData = undefined;
  }
}

export default UploadMilestoneController;
