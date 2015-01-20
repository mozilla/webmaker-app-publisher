var habitat = require('habitat');
var environment = habitat.get('NODE_ENV');

module.exports.load = function () {
    // Load local environment
    habitat.load('.env');

    // Load config
    if (environment === 'STAGING') {
        console.log('loading staging config');
        habitat.load('config/staging.env');
    }
    else if (environment === 'MOFODEV') {
        console.log('loading mofodev config');
        habitat.load('config/mofodev.env');
    }

    // Defaults
    habitat.load('config/defaults.env');
};
