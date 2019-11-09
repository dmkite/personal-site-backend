const knex = require('../db/knex')
const getGallery = () => {
  return knex('gallery')
    .select('*')
    .then(data => data)
    .catch(err => { throw err })
}

module.exports = {
  getGallery
}
