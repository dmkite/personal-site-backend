#! /usr/bin/env nodejs
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const formidable = require('express-formidable')

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(formidable())

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.use((req, res, next) => {
  res.status(404).send({ message: "the endpoint you're looking for doesn't exist" })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).send({ message: err.message || 'internal error' })
})

app.listen(port, () => console.log(`getting lit on port ${port}`))
