const express = require('express');

const router = express.Router();

const Users = require('./users-model');
const restricted = require('../auth/restricted-mw');
const verifyRole = require('../auth/check-role-mw');

router.get('/users', restricted, verifyRole('admin'), (req, res) => {
    Users.find()
      .then(users => {
          res.json(users);
      })
      .catch(err => {
          res.send(err);
      });
});

module.exports = router;