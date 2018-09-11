/**
 * UploadMilestoneController
 *
 * @description :: Server-side logic for managing uploadmilestones
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
'use strict';
import debug from 'debug';
import _ from 'lodash';
import moment from 'moment';
import {
  Converter
} from 'csvtojson';
import {
  validate
} from 'jsonschema';
import milestoneSchema from '../../api/models/validation-schemas/milestones.json';

var fs = require('fs'),
  path = require('path');

const log = debug('kpi-csv');
const milestoneUploadLog = debug('milestone-upload-log');
const handle = err => {
  if (err) {
    console.trace(err);
  }
};

var findIniativeName = function(initiativeId) {
  return Initiative.findOne({
    initiativeId: initiativeId
  }).then(function(initiativeElement) {
    return initiativeElement.initiative;
  });
};

var convertToCSV = function(json) {
  var fields = Object.keys(json[0]||{});
  var csv = json.map(function(row) {
    return fields.map(function(fieldName) {
      return '"' + (row[fieldName] || '') + '"';
    });
  });
  csv.unshift(fields); // add header column
  return csv.join('\r\n');
};

var getMilestoneFormat = function(req, res) {
  Artifact2.find({
    isCalculated: false
  }).populateAll().then(function(requireMilestoneKpis) {
    var milestonePromises = requireMilestoneKpis.map(function(eachKpi, i) {
      var prevDate = moment(new Date()).subtract(1, 'days');
      if (!eachKpi.initiativeId) {
        log('log:', 'initiativeId is invalid', eachKpi);
        return {
          sno: null
        };
      }
      log('log:', eachKpi.initiativeId.initiative);
      return {
        sno: i + 1,
        initiativeId: eachKpi.initiativeId.initiativeId,
        initiativeName: eachKpi.initiativeId.initiative,
        parentId: eachKpi.sno,
        kpiName: eachKpi.kpi,
        timePoint: prevDate.format('DD/MM/YYYY'),
        targetValue: '',
        actualValue: ''

      };
    }, function(err) {
      console.trace(err);
    });
    return Promise.all(milestonePromises);
  }).then(function(milestoneJsonFormat) {
    res.set('Content-Type', 'application/octet-stream');
    var filename = 'milestoneFormat.csv';
    res.set({
      'Content-Disposition': 'attachment; filename="' + filename + '"',
      'Content-Type': 'text/csv'
    });
    milestoneJsonFormat = milestoneJsonFormat.filter(milestone => (milestone.sno !== null));

    res.send(convertToCSV(milestoneJsonFormat));
  }, console.log);
};

let buildErrorReport = validationErrorReport => {
  return validationErrorReport.errors.map(error => {
    let [milestoneAddress, milestoneErrorProperty] = error.property.split('.');
    let milestoneWithError = _.clone(_.result(validationErrorReport, milestoneAddress));
    milestoneWithError.error = milestoneErrorProperty + ' ' + error.message;
    return milestoneWithError;
  });
};

var newUploadMilestones = (req, res) => {
  // let uploadFile = req.file('milestoneData');
  // console.log('upload file : ', uploadFile);
  // let fileString = '';

  let createMilestones = (milestones) => {
    if (!Array.isArray(milestones)) {
      return console.log('ERROR : milestones is not an array : ', milestones);
    }
    milestones = milestones.map(milestone => {
      delete milestone.sno;
      milestone.timePoint = moment(milestone.timePoint, 'DD/MM/YYYY').format('MM/DD/YYYY');
      return milestone;
    });
    console.log(`
      ${milestones.length} Milestones to be uploaded`);
    Artifact6.create(milestones)
      .then(createdMilestones => console.log(`
      ${createdMilestones.length} Milestones uploaded through CSV on ${new Date()}
      `),
        err => {
          console.log(`ERROR : ${err} in uploading Milestones through CSV`);
        }
      );
  };

  let processMilestones = (err, milestones) => {
    handle(err);
    let validationErrorReport = validate(milestones, milestoneSchema);
    let {
      errors
    } = validationErrorReport;

    if (Array.isArray(errors) && errors.length > 0) {
      let errorList = buildErrorReport(validationErrorReport);
      return res.json({
        errors: errorList,
        status: 'ERRORS'
      });
    }

    createMilestones(milestones);
    return res.json({
      status: 'OK'
    });
  };

  let filterEachMilestone = milestone => {
    let keys = Object.keys(milestone);
    let allAreNotBlank = keys.reduce((previousCondition, currentKey) => previousCondition || milestone[currentKey] !== '', false);
    return keys.length === 8 && allAreNotBlank;
  };

  console.log('log:', req.body);
  let milestones = _.result(req, 'body.milestone', null);

  if (!milestones) {
    console.trace('No milestones sent');
    return res.json({
      status: 'ERROR',
      message: 'No milestones sent'
    });
  }

  milestones = milestones.map(milestone => {
      milestone.initiativeId = parseInt(milestone.initiativeId);
      milestone.parentId = parseInt(milestone.parentId);
      return milestone;
    })
    .filter(filterEachMilestone);

  processMilestones(null, milestones);

};

module.exports = {
  getMilestoneFormat: getMilestoneFormat,
  uploadMilestones: newUploadMilestones
};
