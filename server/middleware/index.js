var habitat = require('habitat');
var middleware = {};

// Generic error handler.
middleware.errorHandler = function (err, req, res, next) {
  var message;
  var code;

  if (err) {
    console.error(err.stack);
    message = err.message || 'There was an internal server error.';
    code = err.code || 500
  }

  res.status(code).send(message);
};

// CORS
var allowedDomains = habitat.get('ALLOWED_DOMAINS').split(/[\s,]+/);
middleware.cors = function cors(req, res, next) {
    if (allowedDomains.indexOf(req.headers.origin) > -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, Accept-Ranges, Range-Unit, Content-Range, Range');
        res.header('Access-Control-Expose-Headers', 'Content-Type, Accept-Ranges, Range-Unit, Content-Range');
        res.header('Access-Control-Allow-Credentials', true);
    } else {
        res.status(403).send('Your domain is not allowed access');
    }
    next();
};

module.exports = middleware;
