//201935241 김지원
const express = require('express');
const router = express.Router();
const purchase = require('../lib/purchase');

router.post('/detail_process', (req, res) => {
    purchase.detail_process(req, res);
});

router.get('/detail/:mer_id', (req, res) => {
    purchase.detail(req, res);
});

router.get('/cart', (req, res) => {
    purchase.cart(req, res);
});

router.post('/cart_process', (req, res) => {
    purchase.cart_process(req, res);
});

router.get('/cancel/:purchase_id', (req, res) => {
    purchase.cancel(req, res);
});

router.post('/checkout', (req, res) => {
    purchase.checkout(req, res);
});

router.get('/', (req, res) => {
    purchase.purchase(req, res);
});

router.get('/view/:vu',(req, res)=>{
    purchase.view(req, res);
}); 

router.get('/create',(req,res)=>{
    purchase.create(req,res);
})

router.post('/create_process',(req,res)=>{
    purchase.create_process(req,res);
})

router.get('/update/:purchase_id',(req,res)=>{
    purchase.update(req,res);
})
router.post('/update_process',(req,res)=>{
    purchase.update_process(req,res);
})
router.get('/delete/:purchase_id',(req,res)=>{
    purchase.delete_process(req,res);
})



router.get('/cartview/:vu',(req,res)=>{
    purchase.cartview(req,res);
})
router.get('/cart/create',(req,res)=>{
    purchase.cartcreate(req,res);
})
router.post('/cartcreate_process',(req,res)=>{
    purchase.cartcreate_process(req,res);
})
router.get('/cart/update/:cart_id',(req,res)=>{
    purchase.cartupdate(req,res);
})
router.post('/cartupdate_process',(req,res)=>{
    purchase.cartupdate_process(req,res);
})
router.get('/cart/delete/:cart_id',(req,res)=>{
    purchase.cartdelete_process(req,res);
})


module.exports = router;