var mime = require('mime');
var path = require('path');
var fs = require('fs');
var s3 = require('s3');
var habitat = require('habitat');

function S3() {
    this.client = s3.createClient({
        s3Options: {
            region: habitat.get('REGION'),
            accessKeyId: habitat.get('ACCESS_KEY_ID'),
            secretAccessKey: habitat.get('SECRET_ACCESS_KEY'),
            params: {
                Bucket: habitat.get('BUCKET')
            }
        }
    });
    this.s3 = this.client.s3;
};

// putFile(options)
//     options:
//         filepath: the source filepath
//         filename: (optional) the name of the destination file
//         dir: the directory of the file relative to bucket root
S3.prototype.putFile = function putFile(options) {
    var self = this;
    return function (callback) {
        var filepath = path.join(__dirname, options.filepath);
        var filepathSplit = filepath.split(path.sep);
        var filename = options.dir + '/' + (options.filename || filepathSplit[filepathSplit.length - 1]);
        var contentType = mime.lookup(filepath);
        fs.stat(filepath, function (err, stat) {
            if (err) return callback(err);
            self.s3.putObject({
                Key: filename,
                Body: fs.createReadStream(filepath),
                ContentType: contentType,
                ContentLength: stat.size
            }, callback);
        });
    };
};

module.exports = new S3();

