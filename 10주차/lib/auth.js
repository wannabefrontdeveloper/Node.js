//201935241 김지원
var db = require('./db');

module.exports = {
    login: (req, res) => {
        var vu = req.params.vu
        var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
                db.query(sql1 + sql2, (error, subIds) => {
                    if (error) {
                        throw error;
                    }
        var context = {
            menu: 'menuForCustomer.ejs',
            who: '손님',
            body: 'login.ejs',
            logined: 'NO',
            
            vu: vu,
            boardtypes: subIds[0],
            subIds: subIds[1]
        };
        req.app.render('home', context, (err, html) => {
            if (err) {
            console.error(err);}
            res.end(html);

            })})},
    
    login_process: (req, res) => {
        var post = req.body;
        db.query('select count(*) as num from person where loginid = ? and password = ?', [post.id, post.pwd], (error, results) => {
            if (results[0].num === 1) {
                db.query('select name, class from person where loginid = ? and password = ?', [post.id, post.pwd], (error, result) => {
                    req.session.is_logined = true;
                    req.session.name = result[0].name
                    req.session.class = result[0].class
                    res.redirect('/');
                })
            }
            else {
                req.session.is_logined = false;
                req.session.name = '손님';
                req.session.class = '99';
                res.redirect('/');
            }
        })
    },
    logout_process: (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        })
    },

    person: (req, res) => {
        var post = req.body;
        
        db.query('INSERT INTO person (loginid, password, name, address, tel, birth, class, point) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
        [post.id, post.pwd, post.name, post.address, post.tel, post.birth, post.class,post.point], (error, results) => {
            if (error) {
                console.error(error);
                res.status(500).send('데이터베이스 오류');
                return;
            }
            res.redirect('/auth/login');
        });
    },
    

    person_form: (req, res) => {
        var vu = req.params.vu

        var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
                db.query(sql1 + sql2, (error, subIds) => {
                    if (error) {
                        throw error;
                    }
        var context = {
            menu: 'menuForCustomer.ejs',
            who: '손님',
            body: 'register.ejs',  
            logined: 'NO',
            vu: vu,
                boardtypes: subIds[0],
                subIds: subIds[1]
        }
        req.app.render('home', context, (err, html) => {
            if (err) {
            console.error(err);}
            res.end(html);

            })})},
        }