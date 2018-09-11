/**
 * Created by sohamchetan on 03/09/15.
 */
'use strict';
var _ = require('lodash');

module.exports = {

  passwords: function (data) {
    var sanitized = _.clone(data);
    delete sanitized.password;
    delete sanitized.tempPassword;
    return sanitized;
  },

  removeNulls: function (data) {
    var sanitized = _.clone(data);
    return _.filter(sanitized, function (eachData) {
      return (eachData !== null && eachData !== undefined && eachData !== 'Infinity');
    });
  },

  arrayBracketsToParantheses: function (stringArray) {
    return stringArray.replace('[', '(')
      .replace(']', ')');
  },

  convertToNumber: function (input) {
    if (isNaN(input) || input === null) {
      return NaN;
    }
    return Number(input);
  },

  parseBoolean: input => input === 'true' ? true : input === 'false' ? false : Boolean(input),

  initiativesFromSkeleton: function (skeleton) {
    var initiatives = _.map(skeleton, function (bone) {
      var returnedBones = [];
      _.times(Object.keys(bone)
        .length / 4,
        function (i) {
          var initiative = bone['initiative' + (i + 1)],
            type = bone['type' + (i + 1)],
            parentId = bone['parentid' + (i + 1)],
            initiativeId = bone['initiativeid' + (i + 1)];
          if (initiative || initiativeId) {
            returnedBones.push({
              initiative: initiative,
              initiativeId: initiativeId,
              type: type,
              parentId: parentId
            });
          }
        });
      return returnedBones;
    });

    return _.unique(_.flatten(initiatives), 'initiativeId');
  },

  arraysToObjects: function (data) {
    if (Array.isArray(data)) {
      return data[0];
    }
    return data;
  }

};
