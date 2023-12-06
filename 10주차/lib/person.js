//201935241 김지원
var db = require('./db');

module.exports = {
    view: (req, res) => {
        var vu = req.params.id
        db.query('SELECT * FROM person', (err, person)=> {
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
                body: 'person.ejs',
                logined: 'YES',
                person: person,
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
        
        db.query('SELECT * FROM person', (err, person) => {
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
            body: 'personCU.ejs', 
            logined: 'YES',
            person: null,
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
        var newId = post.loginid;
        var newPassword = post.password;
        var newName = post.name;
        var newAddress = post.address;
        var newTel = post.tel;
        var newBirth = post.birth;
        var newClass = post.class;
        var newPoint = post.point;
    
        db.query('INSERT INTO person (loginid, password, name, address, tel, birth, class, point) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
        [newId, newPassword, newName, newAddress, newTel, newBirth, newClass, newPoint], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }
            res.writeHead(302, { Location: `view/u`});
            res.end();
        })

    },
    update: (req, res) => {
        var loginid = req.params.loginid;

        console.log(req.body);
        console.log(loginid);

        db.query('SELECT * FROM person', (err, person) => {
            if(err) {
                throw err;
            }
        

        db.query('SELECT * FROM person WHERE loginid = ?', [loginid], (err, person) => {
            if (err) {
                console.error(err);
                res.status(500).send('데이터베이스 오류');
                return;
                }
    
            if (person.length === 0) {
                res.status(404).send('제품을 찾을 수 없음');
                return;
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
                    body: 'personCU.ejs', 
                    logined: 'YES',
                    person: person,
                    boardtypes: subIds[0],
                    subIds: subIds[1]
                   
                };
    
                req.app.render('home', context, (err, html) => {
                    if (err) {
                    console.error(err);}
                    res.end(html);
                });
            })

        })})})

    },
    update_process: (req, res) => {
        var post = req.body;
        var loginid = post.loginid;
        var newId = post.loginid;
        var newPassword = post.password;
        var newName = post.name;
        var newAddress = post.address;
        var newTel = post.tel;
        var newBirth = post.birth;
        var newClass = post.class;
        var newPoint = post.point;

        db.query('UPDATE person SET loginid=?, password=?, name=?, address=?, tel=?, birth=?, class=?, point=? WHERE loginid = ?',
        [newId, newPassword, newName, newAddress, newTel, newBirth, newClass, newPoint, loginid], (err, result) => {

            console.log([newId, newPassword, newName, newAddress, newTel, newBirth, newClass, newPoint])
            if (err) {
            console.error(err);
            return;
        }
        res.writeHead(302, { Location: `/person/view/v`});
        res.end();
    })

    },
    delete_process: (req, res) => {
        var loginid = req.params.loginid;
        db.query('DELETE FROM person WHERE loginid = ?', [loginid], (error, person) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/person/view/u` });
            res.end();
        });
    }
}