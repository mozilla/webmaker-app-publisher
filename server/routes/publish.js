// POST /publish
// req.body should contain id, which represents appID
// session should contain a user
var habitat = require('habitat');
var AWS = require('aws-sdk');
var async = require('async');

var makedrive = require('../util/makedrive');
var errorUtil = require('../util/error');
var S3Util = require('../util/s3');

var s3 = new AWS.S3({
    region: habitat.get('REGION'),
    accessKeyId: habitat.get('ACCESS_KEY_ID'),
    secretAccessKey: habitat.get('SECRET_ACCESS_KEY'),
    params: {
        Bucket: habitat.get('BUCKET')
    }
});
var s3Util = new S3Util(s3);

var docsUrl = 'https://github.com/mozillafordevelopment/webmaker-app-publisher';

module.exports = function (req, res, next) {

    if (!req.session || !req.session.user) return next(errorUtil(401, 'No user session found'));
    var username = req.session.user.username;
    var appIndex = req.body.app;

    if (!username) return next(errorUtil(401, 'No valid user session found'));
    if (!appIndex) return next(errorUtil(400, 'No app index in request body. See docs at ' + docsUrl));

    makedrive.getUserJSON(username, function (err, data) {
        if (err) return next(err);

        var json = data.apps[appIndex];

        if (!json) return next(errorUtil(404, 'App not found for index: ' + appIndex));

        var dir = req.query.username + '/' + json.id;

        // Convert json to js to write to file
        var appJs = 'window.App=' + JSON.stringify(json) + ';';

        // Queue up generic file uploads
        // Todo: copy these directly from webmaker-app s3 bucket to new s3 dir
        var queue = [
            '../src/index.html',
            '../src/index.js',
            '../src/common.css'
        ].map(function (filepath) {
            return s3Util.putFile({filepath: filepath, dir: dir});
        });

        // Add the json
        queue.push(function (callback) {
            s3.putObject({
                Key: dir + '/app.js',
                Body: appJs,
                ContentType: 'application/javascript',
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
