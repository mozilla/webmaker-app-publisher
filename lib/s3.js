var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var habitat = require('habitat');
var async = require('async');

function S3() {
    this.client = new AWS.S3({
        region: habitat.get('REGION'),
        accessKeyId: habitat.get('ACCESS_KEY_ID'),
        secretAccessKey: habitat.get('SECRET_ACCESS_KEY'),
        params: {
            Bucket: habitat.get('BUCKET')
        }
    });
};

S3.prototype.copyPublishAssets = function copyPublishAssets(copyToDir, callback) {
    var self = this;
    var publishAssetsFolder = 'publish-assets/';

    var queue = ['index.html', 'index.js'].map(function (file) {
        return function (cb) {
            self.client.copyObject({
                CopySource: habitat.get('BUCKET') + '/' + publishAssetsFolder + file,
                Bucket: habitat.get('BUCKET'),
                Key: copyToDir + file
            }, cb);
        };
    });

    async.parallel(queue, callback);

};

module.exports = new S3();

