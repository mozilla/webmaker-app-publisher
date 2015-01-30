var express = require('express');
var middleware = require('../middleware');

module.exports = function (auth) {
    var router = express.Router();

    router.get('/healthcheck', require('./healthcheck'));
    router.post('/publish/image-request', middleware.cors, require('./image-request'));
    router.post('/publish/webmaker-app', middleware.cors, require('./webmaker-app'));

    router.options('*', middleware.cors);

    return router;
};
