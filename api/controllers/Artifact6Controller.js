/**
 * Artifact6Controller
 *
 * @description :: Server-side logic for managing artifact6s
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

'use strict';

var _ = require('lodash');

var DEFAULT_DAYS = 7;

module.exports = {
  getMilestones: function(req, res) {
    // if (!req.isAuthenticated()) {
    //   return res.json({
    //     status: 'error',
    //     message: 'User not Authenticated.'
    //   });
    // }

    if (!req.param || !req.param('kpiId')) {
      res.status(400).json({
        status: 'kpiId is required'
      });
      return;
    }

    var kpiId = req.param('kpiId');
    var period = req.param('period') || DEFAULT_DAYS;

    return Artifact6.find({
      parentId: req.param('kpiId')
    }).then(function(milestones) {
      milestones = _.filter(milestones, function(milestone) {
        return (new Date(milestone.timePoint).setHours(0, 0, 0, 0) - new Date(new Date().setDate(new Date().getDate() - period)).setHours(0, 0, 0, 0) >= 0);
      });
      res.status(200).json(milestones);
    });
  }
};