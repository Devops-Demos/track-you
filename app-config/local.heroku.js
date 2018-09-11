module.exports = {
  appLink:'',
  environment: 'development',
  models: {
    migrate: 'safe',
    connection: ''
  },
  csrf: true
};

var MySQLSessionStore = require('express-mysql-session');
module.exports.session = {
  secret: '810358dcc1f77f406c6af45d2925d7cc',
  store: new MySQLSessionStore({
    host: '',
    port: 3306
  })
};
