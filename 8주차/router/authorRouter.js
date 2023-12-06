const express = require('express')
var router = express.Router()

var author = require('../lib/author')

router.get('/author',(req,res)=>{

  router.author.home(req,res);
})

router.post('/author/create_process',(req,res)=>{

router.author.create_process(req,res);
})

router.get('/author/update',(req,res)=>{

  router.author.update(req,res);
})

router.post('/author/update_process',(req,res)=>{

  router.author.update_process(req,res);
})

router.get('/author/delete',(req,res)=>{

  router.author.delete_process(req,res);
})

module.exports = router;