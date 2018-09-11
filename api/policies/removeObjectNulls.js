'use strict';
module.exports = function (req, res, next) {

  Object.keys(req.body).forEach(function(eachKey){
    if(req.body[eachKey] === ''){
      req.body[eachKey] = null;
    }
  });

  next();
};
