/*globals MilestoneCheck:true , _:true*/
'use strict';
var fs = require('fs');
var path = require('path');
var Converter = require('csvtojson').Converter;


var getJson = function() {
  return new Promise(function(resolve, reject) {
    var converter = new Converter({
      checkType: false
    });
    converter.on('end_parsed', resolve);
    converter.on('error', reject);
    fs.createReadStream(path.resolve('./excel-data/milestoneData')).on('error', function(error) {
      console.log('Error:', error);
      reject();
    }).pipe(converter);
  });
};

var checkListOfMilestones = function(jsonArray) {
  var createPromiseArray = [];
  _.forEach(jsonArray, function(eachRow) {
    var eachRowPromise = MilestoneCheck.create(eachRow).then(function(created) {
      return {
        status: 'ok',
        sno: eachRow.sno,
        details: created
      };
    }, function(error) {
      return {
        status: 'failed',
        sno: eachRow.sno,
        details: error
      };
    });
    createPromiseArray.push(eachRowPromise);
  });
  return Promise.all(createPromiseArray);
};

var findDuplicates = function(jsonArray) {
  var duplicateArray = [];
  _.forEach(jsonArray, function(eachRow) {
    var dupPromise = Artifact6.find({
      initiativeId: eachRow.initiativeId,
      parentId: eachRow.parentId
    }).then(function(matchingKpiMilestones) {
      var checkDate = new Date(DataUtils.transformDateWithFormat(eachRow.timePoint,'DD/MM/YYYY'));
      for (var index = 0; index < matchingKpiMilestones.length; ++index) {
        var eachMilestone = matchingKpiMilestones[index];
        var milstonedate = new Date(DataUtils.transformDateWithFormat(eachMilestone.timePoint,'MM/DD/YYYY'));
        if (milstonedate.getTime() === checkDate.getTime()) {
          return {
            status: 'failed',
            sno: eachRow.sno,
            details: {
              'error': 'DUPLICATE',
              'dupElement': eachMilestone
            }
          };
        }
      }
      return {
        status: 'ok',
        sno: eachRow.sno,
        details: 'No duplicates found'
      };

    }, function(err) {
      return {
        status: 'failed',
        sno: eachRow.sno,
        details: err
      };
    });
    duplicateArray.push(dupPromise);
  });
  return Promise.all(duplicateArray);
};

var updateMilestonesInDb = function(errorsList, jsonArray) {
  if (errorsList.length === 0) {
    var toUpload = _.map(jsonArray, function(eachRow) {
      return {
        initiativeId: eachRow.initiativeId,
        parentId: eachRow.parentId,
        timePoint: DataUtils.transformISODateToDateString(DataUtils.transformDateWithFormat(eachRow.timePoint,'DD/MM/YYYY')),
        targetValue: eachRow.targetValue,
        actualValue: eachRow.actualValue,
        uom: eachRow.uom
      };
    });
    Artifact6.create(toUpload).then(function(uploaded) {
      console.log('KPI Milestones added ', uploaded.length, uploaded);
    });
  }
};


var cleanJson = function(jsonArray) {
  var cleanedArray = [];
  _.forEach(jsonArray, function(eachElement) {
    var contentLength = _.values(eachElement).join('').trim().length;
    if(contentLength !== 0){
      cleanedArray.push(eachElement);
    }
  });
  return cleanedArray;
};

var verifyMilestones = function() {
  MilestoneCheck.destroy({}).then(function() {
    console.log('cleaning up MilestoneCheck');
  });
  return getJson().then(cleanJson).then(function(jsonArray) {
    return checkListOfMilestones(jsonArray).then(function(checkedResults) {
      return findDuplicates(jsonArray).then(function(allResults) {
        var filtered = _.filter(allResults.concat(checkedResults), {
          status: 'failed'
        });
        updateMilestonesInDb(filtered, jsonArray);
        return filtered;
      }, function(err) {
        return checkedResults.concat([{
          status: 'failed',
          details: err,
          sno: -1
        }]);
      });
    }, function(err) {
      return {
        status: 'failed',
        details: err,
        sno: -1
      };
    });
  }, function(err) {
    console.log('Error converting CSV to JSON');
    return {
      status: 'failed',
      details: [err, 'Error converting csv to json'],
      sno: -1
    };
  });
};

module.exports = {
  verifyMilestones: verifyMilestones
};
