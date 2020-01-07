const shortid = require('shortid')
const projects = require('./projects.json')
const gallery = require('./gallery.json')
const design = require('./design.json')
const redis = require('redis')

const main = () => {
  const redisClient = createClient()
  Object.keys(projects).forEach(p => {
    setItems(redisClient, p, 'Projects')
  })
  Object.keys(gallery).forEach(g => {
    setItems(redisClient, g, 'Gallery')
  })
  Object.keys(design).forEach(d => {
    setItems(redisClient, d, 'Design')
  })
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
  const stringifiedEntry = JSON.stringify(entry)
  rC.hset(key, [id, stringifiedEntry])
}

main()