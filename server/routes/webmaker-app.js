// POST /publish
// req.body should contain id, which represents appID
// session should contain a user
var habitat = require('habitat');
var AWS = require('aws-sdk');
var async = require('async');
var Firebase = require('firebase');
var request = require('request');

var errorUtil = require('../../lib/error');
var s3Util = require('../../lib/s3');

var docsUrl = 'https://github.com/mozillafordevelopment/webmaker-app-publisher';

var webmakerVersion = require('../../package.json').dependencies.webmaker;

if (!habitat.get('FIREBASE_ENDPOINT')) throw new Error('You must configure FIREBASE_ENDPOINT in .env');

var firebase = new Firebase(habitat.get('FIREBASE_ENDPOINT') + '/apps');
var BOT_ENDPOINT = habitat.get('BOT_ENDPOINT');

module.exports = function (req, res, next) {
    var user = req.user;
    var baseDir = 'p';

    function tellIRC (evt, data) {
      if (!BOT_ENDPOINT) {
        return;
      }

      request.post(
          BOT_ENDPOINT,
          {
            json: data
          },
          function (error, response, body) {
            if (error) {
              console.warn("Could not notify IRC bot!");
              console.warn(error);
            }
          }
      );
    };

    // Check id
    var appId = req.body.id;
    if (!appId) return next(errorUtil(400, 'No id in request body. See docs at ' + docsUrl));

    // Fetch
    var ref = firebase.child(appId);

    ref.once('value', function (snapshot) {
        var json = snapshot.val();
        var id = snapshot.key();

        if (!json) return next(errorUtil(400, 'App does not exist.'));

        var dir = baseDir + '/' + id + '/';

        // Convert json to js to write to file
        var appJs = 'window.App=' + JSON.stringify(json) + ';';
        var manifestJSON = {
            name: json.name,
            description: 'An app made with Webmaker',
            launch_path: '/' + dir + 'index.html',
            icons: {
                '128': '/' + json.icon
            },
            developer: {
                name: user.username || 'Anonymous'
            },
            default_locale: 'en-US', // TODO - set on app json
            type: 'web',
            version: webmakerVersion
        };

        // fake a response if we're doing dev-publish
        if (habitat.get('FAKE_S3')) {
            console.log('Not actually publishing to s3 ;)');

            // Send the url
            res.send({
                url: habitat.get('PUBLISH_URL') + '/' + dir
            });

            tellIRC('publish', json);

            return;
        }

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

            tellIRC('publish', json);
        });
    });

};
