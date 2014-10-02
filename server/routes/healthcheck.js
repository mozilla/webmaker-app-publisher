module.exports = function (req, res, next) {
    var habitat = require('habitat');
    res.send({
        version: require('../../package.json').version,
        node_env: habitat.get('NODE_ENV')
    });
};
