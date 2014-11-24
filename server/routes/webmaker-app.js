// POST /publish
// req.body should contain id, which represents appID
// session should contain a user
var habitat = require('habitat');
var AWS = require('aws-sdk');
var async = require('async');
var Firebase = require('firebase');

var errorUtil = require('../../lib/error');
var s3Util = require('../../lib/s3');

var docsUrl = 'https://github.com/mozillafordevelopment/webmaker-app-publisher';

var webmakerVersion = require('../../package.json').dependencies.webmaker;

if (!habitat.get('FIREBASE_ENDPOINT')) throw new Error('You must configure FIREBASE_ENDPOINT in .env');

var firebase = new Firebase(habitat.get('FIREBASE_ENDPOINT') + '/apps');

module.exports = function (req, res, next) {
    var user = req.session && req.session.user;

    // Check auth
    if (habitat.get('DEV_PUBLISH')) {
        console.log('Using DEV publish strategy.');
        user = req.body.user;
    } else {
        if (!user) return next(errorUtil(401, 'No user session found'));
        if (!user.id || !user.username) return next(errorUtil(401, 'No valid user session found'));
    }

    // Check id
    var appId = req.body.id;
    if (!appId) return next(errorUtil(400, 'No id in request body. See docs at ' + docsUrl));

    // Fetch
    var ref = firebase.child(appId);
    ref.once('value', function (snapshot) {
        var json = snapshot.val();
        var id = snapshot.key();

        if (!json) return next(errorUtil(400, 'App does not exist.'));

        var dir = baseDir + '/' + user.username + '/' + id + '/';

        // Convert json to js to write to file
        var appJs = 'window.App=' + JSON.stringify(json) + ';';
        var manifestJSON = {
            name: json.name,
            description: 'An app made with Webmaker',
            launch_path: '/' + dir + 'index.html',
            icons: {
                '128': json.icon
            },
            developer: {
                name: user.username
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
            res.send({
                url: habitat.get('PUBLISH_URL') + '/' + dir,
                result: results
            });
        });
    });

};
