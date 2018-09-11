'use strict';

require('./import-data').start(function(){
  console.log('Done');
  console.log('Starting sails console in drop mode');
  process.exit();
});
