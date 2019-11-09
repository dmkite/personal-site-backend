const model = require('../models/gallery')

const getGallery = async (req, res) => {
  try {
    const galleryContent = await model.getGallery()
    console.log(galleryContent)
    galleryContent
      ? res.status(200).send(galleryContent)
      : res.status(404).send({ message: 'no gallery content available' })
  } catch (err) {
    res.status(500).send({ message: err })
  }
}

module.exports = {
  getGallery
}
