'use strict';
module.exports = function(req, res, next) {
    // console.log('log:','refreshing session cookie');
    req.session._garbage = Date();
    req.session.touch();
    return next();
};
