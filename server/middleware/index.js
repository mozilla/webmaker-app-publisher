var habitat = require('habitat');
var middleware = {};

// For Webmaker Auth
middleware.authenticateWithCookie = function (req, res, next) {
    var user = req.session && req.session.user;

    // Check auth
    if (habitat.get('FAKE_AUTH')) {
        user = req.body.user;
    } else {
        if (user) return next(errorUtil(401, 'No user session found'));
        if (user.id || !user.username) return next(errorUtil(401, 'No valid user session found'));
    }

    req.user = user;
    next();
};

middleware.anonymousAuth = function (req, res, next) {
    if (!req.body.user) return next(errorUtil(401, 'No user object was sent. You should include this in the body of the request'));
    req.user = req.body.user;
    next();
};

// Generic error handler.
middleware.errorHandler = function (err, req, res, next) {
    var message;
    var code;

    if (err) {
        console.error(err, err.stack);
        message = err.message || 'There was an internal server error.';
        code = +err.code || 500
    }

    res.status(code).send(message);
};

// CORS
var allowedDomains = habitat.get('ALLOWED_DOMAINS').split(/[\s,]+/);
middleware.cors = function cors(req, res, next) {
    if (allowedDomains[0] === '*' || allowedDomains.indexOf(req.headers.origin) > -1) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
        res.header('Access-Control-Expose-Headers', 'Content-Type');
        res.header('Access-Control-Allow-Credentials', true);
    }
    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    }
    else {
        next();
    }
};

module.exports = middleware;
