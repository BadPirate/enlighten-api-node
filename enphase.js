var https = require('https'),
    url = require('querystring'),
    util = require('util');
/*

  Enphase API Integration Class

  Requires environment variables to be set in your terminal
    export ENPHASE_API_KEY='3aaa01a221a6603a71853fc1cc2c3a5b'
    export ENPHASE_APP_ID='140961117xxxx'

*/
var enphase = {

  host: 'api.enphaseenergy.com',
  version: '/api/v2',
  key: process.env.ENPHASE_API_KEY,
  auth: 'https://enlighten.enphaseenergy.com/app_user_auth/new?app_id=' + process.env.ENPHASE_APP_ID,
   
  /*

  Enphase Enlighten Systems API Request
    Request instance can make a single request to a specified api endpoint

  @options:
    userId    string     User who's site we're querying, this is the result of the authentication process
    systemId  number     User's system id that we want to query
    query     obj        Optional API call query paramaters
    api       string     API endpoint name to access
    success   function   Callback to recieve the query data
    error     function   Callback to recieve the query data

  */
  Request: function(options) {

    var self = {};

    var endpoints = {
      systems:   '/systems',
      envoys:    '/systems/%d/envoys',
      inventory: '/systems/%d/inventory',
      lifetime:  '/systems/%d/energy_lifetime',
      monthly:   '/systems/%d/monthly_production',
      rgm:       '/systems/%d/rgm_stats',
      stats:     '/systems/%d/stats',
      summary:   '/systems/%d/summary'
    };

    self.init = function() {
      if (!options) return;

      // set defaults
      if (typeof options.success !== 'function') options.success = function(){};
      if (typeof options.error !== 'function') options.error = function(){};
      if (typeof options.query !== 'object') options.query = {};

      // trigger request based on api endpoint option
      if (options.api) {
        endpoint = util.format(endpoints[options.api], options.systemId || '').trim();
        self.send(endpoint);
      }
    };

    // Sends API request
    self.send = function(endpoint) {
      var query, req;

      options.query.key = enphase.key;
      options.query.user_id = options.userId;

      query = '?' + url.stringify(options.query);

      req = https.get({
        host: enphase.host,
        path: enphase.version + endpoint + query
      }, self.handler);

      req.on('error', function(e) {
        options.error(e);
      });

    };

    // Handles API response
    self.handler = function(res) {
      var data = '';

      res.on('data', function(chunk) {
        data += chunk;
      });

      res.on('end', function(arg) {
        data = JSON.parse(data);

        if (res.statusCode == 200) options.success(data);
        else options.error(data);
      });

      res.on('error', function(e) {
        options.error(e);
      });
    };

    self.init();

    return self;
  }
};

module.exports = enphase;