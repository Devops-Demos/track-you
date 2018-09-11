/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
   * etc. depending on your default view engine) your home page.              *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/


  '/403': {
    view: '403'
  },
  'get /allInitiatives': 'InitiativeController.getAllInitiatives',
  'get /initiative': 'InitiativeController.getInitiative',
  'get /owned-initiatives': 'InitiativeController.getOwnedInitiatives',
  'get /participating-initiatives': 'InitiativeController.getParticipatingInitiatives',
  'delete /initiative/:id': 'InitiativeController.del',
  'post /initiative/postpone': 'InitiativeController.postponeAll',
  // 'get /priorities': 'InitiativeController.getPriorities',
  'get /summary': 'Artifact1Controller.getSummary',
  'get /initiative-tree': 'InitiativeController.getTree',
  'get /skeleton': 'InitiativeController.getSkeleton',

  'get /current-kpis': 'Artifact2Controller.getCurrentKpis',
  'get /kpi': 'Artifact2Controller.getKpi',
  'post /upsert-kpi': 'Artifact2Controller.upsertKpi',
  'delete /kpi/:id': 'Artifact2Controller.deleteKpi',

  'post /update/executive-summary': 'Artifact1Controller.update',
  'get /executive-summary': 'Artifact1Controller.getAll',
  'post /updateInitiative': 'InitiativeController.update',

  'get /milestones': 'Artifact6Controller.getMilestones',

  // 'get /login': {
  //   view: 'login'
  // },

  'post /login': 'AuthController.login',

  '/logout': 'AuthController.logout',

  // 'get /signup': {
  //   view: 'signup'
  // },

  //app views api route
  'get /appviewkpis': 'AppViewsController.getAppViews',
  'get /initiativeViews': 'AppViewsController.getInitiativeViews',


  //test routes
  'get /test-post': 'PostController.testPost',
  'get /test-cron': 'PostController.testCron',

  //Mailer routes
  'post /send-mail': 'MailController.sendMailToInitiativeOwner',

  //User management routes
  'get /user' : 'UserController.getAll',
  'post /user/new': 'UserController.newUser',
  'post /user/reset': 'UserController.resetUser',
  'delete /user/:id': 'UserController.deleteUser',
  'get /current-user-info': 'UserController.currentUserInfo',
  'post /user/change-password': 'UserController.changePassword',

  //meta data
  'get /metadata': 'MetaDataController.sendMetaData',

  'post /upload-excel': 'PostController.uploadExcel',
  'get /upload-excel': {
    view: 'upload-excel'
  },

  //milestone upload
  // 'get /uploadmilestone': {
  //   view: 'upload-milestone'
  // },
  'post /uploadmilestone': 'UploadMilestoneController.uploadMilestones',
  //milestone  download routes
  'get /milestoneformat': 'UploadMilestoneController.getMilestoneFormat',

  //search
  'get /search': 'SearchController.search',

  // 'put /artifact1/:sno' : 'Artifact1Controller.update'
  'put /initiative/:initiativeId' : 'InitiativeController.updateInitiative',

  //meta routes
  //to get logs
  'get /app-logs/:type': 'MetaDataController.getLogs',
  'get /current-version': 'MetaDataController.currentVersion',
  'get /send-weekly-email' : 'MetaDataController.weeklyEmail'

  /***************************************************************************
   *                                                                          *
   * Custom routes here...                                                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the custom routes above, it   *
   * is matched against Sails route blueprints. See `config/blueprints.js`    *
   * for configuration options and examples.                                  *
   *                                                                          *
   ***************************************************************************/

};
