const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const userSchema = require('../models/User')
const authorize = require('../middlewares/auth')
const loginSchema = require('../models/login_history')
const { check, validationResult } = require('express-validator')


// Beutzer erstellen (SignUp)
router.post(
  '/register-user',
  [
    check('name').not().isEmpty().isLength({ min: 3 }).withMessage('Name must be atleast 3 characters long'),
    check('email', 'Email is required').not().isEmpty(),
    check('password', 'Password should be between 5 to 8 characters long').not().isEmpty().isLength({ min: 5, max: 16 }),
    check('role', 'Email is required').not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req)
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array())
    } else {
      bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new userSchema({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: req.body.role
        })
        user.save().then((response) => {
            res.status(201).json({
              message: 'User successfully created!',
              result: response,
            })
        }).catch((error) => {
            res.status(500).json({
              error: error,
            })
        })
      })
    }
  },
)

// Anmelden Authentifizierung
router.post('/signin', (req, res) => {
  let getUser
  userSchema.findOne({
      email: req.body.email,
    }).then((user) => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed',
        })
      }
      getUser = user
      return bcrypt.compare(req.body.password, user.password)
    }).then((response) => {
      if (!response) {
        return res.status(401).json({ message: 'Authentication failed',})
      }
      let expires = 10;
      // JWT Token erstellen
      let jwtToken = jwt.sign(
        {
          email: getUser.email,
          userId: getUser._id,
        },
        'longer-secret-is-better',
        {
          expiresIn: expires + 'h',
        },
      )
      res.status(200).json({
        token: jwtToken,
        expiresIn: expires * 3600,
        _id: getUser._id,
      })
    }).catch((err) => {
        return res.status(401).json({
        message: 'Authentication failed',
      })
    })
})

// Get Users
router.route('/').get((req, res, next) => {
  console.log("home")
  userSchema.find((error, response) => {
    if (error) {
      return next(error)
    } else {
      console.log(response)
      res.status(200).json(response)
    }
  })
})

// Get Single User
router.route('/user-profile/token/:token').get(authorize, (req, res, next) => {
    var authorization = req.headers.authorization.split(' ')[1]
    var decoded = jwt.verify(authorization, 'longer-secret-is-better');
    var userId = decoded.userId;
    // Fetch the user by id 
    userSchema.findById(userId, (e, data) => {
      if (e) {
        return next(e)
      } else {
        res.status(200).json({
          msg: data,
        })
      }
    })
});

// Get Single User
router.route('/user-profile/:id').get(authorize, (req, res, next) => {
  userSchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json({
        msg: data,
      })
    }
  })
})


module.exports = router