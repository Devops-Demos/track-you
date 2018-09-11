import path from 'path';
import {result} from 'lodash';

var connectionInUse = sails.config.models.connection;
var adapterInUse = result(sails, `config.connections.${connectionInUse}.adapter`, 'sails-mysql');

if (adapterInUse === 'sails-postgresql') {
  console.log('Using postgres queries');
  module.exports.queries = require(path.resolve(__dirname, '../../app-config/queries-postgres.json'));
} else {
  console.log('Using mysql queries');
  module.exports.queries = require(path.resolve(__dirname, '../../app-config/queries-mysql.json'));
}
