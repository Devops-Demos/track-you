/**
 * Created by sohamchetan on 22/07/15.
 */

'use strict';

module.exports = {

  generateModelAttributes: function (config) {
    var attr = {},
      attachAttribute = function (attrType, attrConfig) {
        return function (n) {
          var attrName = config[attrType + n];
          if (attrName !== null && attrName !== undefined && attrName !== '') {
            attr[attrName] = attrConfig;
          }
        };
      };
    //return text attributes
    _.times(15, attachAttribute('text', {
      type: 'string',
      size: 1024
    }));
    //return boolean attributes
    _.times(5, attachAttribute('flag', {
      type: 'boolean'
    }));
    //reutrn default attributes
    attr.sno = {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    };
    attr.initiativeId = {
      type: 'integer',
      model: 'initiative'
    };
    if (config.parentId) {
      attr.parentId = {
        model: config.parentId
      };
    }
    return attr;
  },

  generateTableName: function (config) {
    return config.name;
  },

  generateAssociations: function (config) {
    var associations = {};
    _.each(config, function (artifact) {
      if (artifact.isUsed === 'TRUE') {
        associations[artifact.name] = {
          collection: artifact.artifact,
          via: 'initiativeId'
        };
      }
    });
    return associations;
  },

  generateArtifactAssociations: function (artifactConfig, allConfig) {
    var associations = {};
    _.each(allConfig, function (artifact) {
      if (artifact.parentId === artifactConfig.artifact) {
        associations[artifact.name] = {
          collection: artifact.artifact,
          via: 'parentId'
        };
      }
    });
    return associations;
  }

};
