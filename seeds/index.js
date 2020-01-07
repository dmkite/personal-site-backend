const shortid = require('shortid')
const projects = require('./projects.json')
const gallery = require('./gallery.json')
const design = require('./design.json')
const redis = require('redis')

const main = () => {
  const redisClient = createClient()
  console.log('redis client created')
  Object.keys(projects).forEach((p, i) => {
    console.log(`writing project ${i + 1} of ${Object.keys(projects).length}`)
    setItems(redisClient, p, 'Projects')
  })
  Object.keys(gallery).forEach((g, i) => {
    console.log(`writing gallery item ${i + 1} of ${Object.keys(gallery).length}`)
    setItems(redisClient, g, 'Gallery')
  })
  Object.keys(design).forEach((d, i) => {
    console.log(`writing design project ${i + 1} of ${Object.keys(design).length}`)
    setItems(redisClient, d, 'Design')
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
  rC.hset(key, [id, stringifiedEntry], rC.print)
}

main()