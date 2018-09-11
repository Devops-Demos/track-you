'use strict';
require('babel-register')({
  retainLines: true,
  presets: ['es2015']
});
require('babel-polyfill');
require('./begin-benchmarks');
