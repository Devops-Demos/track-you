/**
 * Created by sohamchetan on 04/09/15.
 */

module.exports = {

  attributes: {
    initiativeId : {
      model: 'initiative'
    },
    completed : {
      type: 'integer'
    },
    onTrack : {
      type: 'integer',
      columnName: 'ontrack'
    },
    delayed : {
      type: 'integer'
    }
  }
};

