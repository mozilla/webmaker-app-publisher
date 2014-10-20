// POST /publish
// req.body should contain id, which represents appID
// session should contain a user
var habitat = require('habitat');
var AWS = require('aws-sdk');
var async = require('async');

var makedrive = require('../../lib/makedrive');
var errorUtil = require('../../lib/error');
var s3Util = require('../../lib/s3');

var makeapi = require('../../lib/makeapi')(habitat);

var docsUrl = 'https://github.com/mozillafordevelopment/webmaker-app-publisher';
var baseDir = 'p';

var webmakerVersion = require('../../package.json').dependencies.webmaker;

module.exports = function (req, res, next) {
    var username;

    if (habitat.get('DEV_PUBLISH')) {
        username = req.body.username;
    } else {
        if (!req.session || !req.session.user) return next(errorUtil(401, 'No user session found'));
        username = req.session.user.username;
        if (!username) return next(errorUtil(401, 'No valid user session found'));
    }

    var appId = req.body.id;
    if (!appId) return next(errorUtil(400, 'No id in request body. See docs at ' + docsUrl));

    makedrive.getUserJSON(username, function (err, data) {
        if (err) return next(err);

        var json;
        for (var i in data.apps) {
            if (data.apps[i].id === appId) json = data.apps[i];
        }

        if (!json) return next(errorUtil(404, 'App not found for id: ' + appId));

        var dir = baseDir + '/' + username + '/' + json.id + '/';

        // Convert json to js to write to file
        var appJs = 'window.App=' + JSON.stringify(json) + ';';
        var manifestJSON = {
            name: json.name,
            description: 'An app made with Webmaker',
            launch_path: '/index.html',
            icons: {
                '128': json.icon
            },
            developer: {
                name: username
            },
            default_locale: 'en-US', // TODO - set on app json
            type: 'web',
            fullscreen: true,
            version: webmakerVersion
        };

        var queue = [];

        // Add generic files
        queue.push(function (callback) {
            s3Util.copyPublishAssets(dir, callback);
        });

        // Add the json
        queue.push(function (callback) {
            s3Util.client.putObject({
                Key: dir + 'app.js',
                Body: appJs,
                ContentType: 'application/javascript',
            }, callback);
        });

        // Manifest
        queue.push(function (callback) {
            s3Util.client.putObject({
                Key: dir + 'manifest.webapp',
                Body: JSON.stringify(manifestJSON),
                ContentType: 'application/json',
            }, callback);
        });

        // Do it!
        async.parallel(queue, function (err, results) {
            if (err) return next(err);

            // Send the url
            var url = habitat.get('PUBLISH_URL') + '/' + dir;
            res.send({
                url: url,
                result: results
            });

            // asynchronously publish to MakeAPI
            var makeOptions = {
              thumbnail: json.icon,
              contentType: "application/x-mobile",
              title: manifestJSON.name,
              description: manifestJSON.description,
              author: manifestJSON.developer.name,
              email: req.session.user.email,
              url: url,
              contenturl: url,
              remixUrl: url
            };

            makeapi.search({ url: url }, function(err, results) {
                if (err) {
                    return console.warn("could not publish make "+url);
                }

                if (results.length === 0) {
                    makeapi.create({ maker: makeOptions.email, make: makeOptions}, function(err, make) {
                        if (err || !make) {
                            console.warn("error while publishing make to the makeapi");
                            console.warn(err);
                            return;
                        }
                    });
                }
            });
        });
    });

};



