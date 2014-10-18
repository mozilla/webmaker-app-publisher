var build = require('./build')

build(function (err) {
    if (err) throw err;
    console.log('Done!');
});
