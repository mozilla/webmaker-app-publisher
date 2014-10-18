var habitat = require('habitat');
var config = require('../config');
var request = require('request');

config.load();

describe('Environment tests', function () {
    this.timeout(10000);
    it('should connect to s3', function (done) {
        var s3 = require('../lib/s3');
        s3.client.listObjects({MaxKeys: 5}, function (err, data) {
            done(err);
        });
    });
    it('should have a valid s3 publish url', function (done) {
        request.get({url: habitat.get('PUBLISH_URL')}, function (err, resp, body) {
            done(err);
        });
    });
    it('should connect to makedrive', function (done) {
        request.get({
            url: habitat.get('MAKEDRIVE_ENDPOINT_WITH_AUTH') + '/healthcheck',
        }, function (err, resp, body) {
            if (err) return done(err);
            try {
                var json = JSON.parse(body);
                if (json.http === 'okay') return done();
            } catch (e) {
                return done(new Error('No body for healthcheck'));
            }
            done(new Error('Healthcheck return unexpected body: ' + body));
        });
    });
});
