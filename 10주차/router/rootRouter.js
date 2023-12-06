//201935241 김지원
const express = require('express');
var router = express.Router()

var shop = require('../lib/shop');

router.get('/', (req, res) => {
    shop.home(req, res);
});
router.get('/shop/all', (req, res) => {
    shop.home(req, res);
});
router.get('/shop/:category', (req, res) => {
    shop.home(req, res);
});
router.get('/shop/detail/:merid', (req, res) => {
    shop.detail(req, res);
});

router.post('/shop/search', (req,res) => {
    shop.search(req,res)
});
router.get('/shop/anal/customer', (req, res) => {
    shop.customeranal(req, res);
});

router.get('/shop/anal/birth', (req, res) => {
    shop.customerbirth(req, res);
});


module.exports = router