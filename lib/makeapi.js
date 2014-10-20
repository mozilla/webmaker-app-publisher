var habitat = require('habitat');

module.exports = function() {

  var makeEnv = habitat.get("make");

  if (!( makeEnv.endpoint && makeEnv.privatekey && makeEnv.publickey)) {
    throw new Error( "MakeAPI config invalid or missing" );
  }

  var Make = require('makeapi-client'),
      MAKE_LIMIT = makeEnv.limit || 1000,
      make;

  make = new Make({
    apiURL: makeEnv.endpoint,
    hawk: {
      key: makeEnv.privatekey,
      id: makeEnv.publickey
    }
  });

  /**
   * db function object that we return
   */
  var makeAPIWrapper = {
    create: make.create.bind(make),
    update: make.update.bind(make),
    remove: make.remove.bind(make),
    search: function(data, callback) {
      make.find(data).then(callback);
    }
  };

  // return api object
  return makeAPIWrapper;
};
