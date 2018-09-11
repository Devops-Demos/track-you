/**
 * Artifact4.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    currency: {
      type: 'string',
      size: 1024
    },
    upfrontCost: {
      type: 'string',
      size: 1024,
      columnName: 'upfrontcost'
    },
    perMonthCost: {
      type: 'string',
      size: 1024,
      columnName: 'permonthcost'
    },
    comments: {
      type: 'string',
      size: 1024
    },
    sno: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    initiativeId: {
      type: 'integer',
      model: 'initiative',
      columnName: 'initiativeid'
    }
  },
  tableName: 'Budget',

  beforeCreate: Custom.refreshCache,
  afterUpdate: Custom.refreshCache,
  afterDestroy: Custom.refreshCacheMultiple
};
