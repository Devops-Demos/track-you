module.exports = {
  port: 4010,
  userconfig: {
    _hookTimeout: 60000
  },
  mailConfig: {
    host: '10.121.76.109',
    port: 25
  },
  appLink: 'https://biodiversityeconomy.environment.gov.za',
  sentByEmail: 'biodiversityeconomy@itrack.com',
  connections: {
    mySql: {
      adapter: 'sails-mysql',
      host: '10.121.76.43',
      user: 'root',
      password: '',
      port: 3306,
      database: 'itrack',
      charset: 'utf8',
      collation: 'utf8_unicode_ci'
    }
  },
  models: {
    migrate: 'safe',
    connection: 'mySql'
  },

  csrf: true
};

var MySQLSessionStore = require('express-mysql-session');
module.exports.session = {
  secret: '810358dcc1f77f406c6af45d2925d7cc',
  store: new MySQLSessionStore({
    host: '10.121.76.43',
    user: 'root',
    password: '',
    port: 3306,
    database: 'itrack'
  })
};
