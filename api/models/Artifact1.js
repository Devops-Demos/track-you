/**
 * Artifact1.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    sectorSummary: {
      type: 'text',
      columnName: 'sectorsummary'
    },
    decisionsRequired: {
      type: 'text',
      columnName: 'decisionsrequired'
    },
    majorIssues: {
      type: 'text',
      columnName: 'majorissues'
    },
    proposedSolution: {
      type: 'text',
      columnName: 'proposedsolution'
    },
    accomplishments: {
      type: 'text',
      columnName: 'accomplishments'
    },
    plannedActivities: {
      type: 'text',
      columnName: 'plannedactivities'
    },
    keyPerformanceDrivers: {
      type: 'text',
      columnName: 'keyperformancedrivers'
    },
    sectorReformActivities: {
      type: 'text',
      columnName: 'sectorreformactivities'
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
  tableName: 'executivesummary',
  autoPK: true,

  beforeCreate: Custom.refreshCache,
  afterUpdate: Custom.refreshCache,
  afterDestroy: Custom.refreshCacheMultiple
};
