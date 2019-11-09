const credentials = require('../../credentials')
const knex = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host: '10.132.118.121',
    password: credentials.mysqlPassword,
    database: 'personal_site'
  }
})

module.exports = knex
