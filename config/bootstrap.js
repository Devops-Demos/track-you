/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
'use strict';

require('babel-register')({
  retainLines: true,
  presets: ['es2015']
});
require('babel-polyfill');

var chalk = require('chalk');

module.exports.bootstrap = function (cb) {
  var timeMinutes = Number(process.env.JOB_SYNC_INTERVAL) || 60;
  var timeInterval = 1000 * 60 * timeMinutes;

  var getTree = require('../api/controllers/initiative-controller/get-tree');
  var getInitiative = require('../api/controllers/initiative-controller/get-initiative');
  var getPermissions = require('../api/controllers/initiative-controller/get-permissions');
  var getOwnedInitiatives = require('../api/controllers/initiative-controller/owned-initiatives');
  var CronJob = require('cron')
    .CronJob;
  var resetMemoizedFunctions = new CronJob('0 */' + timeInterval + ' * * * *', function () {
    setTimeout(function () {
      console.log('Resetting memoized functions on ', new Date());
      getTree.clear();
      getInitiative.ref.clear();
      getPermissions.ref.clear();
      getOwnedInitiatives.ref.clear();
    }, 1000 * 60 * 5);
  });

  resetMemoizedFunctions.start();

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  // console.log('config: ',sails.config);
  console.log('ServerStartedOn: ', chalk.white(new Date()), 'with PID :', chalk.green(process.pid));
  if (sails.config.models.migrate === 'drop') {
    return DbPopulate.populate(cb);
  }

  cb();
};
