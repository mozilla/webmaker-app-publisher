var express = require('express');
var middleware = require('../middleware');

module.exports = function (auth) {
    var router = express.Router();

    router.get('/healthcheck', require('./healthcheck'));
    router.post('/publish/webmaker-app', require('./webmaker-app'));

    // DEPRECATED
    router.post('/publish', middleware.cors, require('./publish'));

    router.options('*', middleware.cors);

    return router;
};
