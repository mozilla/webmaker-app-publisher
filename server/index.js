if (process.env.NEW_RELIC_HOME) {
  require('newrelic');
}

var habitat = require('habitat');

var server = require('./server')();

// Run server
server.listen(habitat.get('PORT'), function () {
  console.log('Now listening on %d', habitat.get('PORT'));
});
