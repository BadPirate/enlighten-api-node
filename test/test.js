var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});
var chai = require('chai');  

import EnlightenAPI from '../src/EnlightenAPI'

let api = new EnlightenAPI();

describe("EnlightenAPI", _ => {
  describe("#getServers()", _ => {
    it("Retrieves server list with valid params", done => {
      getServer()
      .then(server => {
        chai.expect(server.city).to.equal('Wahiawa');
      })
      .finally(done);
    });
  });
})

describe("EnlightenServer", _ => {
  describe("#getStats()", _ => {
    it("Fetches stats without params", done => {
      getServer()
      .then(server => {
        return server.getStats();
      })
      .then(stats => {
        chai.expect(stats.intervals.length).to.equal(170);
      })
      .finally(done);
    });
    it("Fetches stats in a specific time window", done => {
      getServer()
      .then(server => {
        return server.getStats(1564755300,1564775400);
      })
      .then(stats => {
        chai.expect(stats.intervals.length).to.equal(67);
      })
      .finally(done);
    })
  });
})

function getServer() {
  return api.getServers()
    .then(servers => {
      chai.expect(servers.size).to.equal(100);
      let server = servers.get(28381);
      return server;
    });
}
