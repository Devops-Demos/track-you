/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.http.html
 */
'use strict';
import debug from 'debug';

const log = debug('requests');
var useragent = require('useragent');
module.exports.http = {


  /****************************************************************************
   *                                                                           *
   * Express middleware to use for every Sails request. To add custom          *
   * middleware to the mix, add a function to the middleware config object and *
   * add its key to the "order" array. The $custom key is reserved for         *
   * backwards-compatibility with Sails v0.9.x apps that use the               *
   * `customMiddleware` config option.                                         *
   *                                                                           *
   ****************************************************************************/

  middleware: {
    passportInit: require('passport').initialize(),
    passportSession: require('passport').session(),

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP request. (the Sails *
     * router is invoked by the "router" middleware below.)                     *
     *                                                                          *
     ***************************************************************************/

    order: [
      'startRequestTimer',
      'checkUserAgent',
      'cookieParser',
      'session',
      'passportInit',
      'passportSession',
      'bodyParser',
      'handleBodyParserError',
      'setHeaders',
      'myRequestLogger',
      'compress',
      'methodOverride',
      'poweredBy',
      '$custom',
      'router',
      'www',
      'favicon',
      '404',
      '500'
    ],

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/

    myRequestLogger: function(req, res, next) {
      var getUser = function() {
          if (!req.user) {
            return ', User: Unauthorized user';
          }
          return ', User: ' + req.user.email;
        };
      if (req.method !== 'GET') {
        console.log('[' + (new Date()) + ']','Requested :: ', req.method, req.url, getUser(), ', IP :', req.ip);
      } else{
        log('[' + (new Date()) + ']','Requested :: ', req.method, req.url, getUser(), ', IP :', req.ip);
      }
      return next();
    },

    setHeaders: function(req, res, next){
      res.setHeader('Cache-control','no-cache, no-store, must-revalidate, private');
      res.setHeader('Pragma','no-cache');
      res.setHeader('X-Frame-Options','SAMEORIGIN');
      res.setHeader('X-Content-Type-Options','nosniff');
      res.setHeader('X-XSS-Protection','1');
      // res.set('Pragma','no-cache');
      return next();
    },

    checkUserAgent : function(req, res, next){
        var agent = useragent.is(req.headers['user-agent']);
        if(agent.ie){
          return res.render('incompatible-browser.ejs');
        }
        return next();
    }


    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests. By    *
     * default as of v0.10, Sails uses                                          *
     * [skipper](http://github.com/balderdashy/skipper). See                    *
     * http://www.senchalabs.org/connect/multipart.html for other options.      *
     *                                                                          *
     ***************************************************************************/

    // bodyParser: require('skipper')

  }
  //app.engine('html', require('ejs').renderFile);
  /***************************************************************************
   *                                                                          *
   * The number of seconds to cache flat files on disk being served by        *
   * Express static middleware (by default, these files are in `.tmp/public`) *
   *                                                                          *
   * The HTTP static cache is only active in a 'production' environment,      *
   * since that's the only time Express will cache flat-files.                *
   *                                                                          *
   ***************************************************************************/

  // cache: 31557600000
};
