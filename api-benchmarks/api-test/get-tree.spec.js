'use strict';
var url = require('url');
let agent = require('superagent')
  .agent();
const address = 'http://localhost:4010';
agent.post(url.resolve(address, '/login'))
  .send({
    email: 'nfeltman@environment.gov.za',
    password: 'password2'
  })
  .end(function () {
    agent.get(url.resolve(address, '/initiative-tree?initiativeId=0'))
      .end((err, res) => console.log(err, res.body));
  });
