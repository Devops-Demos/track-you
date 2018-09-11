/**
 * Created by sohamchetan on 27/07/15.
 */
'use strict';
var fs = require('fs');
import _ from 'lodash';
import async from 'async';
import chalk from 'chalk';

var allOk = function (name, cb) {
    return function (err, data) {
      if (err) {
        console.trace('Err:', err);
      }
      var l = data ? data.length : '?';
      console.log('--- ' + l + name + ' populated ---');
      cb(null, 'ok');
    };
  },
  path = require('path'),
  dataPath = path.resolve('./excel-data/data/'),
  readSync = function (dPath) {
    var data = fs.readFileSync(dPath);
    return JSON.parse(data.toString());
  },
  writeToFile = function (fileName) {
    return function (err, data) {
      if (err) {
        console.log(err);
      }
      var jsonData = JSON.stringify(data);
      fs.writeFileSync(path.join(dataPath, fileName), jsonData);
      console.log(fileName, 'written');
    };
  };
// dataPath = '../../fixtures/';
var milestoneTransformer = function (milestoneArray) {
  return _.map(milestoneArray, function (eachMilestone) {
    eachMilestone.timePoint = DataUtils.transformISODateToDateString(DataUtils.transformDateWithFormat(eachMilestone.timePoint, 'DD/MM/YYYY'));
    return eachMilestone;
  });
};
module.exports = {

  populate: function (finalCallback) {
    var tasks = [];
    tasks.push(function (cb) {
      Initiative.destroy({})
        .then(function () {
          return Initiative.create(require(path.join(dataPath, 'initiative.json')), allOk('initiative', () => {}));
        })
        .then(function () {
          return Initiative.update({
            type: 'master'
          }, {
            initiativeId: 0
          }, allOk('master initiative', cb));
        });
    });
    tasks.push(function (cb) {

      Artifact1.destroy({})
        .then(function () {
          Artifact1.create(require(path.join(dataPath, 'a1.json')), allOk('a1', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact2.destroy({})
        .then(function () {
          Artifact2.create(require(path.join(dataPath, 'a2.json')), allOk('a2', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact3.destroy({})
        .then(function () {
          Artifact3.create(require(path.join(dataPath, 'a3.json')), allOk('a3', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact4.destroy({})
        .then(function () {
          Artifact4.create(require(path.join(dataPath, 'a4.json')), allOk('a4', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact6.destroy({})
        .then(function () {
          Artifact6.create(require(path.join(dataPath, 'a6.json')), allOk('a6', cb));
        });
    });
    tasks.push(function (cb) {
      User.destroy({})
        .then(function () {
          return User.create(require(path.join(dataPath, 'users.json')));
        })
        .then(() => {
          User.update({}, {
            password: 'password'
          }, function (err) {
            if (err) {
              console.log('log:', err);
            }
            console.log('---users done---');
            cb();
          });
        });
    });
    tasks.push(function (cb) {
      AppViews.destroy({})
        .then(function () {
          AppViews.create(require(path.join(dataPath, 'appViews.json')), allOk('appView', cb));
          // console.log(require(path.join(dataPath, 'appViews.json')));
        });
    });

    tasks.push(function (cb) {
      ActivityCount.destroy({})
        .then(() => {
          return Initiative.update({}, {
            activityCount: null
          });
        })
        .then(cb, console.log);
    });
    async.parallel(tasks, function () {

      console.log(chalk.green.bold('Database population completed'));
      finalCallback();
    });
  },

  populateMilestones: function () {
    Artifact6.destroy({})
      .then(function () {
        Artifact6.create(require(path.join(dataPath, 'a6.json')), (err, data) => {
          console.log(data.length, 'milestones created');
        });
      });
  },

  populateSync: function () {
    var tasks = [];
    tasks.push(function (cb) {
      Initiative.destroy({})
        .then(function () {
          Initiative.create(readSync(path.join(dataPath, 'initiative.json')), allOk('initiative', cb));
        });
    });
    tasks.push(function (cb) {

      Artifact1.destroy({})
        .then(function () {
          Artifact1.create(readSync(path.join(dataPath, 'a1.json')), allOk('a1', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact2.destroy({})
        .then(function () {
          Artifact2.create(readSync(path.join(dataPath, 'a2.json')), allOk('a2', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact3.destroy({})
        .then(function () {
          Artifact3.create(readSync(path.join(dataPath, 'a3.json')), allOk('a3', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact4.destroy({})
        .then(function () {
          Artifact4.create(readSync(path.join(dataPath, 'a4.json')), allOk('a4', cb));
        });
    });
    tasks.push(function (cb) {
      Artifact6.destroy({})
        .then(function () {
          Artifact6.create(milestoneTransformer(readSync(path.join(dataPath, 'a6.json'))), allOk('a6', cb));
        });
    });
    // tasks.push(function(cb) {
    //   Artifact7.destroy({})
    //     .then(function() {
    //       Artifact7.create(readSync(path.join(dataPath, 'a7.json')), allOk('a7', cb));
    //     });
    // });
    tasks.push(function (cb) {
      User.destroy({})
        .then(function () {
          User.create(readSync(path.join(dataPath, 'users.json')), allOk('user', cb));
        });
    });
    tasks.push(function (cb) {
      AppViews.destroy({})
        .then(function () {
          AppViews.create(require(path.join(dataPath, 'appViews.json')), allOk('appView', cb));
          console.log(require(path.join(dataPath, 'appViews.json')));
        });
    });
    //Only for Minamis project
    async.parallel(tasks, function () {
      Initiative.update({
        type: 'master'
      }, {
        initiativeId: 0,
        parentId: -1
      }, allOk('Master Initiative', function () {
        Custom.recursiveAggregators.startActivityPopulationJob();
        Custom.recursiveAggregators.startKpiCalculationJob();
      }));
    });
  },

  importData: function () {
    User.find({}, writeToFile('users.json'));
    Initiative.find({}, writeToFile('initiative.json'));
    Artifact1.find({}, writeToFile('a1.json'));
    Artifact2.find({}, writeToFile('a2.json'));
    Artifact3.find({}, writeToFile('a3.json'));
    Artifact4.find({}, writeToFile('a4.json'));
    Artifact6.find({}, writeToFile('a6.json'));
    Artifact7.find({}, writeToFile('a7.json'));
  }
};
