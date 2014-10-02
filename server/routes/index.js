var express = require('express');

module.exports = function (auth) {
    var router = express.Router();

    router.get('/healthcheck', require('./healthcheck'));
    router.get('/publish', require('./publish'));

    return router;
};
