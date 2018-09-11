module.exports = {
  attributes: {
    timePoint: {
      type: 'string',
      required: true,
      columnName: 'timepoint'
    },
    targetValue: {
      type: 'string',
      size: 1024,
      required: true,
      columnName: 'targetvalue'
    },
    actualValue: {
      type: 'string',
      size: 1024,
      required: true,
      columnName: 'actualvalue'
    },
    initiativeId: {
      type: 'integer',
      model: 'initiative',
      required: true,
      columnName: 'initiativeid'
    },
    parentId: {
      model: 'artifact2',
      required: true,
      columnName: 'parentid'
    }
  },
  connection : 'memory'
};
