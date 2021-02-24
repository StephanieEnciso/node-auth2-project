const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

const Users = require('../users/users-model');
const { validation } = require('../users/users-service');
const { jwtSecret } = require('../../config/secrets');

router.post('/register', (req, res) => {
    const credentials = req.body;

    if (validation(credentials)) {
        const rounds = process.env.BCRYPT_ROUNDS || 8;

        const hash = bcryptjs.hashSync(credentials.password, rounds);

        credentials.password = hash;

        Users.add(credentials)
          .then(user => {
              res.status(201).json({
                  data: user
              });
          })
          .catch(err => {
              res.status(500).json({
                  message: err.message
              });
          });
    } else {
        res.status(400).json({
            message: 'Please provide the username and password'
        });
    }
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (validation(req.body)) {
        Users.findBy({ username: username })
          .then(([user]) => {
              if (user && bcryptjs.compareSync(password, user.password)) {
                  const token = makeToken(user)
                  res.status(200).json({
                      message: `Welcome back ${user.username}`,
                      token
                  });
                } else {
                    res.status(401).json({
                        message: 'Invalid credentials'
                    })
                }
          })
          .catch(err => {
              res.status(500).json({
                  message: err.message
              });
          });
    } else {
        res.status(400).json({
            message: 'Please provide the username and password.'
        });
    }
});
function makeToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
        department: user.department,
        role: user.role
    }
    const options = {
        expiresIn: '500s'
    }
    return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;