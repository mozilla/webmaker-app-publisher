module.exports = function (req, res, next) {
    var habitat = require('habitat');
    console.log({
        ALLOWED_DOMAINS: habitat.get('ALLOWED_DOMAINS')
    });
    res.send({
        version: require('../../package.json').version,
        node_env: habitat.get('NODE_ENV')
    });
};
