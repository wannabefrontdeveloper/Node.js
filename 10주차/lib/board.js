//201935241 김지원
var db = require('./db');
const sanitizeHtml = require('sanitize-html');

const template = require('./template');
function authIsOwner(req) {
    return req.session.is_logined && req.session.class === '01';
}

module.exports = {
    typeview: (req, res) => {
        var vu = req.params.vu;
        var sql1 = `
          SELECT boardtype.*, COUNT(board.board_id) as numPerPage 
          FROM boardtype 
          LEFT JOIN board ON board.type_id = boardtype.type_id
          GROUP BY boardtype.type_id
        `;
        db.query(sql1, (err, boardtypes) => {
            if (err) {
                console.log(err);
            }

            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
            db.query(sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardtype.ejs',
                    logined: 'YES',
                    boardtypes: boardtypes,


                    vu: vu,
                    subIds: subIds
                }
                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                })
            })
        })
    },

    typecreate: (req, res) => {
        var vu = req.params.vu
        db.query('SELECT * FROM boardtype', (err, boardtype) => {
            if (err) {
                throw err;
            }
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardTypeCU.ejs', 
                    logined: 'YES',
                    boardtype: null,
                    value: 'C',
                    boardtypes: subIds[0],
                    subIds: subIds[1]

                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);

                })
            })
        })
    },

    typecreate_process: (req, res) => {
        var post = req.body;
        var newtype_id = post.type_id;
        var newtitle = post.title;
        var newdescription = post.description;
        var newwrite_YN = post.write_YN;
        var newre_YN = post.re_YN;
        var newnumPerPage = post.numPerPage;

        db.query('INSERT INTO boardtype (type_id, title, description, write_YN, re_YN, numPerPage) VALUES (?, ?, ?, ?, ?, ?)',
            [newtype_id, newtitle, newdescription, newwrite_YN, newre_YN, newnumPerPage], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            })
    },
    typeupdate: (req, res) => {
        var typeId = req.params.typeId;
        var vu = req.params.vu;

        if (!authIsOwner(req)) {
            res.send("관리자만 수정 및 삭제할 수 있습니다.");
            return;
        }

        db.query('SELECT * FROM boardtype WHERE type_id = ?', [typeId], (err, boardtype) => {
            if (err) {
                console.error(err);
                return;
            }

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardTypeCU.ejs', 
                    logined: 'YES',
                    boardtype: boardtype,
                    value: vu,
                    boardtypes: subIds[0],
                    subIds: subIds[1]
                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    typeupdate_process: (req, res) => {
        var post = req.body;
        var typeId = post.typeId; 
        var newtitle = post.title;
        var newdescription = post.description;
        var newwrite_YN = post.write_YN;
        var newre_YN = post.re_YN;
        var newnumPerPage = post.numPerPage;
        console.log(post);

        if (!typeId) {
            console.error("No typeId value.");
            return;
        }

        db.query('UPDATE boardtype SET title=?, description=?, write_YN=?, re_YN=?, numPerPage=? WHERE type_id = ?',
            [newtitle, newdescription, newwrite_YN, newre_YN, newnumPerPage, typeId], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            })
    },


    typedelete_process: (req, res) => {
        var typeId = req.params.typeId;

        if (!authIsOwner(req)) {
            res.send("관리자만 수정 및 삭제할 수 있습니다.");
            return;
        }

        db.query('DELETE FROM boardtype WHERE type_id = ? ', [typeId], (error, boardtype) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/board/type/view` });
            res.end();
        });
    },
    view: (req, res) => {
        var typeId = req.params.typeId;
        var pNum = req.params.pNum
        var postsPerPage = 5;
        var offset = (pNum - 1) * postsPerPage;
        console.log(typeId, postsPerPage, offset);

        db.query(`SELECT * FROM board WHERE type_id = ? ORDER BY date desc, board_id LIMIT ? OFFSET ?`, [typeId, postsPerPage, offset], (err, board) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }

            db.query('SELECT COUNT(*) as count FROM board WHERE type_id = ?', [typeId], (err, result) => {
                var totalPost = result[0].count;
                var sntzedTypeId = sanitizeHtml(req.params.typeId)
                var pNum = req.params.pNum
                var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM boardtype where type_id = ${sntzedTypeId}; `
                var sql3 = `select count(*) as total from board where type_id = ${sntzedTypeId}`

                db.query(sql1 + sql2 + sql3, (error, subIds) => {
                    var numPerPage = subIds[1][0].numPerPage;
                    var offs = (pNum - 1) * numPerPage;
                    var totalPages = Math.ceil(totalPost / numPerPage);
                    
                    db.query(`select b.board_id as board_id, b.title as title, b.date as date, p.name as name 
                           from board b inner join person p on b.loginid = p.loginid
                           where b.type_id = ? ORDER BY date desc, board_id desc LIMIT ? OFFSET ?`,
                        [sntzedTypeId, numPerPage, offs], (err, boards) => {
                            console.log(boards)
                            if (err) {
                                throw err;

                            }
                            
                            if (req.session.is_logined) {
                                
                                var menuTemplate;
                                if (req.session.class === '01') {
                                    menuTemplate = 'menuForManager.ejs';
                                } else if (req.session.class === '02') {
                                    menuTemplate = 'menuForCustomer.ejs';
                                } else {
                                    menuTemplate = 'menuForCustomer.ejs';
                                }

                                var context = {
                                    menu: menuTemplate, 
                                    who: req.session.name,
                                    body: 'board.ejs',
                                    logined: 'YES',
                                    vu: typeId,
                                    board: board,
                                    boardtypes: subIds[0],
                                    subIds: subIds[1],
                                    totalPages: totalPages,
                                    pNum: pNum
                                };

                                req.app.render('home', context, (err, html) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).send('Internal Server Error');
                                    }
                                    res.end(html);
                                });
                            } else {
                            

                                var context = {
                                    menu: 'menuForCustomer.ejs',
                                    who: '손님',
                                    body: 'board.ejs',
                                    logined: 'NO',
                                    board: board,
                                    vu: typeId,
                                    boardtypes: subIds[0],
                                    subIds: subIds[1],
                                    totalPages: totalPages,
                                    pNum: pNum
                                };

                                req.app.render('home', context, (err, html) => {
                                    if (err) {
                                        console.error(err);
                                        return res.status(500).send('Internal Server Error');
                                    }
                                    res.end(html);
                                });
                            }
                        })
                });
            });
        });
    },

    create: (req, res) => {
        
        if (!req.session.is_logined) {
         
            res.send("로그인이 필요합니다.");
            return;
        }

        var typeId = req.params.typeId;
        var vu = req.params.vu;
        var loginid = req.session.name;

        db.query('SELECT * FROM boardtype;', (err, btname) => {
            if (err) {
                console.log(err);
            }

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                if (req.session.is_logined) {
                   
                    var menuTemplate;
                    if (req.session.class === '01') {
                        menuTemplate = 'menuForManager.ejs';
                    } else if (req.session.class === '02') {
                        menuTemplate = 'menuForCustomer.ejs';
                    } else {
                        menuTemplate = 'menuForCustomer.ejs';
                    }

                    var context = {
                        menu: menuTemplate,
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        board: null,
                        vu: vu,
                        typeId: typeId,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        btname: btname,
                        loginid: btname[0].loginid,
                        req: req, 
                        name: req.session.name,
                        value: 'CR'
                    };

                    req.app.render('home', context, (err, html) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }
                        res.end(html);
                    });
                } else {
                    var context = {
                        menu: menuTemplate,
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        board: null,
                        vu: vu,
                        typeId: typeId,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        btname: btname,
                        name: req.session.name,
                        loginid: loginid
                    };

                    req.app.render('home', context, (err, html) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error');
                        }
                        res.end(html);
                    });
                }
            });
        });
    },

    create_process: (req, res) => {
        var post = req.body;
        var newboard_id = post.board_id;
        var newtype_id = post.type_id; 
        var newp_id = post.p_id;
        var newloginid = req.session.name;
        var newpassword = post.password;
        var newtitle = post.title;
        console.log(post)
        console.log(newloginid)

       
        var formattedDate = template.dateOfEightDigit();

        var newcontent = post.content;

        db.query('INSERT INTO board (board_id, type_id, loginid, password, title, date, content) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [newboard_id, newtype_id, newloginid, newpassword, newtitle, formattedDate, newcontent], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                res.writeHead(302, { Location: `/board/view/${post.type_id}/1` }); 
                res.end();
            });
    },
    detail: (req, res) => {
        var boardId = req.params.board_id;
        var pNum = req.params.pNum;
    

        var boardQuery = 'SELECT * FROM board WHERE board_id = ?';
    
        db.query(boardQuery, [boardId], (err, board) => {
            if (err) {
                console.log(err);
                return res.status(500).send('Internal Server Error');
            }
    
            
            if (!board || board.length === 0) {
                return res.status(404).send('Not Found');
            }
    
            
    
            var menuTemplate = 'menuForCustomer.ejs';


if (req.session && req.session.id) {
    
    if (req.session.id === '01') {
        menuTemplate = 'menuForManager.ejs';
    }
}
    
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
    
            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('Internal Server Error');
                }
    
                
                var context;
                if (menuTemplate === 'menuForManager.ejs') {
                    context = {
                        menu: menuTemplate,
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        board: board,
                        boardId: boardId,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        hh: board[0].type_id,
                        loginid: board[0].loginid,
                        pNum: pNum,
                        value: 'D'
                    };
                } else {
                    context = {
                        menu: menuTemplate,
                        who: req.session.name,
                        body: 'boardCRU.ejs',
                        logined: 'YES',
                        board: board,
                        boardId: boardId,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        hh: board[0].type_id,
                        loginid: board[0].loginid,
                        pNum: pNum,
                        value: 'D'
                    };
                }
    
                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    res.end(html);
                });
            });
        });
    },
    
    
    
    update: (req, res) => {
        var typeId = req.params.typeId;
        var vu = req.params.vu;
        var pNum = req.params.pNum;
        var boardId = req.params.board_id;
    
    
    
        if (!authIsOwner(req) && req.session.id !== '01') {
            res.send("관리자 또는 작성자만 수정 및 삭제할 수 있습니다.");
            return;
        }
    
        db.query('SELECT * FROM board WHERE board_id = ?', [boardId], (err, board) => {
            if (err) {
                console.error(err);
                return;
            }
    
            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
    
            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }
    
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'boardCRU.ejs',
                    logined: 'YES',
                    board: board,
                    vu: vu,
                    typeId: typeId,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    value: 'U',
                    pNum: pNum
                };
    
                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    

    update_process: (req, res) => {
        var post = req.body;
        
        var newtype_id = post.type_id; 
        
        var newloginid = post.loginid;
        var newpassword = post.password;
        var newtitle = post.title;
        var formattedDate = template.dateOfEightDigit();
        var newcontent = post.content;
        var boardId = post.board_id;
        

        console.log(post);

        

        db.query('UPDATE board SET type_id=?, title=?, date=?,content=? WHERE board_id = ?',
        [newtype_id,  newtitle, formattedDate, newcontent, boardId], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/board/type/view` });
                res.end();
            });
    },

    delete_process: (req, res) => {
        var typeId = req.params.typeId;
        var boardId = req.params.boardId;
        var pNum = req.params.pNum;
    
        if (!authIsOwner(req) && req.session.id !== '01') {
            res.status(403).send("Forbidden: 삭제 권한이 없습니다.");
            return;
        }
    
        console.log(`Deleting board with ID ${boardId}`);
    
        db.query('DELETE FROM board WHERE board_id = ? ', [boardId], (error, result) => {
            if (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
                return;
            }
    
            res.writeHead(302, { Location: `/board/view/${typeId}/${pNum}` });
            res.end();
        });
    }
}    