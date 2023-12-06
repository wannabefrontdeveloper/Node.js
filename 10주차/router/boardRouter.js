//201935241 김지원
const express = require('express');
var router = express.Router()
var board = require('../lib/board');

router.get('/type/view', (req, res) => {
    board.typeview(req, res);
})

router.get('/type/create', (req, res) => {
    board.typecreate(req, res);
})

router.post('/type/create_process', (req, res) => {
    board.typecreate_process(req, res);
})

router.get('/type/update/:typeId', (req, res) => {
    board.typeupdate(req, res);
})

router.post('/type/update_process', (req, res) => {
    board.typeupdate_process(req, res);
})

router.get('/type/delete/:typeId', (req, res) => {
    board.typedelete_process(req, res);
})

router.get('/view/:typeId/:pNum', (req, res) => {
    board.view(req, res);
})

router.get('/create/:typeId', (req, res) => {
    req.params.board_id = req.params.boardId;
    req.name = req.session.name;
    console.log(req.session);
    board.create(req, res);
});

router.post('/create_process', (req, res) => {
    board.create_process(req, res);
})

router.get('/detail/:boardId/:pNum', (req, res) => {
    req.params.board_id = req.params.boardId; // 변수명 수정
    board.detail(req, res);
});

router.get('/update/:boardId/:typeId/:pNum', (req, res) => {
    req.params.board_id = req.params.boardId;
    board.update(req, res);
})

router.post('/update_process', (req, res) => {
    board.update_process(req, res);
})

router.get('/delete/:boardId/:typeId/:pNum', (req, res) => {
    board.delete_process(req, res);
})

module.exports = router;