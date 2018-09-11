'use strict';
module.exports = function(req, res, next) {
 req.session.regenerate(function(err) {
   if(err){
     console.log(err);
     return res.end('error');
   }
   console.log('session regenerated now');
   return next();
 });
};
