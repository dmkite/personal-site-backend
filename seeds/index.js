const shortid = require('shortid')
const projects = require('./projects.json')
const gallery = require('./gallery.json')
const design = require('./design.json')
const redis = require('redis')

const main = (toSeed) => {
  if (toSeed !== 'Projects' && toSeed !== 'Gallery' && toSeed !== 'Design') {
    console.error(`incorrect seed type: ${toSeed}`)
    return false
  }
  const redisClient = createClient()
  console.log('redis client created')
  const seedMap = {
    Projects: projects,
    Design: design,
    Gallery: gallery
  }

  const seeds = seedMap[toSeed]
  Object.keys(seeds).forEach((s, i) => {
    console.log(seeds[s])
    console.log(`writing item ${i + 1} of ${Object.keys(seeds).length}`)
    setItems(redisClient, seeds[s], toSeed)
  })
  redisClient.quit()
  console.log('closing redis client')
}


const createClient = () => {
  const redisOptions = {
    db: 1,
    host: "127.0.0.1",
    port: 6379,
  };
  const client = redis.createClient(redisOptions);
  return client;
}

const setItems = (rC, entry, key) => {
  const id = entry.id || shortid()
  if (!entry.id) {
    entry.id = shortid()
  }
  const stringifiedEntry = typeof entry === 'string'
    ? entry
    : JSON.stringify(entry)

    console.log(stringifiedEntry)
  rC.hset(key, [id, stringifiedEntry], rC.print)
}

module.exports = {main}