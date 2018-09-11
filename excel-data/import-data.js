'use strict';

var xlsxj = require('xlsx-to-json'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  async = require('async'),
  sheets = [{
    sheet: 'initiatives',
    output: 'initiative.json'
  }, {
    sheet: 'executiveSummary',
    output: 'a1.json'
  }, {
    sheet: 'kpis',
    output: 'a2.json'
  }, {
    sheet: 'issues',
    output: 'a3.json'
  }, {
    sheet: 'budget',
    output: 'a4.json'
  }, {
    sheet: 'kpiMilestone',
    output: 'a6.json'
  }, {
    sheet: 'risks',
    output: 'a7.json'
  },{
    sheet: 'appViews',
    output: 'appViews.json'
  }],

  cleanUp = function(data) {
    Object.keys(data).forEach(function(key) {
      if (data[key] === '') {
        data[key] = null;
      }
    });
    return data;
  },

  removeNullObjects = function(arr){
    var returnArr = [];
    arr.forEach(function(element){
      var uniques = _.unique(_.map(element));
      if(uniques.length === 1 && (uniques[0] === null || uniques[0] === '') ){
        return;
      }
      returnArr.push(element);
    });
    return returnArr;
  },

  importExcelData = function(callback) {
    var tasks = [];
    sheets.forEach(function(sheet) {
      tasks.push(function(cb) {
        xlsxj({
          input: path.resolve('./excel-data/data.xlsx'),
          output: null, //'./data/' + sheet.output,
          sheet: sheet.sheet
        }, function(err, result) {
          if (err) {
            console.error(err);
          } else {
            // console.log(result);
            var shortenedData = removeNullObjects(result);
            console.log(shortenedData.length);
            var cleanedResult = _.map(shortenedData, function(eachResult) {
              return cleanUp(eachResult);
            });
            fs.writeFile(path.resolve('./excel-data/data/' + sheet.output), JSON.stringify(cleanedResult), cb);
          }
        });
      });
    });
    async.parallel(tasks,callback);
  };

module.exports = {
  start: importExcelData
};
