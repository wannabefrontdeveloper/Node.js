//201935241 김지원
const express = require('express');
var router = express.Router()

var auth = require('../lib/auth');

router.get('/login', (req, res) => {
     auth.login(req, res);
})

router.post('/login_process', (req, res) => {
      auth.login_process(req, res)
})

router.get('/logout_process', (req, res) => {
      auth.logout_process(req, res)
})

router.get('/person_form', (req, res) => {
      auth.person_form(req, res);
  })

  router.post('/person', (req, res) => {
      auth.person(req, res);
  })
module.exports = router;