'use strict';
/**
 * Artifact2.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {
    kpi: {
      type: 'string',
      size: 1024
    },
    uom: {
      type: 'string',
      size: 1024
    },
    baseline: {
      type: 'string',
      size: 1024
    },
    target: {
      type: 'string',
      size: 1024
    },
    kpiType: {
      type: 'string',
      size: 1024,
      enum: ['output', 'outcome'],
      columnName: 'kpitype'
    },
    parentKpi: {
      type: 'integer',
      index: true,
      size: 1024,
      columnName: 'parentkpi'
    },
    widget: {
      type: 'string',
      size: 1024
    },
    status: {
      type: 'string',
      size: 50
    },
    hasDrillDown: {
      type: 'boolean',
      columnName: 'hasdrilldown'
    },
    isCalculated: {
      type: 'boolean',
      columnName: 'iscalculated'
    },
    statusSeparator1: {
      type: 'float',
      columnName: 'statusseparator1'
    },
    statusSeparator2: {
      type: 'float',
      columnName: 'statusseparator2'
    },
    sno: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      index: true
    },
    initiativeId: {
      type: 'integer',
      model: 'initiative',
      columnName: 'initiativeid',
      index: true
    },
    'KPI Milestone': {
      collection: 'artifact6',
      via: 'parentId'
    },
    description: {
      type: 'string'
    }
  },
  tableName: 'kpi',


  beforeCreate: Custom.refreshCache,
  afterUpdate: Custom.refreshCache,
  afterDestroy: Custom.refreshCacheMultiple
};
