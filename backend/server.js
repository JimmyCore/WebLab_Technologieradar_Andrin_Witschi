const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')


// Express APIs
const auth_api = require('./routes/auth.routes')
const tech_api = require('./routes/tech.routes')

const uri ="mongodb+srv://andrin:aquamaN@atlascluster.csqnrnn.mongodb.net/db?retryWrites=true&w=majority";

mongoose.connect(uri).then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  }).catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

// Express settings
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false,}),)
app.use(cors())

// Serve static resources
app.use('/public', express.static('public'))
app.use('/techn_api', tech_api)
app.use('/auth_api', auth_api)

// Define PORT
const port = process.env.PORT || 8000
const server = app.listen(port, () => {console.log('Connected to port ' + port)})

// Express error handling
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error('Something went wrong'))
  })
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
