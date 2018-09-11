module.exports = {
    appLink: process.env.APP_URL,
    connections: {
        herokuPG2: {
            adapter: 'sails-postgresql',
            url: process.env.DATABASE_URL,
            pool: true,
            ssl: true
        }
    },
    models: {
        migrate: 'safe',
        connection: 'herokuPG2'
    },
    csrf: true
};

var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var rtg = require('url').parse(process.env.REDISTOGO_URL);
var redis = require('redis').createClient(rtg.port, rtg.hostname);
redis.auth(rtg.auth.split(":")[1]);

module.exports.session = {
    secret: process.env.SESSION_KEY,
    cookie: {
        maxAge: 30 * 60 * 1000 //30 minutes
    },
    store: new RedisStore({
        client: redis
    })
};

module.exports.cors = {
    origin: process.env.APP_URL
};