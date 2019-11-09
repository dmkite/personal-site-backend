const credentials = require('../../credentials')
const knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  debug: true,
  connection: {
    host: '45.55.179.56',
    user: 'dylan',
    password: credentials.mysqlPassword,
    database: 'personal_site'
  }
})

module.exports = knex
