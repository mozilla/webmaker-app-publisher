// POST /publish
// req.body should contain id, which represents appID
// session should contain a user
var habitat = require('habitat');
var AWS = require('aws-sdk');
var async = require('async');

var makedrive = require('../util/makedrive');
var S3Util = require('../util/s3');

var s3 = new AWS.S3({
    region: habitat.get('REGION'),
    accessKeyId: habitat.get('ACCESS_KEY_ID'),
    secretAccessKey: habitat.get('SECRET_ACCESS_KEY'),
    params: {
        Bucket: 'webmaker-app-publisher'
    }
});
var s3Util = new S3Util(s3);

module.exports = function (req, res, next) {

    // TODO: use cookie instead
    if (!req.query.username) return next(new Error('No query'));
    var username = req.query.username;
    var appId = 0;

    makedrive.getUserJSON(username, function (err, data) {
        if (err) return next(err);

        var json = data.apps[appId];
        var dir = req.query.username + '/' + json.id;

        // Convert json to js to write to file
        var appJs = 'window.App=' + JSON.stringify(json) + ';';

        // Queue up generic file uploads
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
            res.send(results);
        });
    });

};
