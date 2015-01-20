var webmakerSrc = require('webmaker');
var path = require('path');
var async = require('async');
var del = require('del');

var assetsDir = path.join(__dirname, '../assets');
var publishDir = path.join(assetsDir, '/publish-assets');

module.exports = function (cb) {
    async.series([
        function (cb) {
            del(assetsDir, cb);
        },
        function (cb) {
            webmakerSrc.copySharedAssets(assetsDir, cb);
        },
        function (cb) {
            webmakerSrc.copyPublishAssets(publishDir, cb);
        }
    ], cb);
};

