'use strict';
/**
 * Artifact6.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  autoCreatedAt : false,
  autoUpdatedAt : false,

  attributes: {
    timePoint: {
      type: 'date',
      columnName: 'timepoint'
    },
    targetValue: {
      type: 'string',
      size: 1024,
      columnName: 'targetvalue'
    },
    actualValue: {
      type: 'string',
      size: 1024,
      columnName: 'actualvalue'
    },
    sno: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    initiativeId: {
      type: 'integer',
      model: 'initiative',
      columnName: 'initiativeid',
      required : true,
      index: true
    },
    parentId: {
      model: 'artifact2',
      columnName: 'parentid',
      type : 'integer',
      index : true
    }
  },
  tableName: 'KPI Milestone'
};
