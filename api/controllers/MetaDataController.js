/**
 * MetaDataController
 *
 * @description :: Server-side logic for managing metadatas
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';

var _ = require('lodash'),
fs = require('fs');

module.exports = {
  sendMetaData: function (req, res) {
    User.find({select: ['department']})
      .then(function (data) {
        res.json(
          {
            departments: DataUtils.sanitize.removeNulls(_.unique(_.pluck(data, 'department')))
          });
      });
  },

  getLogs : function(req, res){
    var filename = req.params.type === 'error' ? './err_logs.log' : './app_logs.log';
    fs.readFile(filename,function(err, buff){
      if(err){
        return res.end(err);
      }
      var currentTime = 'Current Server Time: ' + (new Date()).toString() + '\n';
      res.end(currentTime + buff.toString());
    });
  },

  currentVersion : function(req, res){
    res.end('saudi app - updated on 7-Mar-2016');
  },

  weeklyEmail : function(req, res){
    Custom.cronJobs.weeklyEmailToOwners();
    res.send('Email sent');
  }

};
