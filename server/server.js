module.exports = function () {
    var habitat = require('habitat');
    var express = require('express');
    var morgan = require('morgan');
    var bodyParser = require('body-parser');
    var WebmakerAuth = require('webmaker-auth');

    var environment = habitat.get('NODE_ENV');

    // Load config
    if (environment === 'PRODUCTION') {
        console.log('loading production config');
        habitat.load('config/production.env');
    }
    else if (environment === 'STAGING') {
        console.log('loading staging config');
        habitat.load('config/staging.env');
    }
    habitat.load('config/defaults.env');

    // Auth
    var auth = new WebmakerAuth({
      loginURL: habitat.get('LOGIN_URL'),
      secretKey: habitat.get('SECRET_KEY'),
      domain: habitat.get('COOKIE_DOMAIN'),
      forceSSL: habitat.get('FORCE_SSL')
    });

    var app = express();
    var routes = require('./routes')(auth);
    var middleware = require('./middleware');

    // Logs
    var messina = require('messina')('webmaker-app-publisher-' + environment);

    if (habitat.get('ENABLE_GELF_LOGS')) {
        app.use(messina.middleware());
    } else {
        app.use(morgan('dev'));
    }

    app.use(auth.cookieParser());
    app.use(auth.cookieSession());

    app.use(bodyParser.json());

    app.use(routes);
    app.use(middleware.errorHandler);

    return app;
};
