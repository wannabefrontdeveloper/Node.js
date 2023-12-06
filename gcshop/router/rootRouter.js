//201935241 김지원
const express = require('express')
var router = express.Router()
var shop = require('../lib/shop')

router.get('/',(req,res) => {
  shop.home(req,res)
})

module.exports = router;