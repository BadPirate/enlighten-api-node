var path = require('path');
var dotEnvPath = path.resolve('./.env');
require('dotenv').config({ path: dotEnvPath});
var chai = require('chai');  

import EnlightenAPI from '../src/EnlightenAPI'

let api = new EnlightenAPI();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason, 'reason-stack:', reason.stack);
  // application specific logging, throwing an error, or other logic here
});

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

describe("EnlightenSystem", _ => {
  describe("#getStats()", _ => {
    it("Fetches stats without params", done => {
      getServer()
      .then(server => {
        return server.getStats();
      })
      .then(stats => {
        chai.expect(stats.intervals.length).to.greaterThan(100);
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
