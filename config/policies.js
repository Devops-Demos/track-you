/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */

var crudUsers = ['isAuthenticated', 'crudUsers','refreshSessionCookie'];
var crudArtifacts = ['isAuthenticated', 'crudArtifacts', 'removeObjectNulls','refreshSessionCookie'];
var crudIssues = ['isAuthenticated', 'crudIssues', 'removeObjectNulls','refreshSessionCookie'];
var crudExecutiveSummaries = ['isAuthenticated', 'crudExecutiveSummaries', 'removeObjectNulls','refreshSessionCookie'];

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions (`true` allows public     *
   * access)                                                                  *
   *                                                                          *
   ***************************************************************************/


  // '*' : true,
  '*': ['isAuthenticated','refreshSessionCookie'],

  AuthController: {
    login: true,
    logout: true
  },

  MetaDataController: {
    currentVersion: true
  },

  //'PostController': {
  //  '*': 'isAuthenticated'
  //},
  InitiativeController: {
    '*' : 'isAuthenticated',
    update: crudArtifacts,
    updateInitiative : crudArtifacts,
    create: crudArtifacts,
    getAllInitiatives: 'isAuthenticated',
    del: crudArtifacts,
    getTree : 'isAuthenticated',
    getInitiative : 'isAuthenticated'
      // getCurrentInitiatives: 'isAuthenticated'
  },

  'UserController': {
    'resetUser': true,
    'newUser': crudUsers,
    'find': 'isAuthenticated',
    'create': crudUsers,
    'update': crudUsers,
    'deleteUser': crudUsers,
    'changePassword': true
  },

  Artifact2Controller: {
    upsertKpi: ['isAuthenticated', 'modifyKpis'],
    create: crudArtifacts,
    deleteKpi: crudArtifacts
  },

  UploadMilestoneController: {
    getMilestoneFormat: ['isAuthenticated', 'crudArtifacts'],
    uploadMilestones:  ['isAuthenticated', 'crudArtifacts']
  },

  Artifact1Controller : {
    create : crudExecutiveSummaries,
    update : crudExecutiveSummaries
  },

  Artifact3Controller : {
    create : crudIssues,
    update : crudIssues
  },
  Artifact4Controller : {
    create : crudArtifacts,
    update : crudArtifacts
  },
  Artifact5Controller : {
    create : crudArtifacts,
    update : crudArtifacts
  },
  Artifact7Controller : {
    create : crudIssues,
    update : crudIssues
  }


  // '*': 'isAuthenticated'
  /***************************************************************************
   *                                                                          *
   * Here's an example of mapping some policies to run before a controller    *
   * and its actions                                                          *
   *                                                                          *
   ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture	: 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
