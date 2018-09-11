/**
 * Artifact3.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
module.exports = {
  attributes: {
    issue: {
      type: 'string',
      size: 1024
    },
    nextSteps: {
      type: 'string',
      size: 1024,
      columnName: 'nextsteps'
    },
    keyMilestones: {
      type: 'string',
      size: 1024,
      columnName: 'keymilestones'
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
  tableName: 'Issues',
  beforeCreate : Custom.refreshCache,
  afterUpdate : Custom.refreshCache,
  afterDestroy : Custom.refreshCacheMultiple
};
