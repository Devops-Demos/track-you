/**
 * Evidence.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      size: 1023,
      defaultsTo: ''
    },
    link: {
      type: 'string',
      size: 4096,
      defaultsTo: ''
    },
    initiativeId: {
      type: 'integer',
      model: 'initiative',
      columnName: 'initiativeid',
      required: true,
      index: true
    },
    sno: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      index: true
    }
  },
  autoPK: true
};
