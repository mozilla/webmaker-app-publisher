var request = require('request');
var habitat = require('habitat');
var errorUtil = require('./error');
module.exports = {
    getUserJSON: function (username, callback) {
        var url = habitat.get('MAKEDRIVE_ENDPOINT_WITH_AUTH') + '/s/' + username + '/' + habitat.get('WMOBILE_FILENAME')
        request.get({url: url}, function (err, response, body) {
            if (err) return callback(err);
            if (!body) return callback(new Error('There was no body, have you configured the right filename?'));
            var json = JSON.parse(body);

            // Check for 404
            if (json.error && json.error.code) {
                return callback(errorUtil(json.error.code, json.error.message));
            }

            callback(null, json);
        });
    }
};
