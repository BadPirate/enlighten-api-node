var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});
var chai = require('chai');  

import EnlightenAPI from '../src/EnlightenAPI'

let api = new EnlightenAPI();

describe("EnlightenAPI", _ => {
  it("#getServers", done => {
    api.getServers()
    .then(servers => {
      chai.expect(servers.size).to.equal(100);
      let server = servers.get(28381);
      return(server);
    })
    .then(server => {
      chai.expect(server.city).to.equal('Wahiawa');
    })
    .finally(done);
  });
})