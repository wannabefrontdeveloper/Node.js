//201935241 김지원
var db = require('./db');

module.exports = {
    view: (req,res) => {
        var vu = req.params.vu
        db.query('SELECT * FROM code_tbl', (err, code_tbl)=> {
            if (err) {
                console.log(err);
            }
            db.query('SELECT name AS merchandise_name, price AS merchandise_price, brand AS merchandise_brand, image AS merchandise_image FROM merchandise ORDER BY mer_id', (error, merchandise) => {
                if(error) {
                    throw error;
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
                body: 'code.ejs',
                logined: 'YES',
                code_tbl: code_tbl,
                vu: vu,
                boardtypes: subIds[0],
                subIds: subIds[1]
            }
            req.app.render('home', context, (err, html) => {
                if (err) {
                console.error(err);}
                res.end(html);

            })})})})
    },
    create: (req, res) => {
      

        db.query('SELECT * FROM code_tbl', (err, code_tbl) => {
            if (err) {
                throw err;
            }
            db.query('SELECT name AS merchandise_name, price AS merchandise_price, brand AS merchandise_brand, image AS merchandise_image FROM merchandise ORDER BY mer_id', (error, merchandise) => {
                if(error) {
                    throw error;
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
                body: 'codeCU.ejs', 
                logined: 'YES',
                code_tbl: null,
                boardtypes: subIds[0],
                subIds: subIds[1]
               
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                console.error(err);}
                res.end(html);
            });
        })})})

    },
    create_process: (req, res) => {
        var post = req.body;
        var newMain_id = post.main_id;
        var newSub_id = post.sub_id;
        var newMain_name = post.main_name;
        var newSub_name = post.sub_name;
        var newStart = post.start;
        var newEnd = post.end;

        db.query('INSERT INTO code_tbl (main_id, sub_id, main_name, sub_name, start, end) VALUES (?, ?, ?, ?, ?, ?)',
        [newMain_id, newSub_id, newMain_name, newSub_name, newStart, newEnd], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        res.writeHead(302, { Location: `view/u`});
        res.end();
    })

    },
    update: (req, res) => {
        var main = req.params.main;
        var sub = req.params.sub;
    
        console.log(main)
        console.log(sub)
       

        db.query('SELECT * FROM code_tbl', (err, code_tbl) => {
            if (err) {
                throw err;
            }
            db.query('SELECT name AS merchandise_name, price AS merchandise_price, brand AS merchandise_brand, image AS merchandise_image FROM merchandise ORDER BY mer_id', (error, merchandise) => {
                if(error) {
                    throw error;
                }
    
                var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
                db.query(sql1 + sql2, (error, subIds) => {
                    if (error) {
                        throw error;
                    }
            
        db.query('SELECT * FROM code_tbl WHERE main_id = ? && sub_id = ?', [main, sub], (err, code_tbl) => {
            if (err) {
                console.error(err);
                return;
                }
                
        
                
                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'codeCU.ejs',
                    logined: 'YES',
                    code_tbl: code_tbl,
                    boardtypes: subIds[0],
                    subIds: subIds[1]
                    
                };
    
                req.app.render('home', context, (err, html) => {
                    if (err) {
                    console.error(err);}
                    res.end(html);
                });
            })})})})
    },
    update_process: (req, res) => {
        var post = req.body;
        var main = post.main_id;
        var sub = post.sub_id;
        var newMain_name = post.main_name;
        var newSub_name = post.sub_name;
        var newStart = post.start;
        var newEnd = post.end;
        console.log(post)
    
        db.query('UPDATE code_tbl SET main_name=?, sub_name=?, start=?, end=? WHERE main_id=? && sub_id=?',
        [newMain_name, newSub_name, newStart, newEnd, main, sub], (err, result) => {
            console.log([newMain_name, newSub_name, newStart, newEnd, main, sub])
            if (err) {
            console.error(err);
            return;
        }
        res.writeHead(302, { Location: `/code/view/v`});
        res.end();
    })
    

    },
    delete_process: (req, res) => {
        var main = req.params.main;
        var sub = req.params.sub;
        db.query('DELETE FROM code_tbl WHERE main_id = ? And sub_id =? ', [main, sub], (error, code_tbl) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/code/view/v` });
            res.end();
        });   
    }
}