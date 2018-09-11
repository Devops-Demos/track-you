'use strict';
var url = require('url');
let authReq = require('superagent').agent();
const address = 'http://localhost:4010';
authReq.post(url.resolve(address, '/login')).send({
  email: 'admin@test.com',
  password: 'password'
}).end(function () {
  authReq.put(url.resolve(address, '/initiative/9945'))
    .send({
      description: 'Vo wopgoneci nasfe jen bi mezseg pudem zajnef ige pika ma denre puwbevhu peivafe nipfiid uktep okton guce.',
      details: 'Catew wipu gifbedsi aze cuc feksiwfur wak fukalupe lekvo ridmo uh ovru cic zevpa toguckin.',
      dept: 'B',
      owner : '',
      participants: [{
        type: 'remove',
        id: 2
      }, {
        type: 'add',
        id: 5
      }]
    })
    .end(console.log);
});
