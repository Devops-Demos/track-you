
module.exports = {
  port: 4010,
  userconfig: {
    _hookTimeout: 30000
  },
  connections: {

    db: {
      adapter: 'sails-postgresql',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      charset: 'utf8',
      collation: 'utf8_unicode_ci'
    },
    dbTest: {
      adapter: 'sails-postgresql',
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PWD,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      charset: 'utf8',
      collation: 'utf8_unicode_ci'
    }
  },
  models: {
    migrate: 'safe',
    connection: 'db'
  },
// TODO: csrf should be set to true. but the app deosn't work at the moment. this needs to be fixed.
  csrf: false
};

module.exports.session = {
  secret: process.env.DB_SESSION_SECRET,
  adapter: 'sails-pg-session',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
};
