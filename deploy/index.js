var webmakerSrc = require('webmaker');
var del = require('del');
var async = require('async');
var habitat = require('habitat');
var environment = habitat.get('NODE_ENV');

habitat.load('.env');
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

var s3 = require('../lib/s3');

// Set up source files before we run our server
var assetsDir = __dirname + '/assets';
var sharedDir = assetsDir + '/shared';
var publishDir = assetsDir + '/publish-assets';

async.series([
    function (cb) {
        del([assetsDir + '/**/*'], cb);
    },
    function (cb) {
        webmakerSrc.copySharedAssets(sharedDir, cb);
    },
    function (cb) {
        webmakerSrc.copyPublishAssets(publishDir, cb);
    },
    function (cb) {
        var uploader = s3.client.uploadDir({
            s3Params: {
                Bucket: habitat.get('BUCKET'),
                Prefix: ''
            },
            localDir: sharedDir
        });
        console.log('Uploading shared assets');
        uploader.on('error', cb);
        uploader.on('end', cb);
    },
    function (cb) {
        var uploader = s3.client.uploadDir({
            s3Params: {
                Bucket: habitat.get('BUCKET'),
                Prefix: 'publish-assets/'
            },
            localDir: publishDir
        });
        console.log('Uploading publish assets');
        uploader.on('error', cb);
        uploader.on('end', cb);
    }
], function (err) {
    if (err) return console.error(err);
    console.log('Done.');
});

