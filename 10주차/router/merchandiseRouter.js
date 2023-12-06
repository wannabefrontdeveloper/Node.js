//201935241 김지원
const express = require('express');
var router = express.Router()
var merchandise = require('../lib/merchandise');


const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    var newFileName = file.originalname;
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage });





router.get('/view/:vu', (req, res) => {
  merchandise.view(req, res);
});

router.get('/create', (req, res) => {
  merchandise.create(req, res);
});

router.post('/create_process', upload.single('uploadFile'), (req, res) => {
  var file = '/images/' + req.file.filename;
  merchandise.create_process(req, res, file);
});

router.get('/update/:mer_id', (req, res) => {
  merchandise.update(req, res);
});

router.post('/update_process', upload.single('uploadFile'), (req, res) => {
  var file = '';
  if (req.file === undefined) {
    file = 'No';
  } else {
    file = '/images/' + req.file.filename;
  }
  console.log(file);
  merchandise.update_process(req, res, file);
});

router.get('/delete/:mer_id', (req, res) => {
  merchandise.delete_process(req, res);
});

module.exports = router;
