/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//test comment
'use strict';
var fs = require('fs'),
path = require('path');

module.exports = {

  testPost: function(req, res) {
    // console.log(req.user);
    console.log(req.socket, req.socket.sessionStore, req.socket.session);
    console.log('cookies:', res.cookies);
    res.json(req.user);
  },

  testCron : function(req, res){
    Custom.recursiveAggregators.startCron();
    res.end('started');
  },

  uploadExcel: function(req, res) {
    var uploadFile = req.file('uploadFile');
    fs.unlink(path.resolve('excel-data/data.xlsx'), function(err){
      if(err){
        console.log('log:',err);
      }
      uploadFile.upload({saveAs:'../../excel-data/data.xlsx'},function onUploadComplete(err, files) {
        //	Files will be uploaded to .tmp/uploads
        if (err) return res.serverError(err);
        //	IF ERROR Return and send 500 error with error
        require('../../excel-data/import-data').start(function(){
          DbPopulate.populateSync();
        });
        res.json({
          status: 200,
          file: files
        });
      });
    });

  }

};
