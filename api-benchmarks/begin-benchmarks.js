'use strict';
import {
  address,
  apis,
  adminApis
}
from './config';
import async from 'async';
import bench from './benchmarks/current-intiative.bm';
import adminBench from './benchmarks/admin-benchmarks.bm';
import url from 'url';
import chalk from 'chalk';
import _ from 'lodash';

let authReq = require('superagent').agent();
let tasks = [];
let cycleHandler = function () {
  let self = this;
  self.cycleCount = self.cycleCount + 1 || 0;
  console.log(chalk.green(self.name), ':', chalk.white(self.cycleCount));
};

let start = (benchmark) => {
  tasks.push(cb => benchmark
    .on('complete', function () {
      cb(null, this);
    })
    .on('cycle', cycleHandler)
    .run()
  );
};

let reportStats = (err, results) => {
  if (err) {
    console.log('Error: ', err);
  }
  let jsonResults = results.map(result => {
    let allTimes = result.stats.sample;
    let minTime = _.min(allTimes);
    let maxTime = _.max(allTimes);
    console.log(`
      Results for : ${chalk.green(result.name)}
      Minimum : ${minTime} seconds
      Maximum : ${maxTime} seconds
      Average : ${result.stats.mean}
      Out of ${allTimes.length} samples taken
      `);
    return {
      'API': result.name,
      'Minimum time(s)': minTime,
      'Maximum time(s)': maxTime,
      'Average time(s)': result.stats.mean,
      'Number of samples': allTimes.length,
      'All Sample timings (s)': JSON.stringify(allTimes)
    };
  });
  console.log(JSON.stringify(jsonResults));
};

authReq.post(url.resolve(address, '/login')).send({
  email: 'admin@test.com',
  password: 'password'
}).end(function () {
  apis.map(apiPath => bench(authReq, {
    apiPath
  })).forEach(start);

  adminApis.map(adminApi => adminBench(authReq, adminApi))
  .forEach(start);

  async.series(tasks, reportStats);
});
