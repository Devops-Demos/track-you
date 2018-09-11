/**
 * Created by sohamchetan on 28/07/15.
 */
'use strict';
var moment = require('moment'),
  _ = require('lodash');

module.exports = {

  getNestedPairs: function (config) {
    var nestedPairs = [];
    _.each(config, function (artifact) {
      if (artifact.parentId) {
        var nest = {};
        nest.inner = artifact.name;
        nest.outer = _.filter(config, {
          artifact: artifact.parentId
        })[0].name;
        nestedPairs.push(nest);
      }
    });
    return nestedPairs;
  },

  generateNestedData: function (nestedPairs) {
    return function (eachData) {
      var returnedData = _.clone(eachData);

      _.each(nestedPairs, function (nestedPair) {
        returnedData[nestedPair.outer] = _.map(returnedData[nestedPair.outer], function (eachInnerData) {
          eachInnerData[nestedPair.inner] = _.filter(eachData[nestedPair.inner], {
            parentId: eachInnerData.sno
          });
          return eachInnerData;
        });
      });
      return returnedData;
    };
  },

  mapDeep: function (data, outerKey, innerKey, mapFunction) {
    //data is an array of KPIs
    return _.map(data, function (eachData) {
      //eachData is a single KPI
      //eachData[outerKey] is an array of milestones
      eachData[outerKey] = _.map(eachData[outerKey], function (eachInnerData) {
        //eachInnerData is a single milestone
        eachInnerData[innerKey] = mapFunction(eachInnerData[innerKey]);
        return eachInnerData;
      });
      return eachData;
    });
  },

  transformDate: timePoint => timePoint ? moment(new Date(timePoint)).toISOString() : 'Invalid date',

  transformDateWithFormat: function (timePoint, formatstring) {
    var momentTimePoint = moment(timePoint, formatstring);
    if (momentTimePoint.toString() === 'Invalid date') {
      return 'Invalid date';
    }
    return momentTimePoint.toISOString();
  },
  transformISODateToDateString: function (isoDate) {
    var date = new Date(isoDate);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  },
  randString: function (x) {
    var s = '',
      r;
    while (s.length < x && x > 0) {
      r = Math.random();
      s += (r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65)));
    }
    return s;
  },

  sanitize: require('./data-utils/sanitize'),

  kpi: require('./data-utils/kpi'),

  delayInitiatives: require('./data-utils/delay-initiatives'),

  activityData: require('./data-utils/activity-data')

};
