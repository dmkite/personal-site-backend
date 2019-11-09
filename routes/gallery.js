const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/gallery')

router.get('/', ctrl.getGallery)

module.exports = router
