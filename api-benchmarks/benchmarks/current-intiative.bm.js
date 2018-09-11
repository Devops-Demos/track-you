'use strict';
import {
  address
}
from '../config';
import Benchmark from 'benchmark';
import url from 'url';



let bench = (authReq, options) => {
  const {apiPath, info} = options;
  const apiUrl = url.resolve(address, apiPath);
  const name = info ? info + apiPath : apiPath;
  return new Benchmark(name, {
    defer: true,
    fn: function (deferred) {
      authReq.get(apiUrl).end(function (err, res) {
        if (err) {
          console.log('log:', err);
        }
        // console.log('status : ', res.status);
        deferred.resolve();
      });
    }
  });
};

module.exports = bench;
