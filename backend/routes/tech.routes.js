const express = require('express')
const jwt = require('jsonwebtoken')
const Techrouter = express.Router()
const techSchema = require('../models/Technology')
const modifySchema = require('../models/technology_history')
const loginSchema = require('../models/login_history')
const authorize = require('../middlewares/auth')
const { check, validationResult } = require('express-validator')


Techrouter.post('/record-technology', (req, res) => {
  const technology = new techSchema({
    name: req.body.name,
    category: req.body.category,
    ring: req.body.ring,
    description_technology: req.body.description_technology,
    description_classification: req.body.description_classification,
    published: false,
    classification_history: [req.body.ring]
  })
  technology.save().then((response) => {
      res.status(201).json({
        message: 'Technology successfully created!',
        result: response,
      })
  }).catch((error) => {
      res.status(500).json({
        error: error,
      })
  })
})

// Get Techniques Technology
Techrouter.route('/technology/:category').get(authorize, (req, res, next) => {
  techSchema.find({category: req.params.category}, (error, data) => {
      if (error) {
      return next(error)
      } else {
      res.status(200).json({
          msg: data,
      })
      }
  })
})

// Get Techniques Technology
Techrouter.route('/technology/published/all').get(authorize, (req, res, next) => {
  techSchema.find({published: true}, (error, data) => {
      if (error) {
      return next(error)
      } else {
      res.status(200).json({
          msg: data,
      })
      }
  })
})

// Get Techniques Technology
Techrouter.route('/technology/published/:category').get(authorize, (req, res, next) => {
  techSchema.find({category: req.params.category, published: true}, (error, data) => {
      if (error) {
      return next(error)
      } else {
      res.status(200).json({
          msg: data,
      })
      }
  })
})

// Get Techniques Technology
Techrouter.route('/technology/recorded/:category').get(authorize, (req, res, next) => {
  techSchema.find({category: req.params.category, published: false}, (error, data) => {
      if (error) {
      return next(error)
      } else {
      res.status(200).json({
          msg: data,
      })
      }
  })
})

// Get Techniques Technology/technology/name/
Techrouter.route('/technology/id/:id').get(authorize, (req, res, next) => {
  techSchema.findById(req.params.id, (error, data) => {
      if (error) {
        return next(error)
      } else {
      res.status(200).json({
          msg: data,
      })
      }
  })
})

Techrouter.route('/update-technology').put((req, res, next) => {
  techSchema.findByIdAndUpdate(
    req.body._id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error)
      } else {
        res.json(data)
        console.log('Technology successfully updated!')
      }
    },
  )
})

Techrouter.route('/delete-technology/:id').delete((req, res, next) => {
  techSchema.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})

Techrouter.post('/modified-technology', (req, res) => {
  console.log("add: " + typeof(req.body.action))
  const history = new modifySchema({
    uid: req.body._id,
    action: req.body.action,
    timestamp: Date.now(),
  })
  console.log(history)
  history.save().then((response) => {
      res.status(201).json({
        message: 'Technology modified',
        result: response,
      })
  }).catch((error) => {
      res.status(500).json({
        error: error,
      })
  })
})

module.exports = Techrouter