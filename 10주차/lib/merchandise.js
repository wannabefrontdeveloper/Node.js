//201935241 김지원
var db = require('./db');


module.exports = {
    view: (req, res) => {
        var vu = req.params.vu
        var uu = req.params.uu
        db.query('SELECT * FROM merchandise', (err, merchandise) => {
            var i = 0;
            var tag = `<table border = "1" width = "100%" height = "100px">`
            if (merchandise.length < 1) {
                tag = "자료 없음"
            }
            else {
                while (i < merchandise.length) {
                    tag = tag + `<tr><td><img src=${merchandise[i].image} style="width:100px;height:100px;"></td>
                    <td>${merchandise[i].name}</td>
                    <td>가격 : ${merchandise[i].price}</td>
                    <td>브랜드 : ${merchandise[i].brand}</td>
                    </tr>`
                    i = i + 1;
                }
            } tag = tag + '</table>'
            

                var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
                db.query(sql1 + sql2, (error, subIds) => {
                    if (error) {
                        throw error;
                    }

                   
                    var context = {
                        menu: 'menuForManager.ejs',
                        who: req.session.name,
                        body: 'merchandise.ejs',
                        logined: 'YES',
                        merchandise: merchandise,
                        vu: vu,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        uu: "o"
                    }
                    req.app.render('home', context, (err, html) => {
                        res.end(html);
                        console.error(err);
                    })
                })
            })
        

    },
    create: (req, res) => {

        db.query('SELECT * FROM merchandise', (err, merchandise) => {
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
                body: 'merchandiseCU.ejs', 
                logined: 'YES',
                merchandise: null,
                boardtypes: subIds[0],
                subIds: subIds[1]
            };

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.error(err);
                }
                res.end(html);
            });
        })})



    },
    create_process: (req, res, file) => {
        var post = req.body;
        var newCategory = post.category;
        var newName = post.name;
        var newPrice = post.price;
        var newStock = post.stock;
        var newBrand = post.brand;
        var newSupplier = post.supplier;
        var newImage = file; 
        var newSale_yn = post.sale_yn;
        var newSalePrice = post.sale_price;

        db.query('INSERT INTO merchandise (category, name, price, stock, brand, supplier, image, sale_yn, sale_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newCategory, newName, newPrice, newStock, newBrand, newSupplier, newImage, newSale_yn, newSalePrice], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/` });
                res.end();
            })
    },
    update: (req, res) => { 
        var mer_id = req.params.mer_id
        var uu = req.params.uu
        
        console.log(req.body);
        console.log(mer_id);

        db.query('SELECT * FROM merchandise', (err, merchandise) => {
            if (err) {
                throw err;
            }

            db.query('SELECT * FROM merchandise WHERE mer_id = ?', [mer_id], (err, merchandise) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('데이터베이스 오류');
                    return;
                }

                if (merchandise.length === 0) {
                    res.status(404).send('제품을 찾을 수 없음');
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
                    body: 'merchandiseCU.ejs', 
                    logined: 'YES',
                    merchandise: merchandise,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    uu:"o"
                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            })
        })})
    },
    update_process: (req, res, file) => {
        var post = req.body;
        var mer_id = post.mer_id; 
        var newCategory = post.category;
        var newName = post.name;
        var newPrice = post.price;
        var newStock = post.stock;
        var newBrand = post.brand;
        var newSupplier = post.supplier;
        var newImage = post.image; 
        var newSale_yn = post.sale_yn;
        var newSalePrice = post.sale_price;
        var newImage = file === 'No' ? null : file;

        if (newImage) {
            db.query('UPDATE merchandise SET category = ?, name = ?, price = ?, stock = ?, brand = ?, supplier = ?, image = ?, sale_yn = ?, sale_price = ? WHERE mer_id = ?',
                [newCategory, newName, newPrice, newStock, newBrand, newSupplier, newImage, newSale_yn, newSalePrice, mer_id], (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('데이터베이스 오류');
                        return;
                    }
                    res.writeHead(302, { Location: `view/u` });
                    res.end();
                })
        } else {
            db.query('UPDATE merchandise SET category = ?, name = ?, price = ?, stock = ?, brand = ?, supplier = ?, sale_yn = ?, sale_price = ? WHERE mer_id = ?',
                [newCategory, newName, newPrice, newStock, newBrand, newSupplier, newSale_yn, newSalePrice, mer_id], (err, result) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('데이터베이스 오류');
                        return;
                    }
                    res.writeHead(302, { Location: `view/u` });
                    res.end();
                })
        }
    },
    delete_process: (req, res) => {
        var mer_id = req.params.mer_id
        db.query('DELETE FROM merchandise WHERE mer_id = ?', [mer_id], (error, merchandise) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/` });
            res.end();
        });
    }
}