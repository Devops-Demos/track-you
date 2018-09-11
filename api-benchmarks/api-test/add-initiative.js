'use strict';
var url = require('url');
let agent = require('superagent').agent();
const address = 'http://localhost:4010';
agent.post(url.resolve(address, '/login')).send({
  email: 'admin@test.com',
  password: 'password'
}).end(function () {
  agent.post(url.resolve(address, '/initiative'))
    .send({
      description: 'Vo wopgoneci nasfe jen bi mezseg pudem zajnef ige pika ma denre puwbevhu peivafe nipfiid uktep okton guce.',
      details: 'Catew wipu gifbedsi aze cuc feksiwfur wak fukalupe lekvo ridmo uh ovru cic zevpa toguckin.',
      dept: 'B',
      participants: [5,6,7]
    })
    .end(console.log);
});
