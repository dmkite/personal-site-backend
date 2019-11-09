const credentials = require('../../credentials')
const knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  debug: true,
  connection: {
    socketPath: '/var/run/mysqld/mysqld.sock',
    user: 'dylan',
    password: credentials.mysqlPassword,
    database: 'personal_site'
  }
})

module.exports = knex
