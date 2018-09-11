'use strict';
import {
  queries
} from '../services/getQueries';
import {
  intersection,
  contains
} from 'lodash';
import isNumber from 'isnumber';

var bcrypt = require('bcryptjs'),
  async = require('async'),
  hashPassword = function (password, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, cb);
    });
  },
  encrypt = function (user, cb) {
    if (!user.password && !user.tempPassword) {
      return cb();
    }
    var tasks = [];
    if (user.password) {
      tasks.push(function (done) {
        hashPassword(user.password, function (err, hash) {
          user.password = hash;
          done();
        });
      });
    }
    if (user.tempPassword) {
      tasks.push(function (done) {
        hashPassword(user.tempPassword, function (err, hash) {
          user.tempPassword = hash;
          done();
        });
      });
    }

    async.parallel(tasks, cb);

  };

const validateOwnerInitiativePromise = originalFunction => (owner, initiativeId) => {
  if (!isNumber(owner) || !isNumber(initiativeId)) {
    throw new TypeError(`owner (${owner}) and initiativeId (${initiativeId}) must be a number`);
  }
  const userId = Number(owner);
  initiativeId = Number(initiativeId);
  return originalFunction(userId, initiativeId);
};

module.exports = {
  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    name: {
      type: 'string'
    },
    department: {
      type: 'string'
    },
    role: {
      type: 'string'
    },
    password: {
      type: 'string',
      minLength: 6
        //required: true
    },
    initiatives: {
      collection: 'initiative',
      via: 'owner'
    },
    isPasswordReset: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'ispasswordreset'
    },
    tempPassword: {
      type: 'string',
      columnName: 'temppassword'
    },
    viewAll: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'viewall'
    },
    updateAllOutComeKpis: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'updatealloutcomekpis'
    },
    updateAllOutputKpis: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'updatealloutputkpis'
    },
    updateAllIssueLogs: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'updateallissuelogs'
    },
    updateAllActivities: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'updateallactivities'
    },
    updateAllExecutiveSummaries: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'updateallexecutivesummaries'
    },
    crudArtifacts: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'crudartifacts'
    },
    crudUsers: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'crudusers'
    },
    viewParentage: {
      type: 'boolean',
      defaultsTo: false,
      columnName: 'viewparentage'
    },

    participatedInitiatives: {
      collection: 'initiative',
      via: 'participants'
    },
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      delete obj.tempPassword;
      return obj;
    }
  },
  beforeCreate: encrypt,
  beforeUpdate: encrypt,

  getParticipatedInitiativeIds: (ownerId) => new Promise((resolve, reject) => {
    const userId = Number(ownerId);
    const query = queries.getParticipatedInitiatives.replace('{userId}', userId);
    User.query(query, (err, data) => {
      if (err) {
        return reject(err);
      }
      const participatedInitiatives = data.rows || data;
      const participatedInitiativeIds = participatedInitiatives.map(initiative => initiative.initiative_participants);
      resolve(participatedInitiativeIds);
    });
  }),

  isParticipant: validateOwnerInitiativePromise((owner, initiativeId) => Promise.all([User.getParticipatedInitiativeIds(owner), Custom.treeUtils.getInitiativeIdsUp([initiativeId])])
      .then(([participatedInitiativeIds, parentIdChain]) => (intersection([initiativeId, ...parentIdChain], participatedInitiativeIds).length > 0))),

  canView : (owner, initiativeId, options ={}) => {
    if(options.viewAll === true){
      return Promise.resolve(true);
    }
    owner = Number(owner);
    initiativeId = Number(initiativeId);
    return Custom.treeUtils.getAllInitiativeIdsForOwner(owner, options)
    .then(initiativeIds => contains(initiativeIds, initiativeId));
  }
};
