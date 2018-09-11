/**
 * Artifact5.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    activity: {
      type: 'string',
      size: 1024
    },
    plannedStartDate: {
      type: 'string',
      size: 1024,
      columnName: 'plannedstartdate'
    },
    plannedEndDate: {
      type: 'string',
      size: 1024,
      columnName: 'plannedenddate'
    },
    actualStartDate: {
      type: 'string',
      size: 1024,
      columnName: 'actualstartdate'
    },
    actualEndDate: {
      type: 'string',
      size: 1024,
      columnName: 'actualenddate'
    },
    levelOfAchievment: {
      type: 'string',
      size: 1024,
      columnName: 'levelofachievment'
    },
    status: {
      type: 'string',
      size: 1024
    },
    dept: {
      type: 'string',
      size: 1024
    },
    owner: {
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
  tableName: 'Activites'
};
