'use strict';
var moment = require('moment'),
_ = require('lodash');

var format = 'MM/DD/YYYY',

  postponeDate = function(originalDate, days) {
    return moment(originalDate, format).add(days, 'days').format(format);
  },

  isPast = function(date, afterDate) {
    return (moment(afterDate, format) > moment(date, format));
  };

module.exports = {

  delayActivity: function(days, afterDate) {
    return function(originalActivity) {
      var activity = _.clone(originalActivity);
      ['plannedStartDate', 'plannedEndDate', 'actualStartDate', 'actualEndDate'].forEach(function(dateKey) {
        if (!isPast(activity[dateKey], afterDate)) {
          activity[dateKey] = postponeDate(activity[dateKey], days);
        }
      });
      return activity;
    };
  },

  delayMilestone: function(days, afterDate) {
    return function(originalMilestone) {
      var milestone = _.clone(originalMilestone);
      if (!isPast(milestone.timePoint, afterDate)) {
        milestone.timePoint = postponeDate(milestone.timePoint, days);
      }
      return milestone;
    };
  }

};
