// This script builds and deploys shared assets to the configured s3 bucket.
var habitat = require('habitat');
var async = require('async');
var s3 = require('s3');
var config = require('../config');
var build = require('./build');

config.load();

var client = s3.createClient({
    s3Options: {
        accessKeyId: habitat.get('ACCESS_KEY_ID'),
        secretAccessKey: habitat.get('SECRET_ACCESS_KEY')
    }
});

var assetsDir = __dirname + '/../assets';

module.exports = function deploy(cb) {
    build(function (err) {
        if (err) throw err;
        var uploader = client.uploadDir({
            s3Params: {
                Bucket: habitat.get('BUCKET'),
                Prefix: ''
            },
            localDir: assetsDir
        });
        console.log('Uploading shared assets');
        uploader.on('error', cb);
        uploader.on('end', cb);
    });
};
