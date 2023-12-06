//201935241 김지원
const { query } = require('express');
var db = require('./db');
const merchandise = require('./merchandise');
const template = require('./template');
function authIsOwner(req, res) {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    purchase: (req, res) => {
        var sql = `
        SELECT purchase.*, merchandise.category, merchandise.name, merchandise.price, merchandise.stock, merchandise.brand, merchandise.supplier, merchandise.image, merchandise.sale_yn, merchandise.sale_price
        FROM purchase
        LEFT JOIN merchandise ON purchase.mer_id = merchandise.mer_id;
        `;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }

            console.log('result:', results);

            var purchaseDetails = results || [];

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForcustomer.ejs',
                    who: req.session.name,
                    body: 'purchase.ejs',
                    logined: 'YES',
                    purchaseDetails: purchaseDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                };

                console.log(purchaseDetails);

                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    detail: (req, res) => {
        var mer_id = req.params.mer_id;

        var sql = `
            SELECT * FROM purchase 
            LEFT JOIN merchandise 
            ON purchase.mer_id = merchandise.mer_id
            WHERE merchandise.mer_id = ?
        `;

        db.query(sql, [mer_id], (error, purchase) => {
            if (error) {
                throw error;
            }



            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM merchandise WHERE mer_id = ${mer_id};`;

            db.query(sql1 + sql2, (error, result) => {
                if (error) {
                    throw error;
                }

                var subIds = result[0];
                var detailResult = result[1];



                var isOwner = authIsOwner(req, res);

                if (isOwner) {
                    if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'purchaseDetail.ejs',
                            logined: 'YES',
                            merchandise: detailResult,
                            updatePage: false,
                            vu: "u",
                            boardtypes: subIds,
                            mer_id: mer_id,
                            uu: "o",
                        };
                    } else if (req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'purchaseDetail.ejs',
                            logined: 'YES',
                            merchandise: detailResult,
                            updatePage: false,
                            purchase: purchase,
                            vu: null,
                            boardtypes: subIds,
                            mer_id: mer_id,
                            uu: "v",
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'purchaseDetail.ejs',
                        logined: 'NO',
                        merchandise: detailResult,
                        vu: null,
                        boardtypes: subIds,
                        mer_id: mer_id,
                        uu: "o",
                    };
                }

                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },

    detail_process: (req, res) => {
        var post = req.body;
        var mer_id = req.params.mer_id;

        var sql = `
            SELECT * FROM purchase 
            LEFT JOIN merchandise 
            ON purchase.mer_id = merchandise.mer_id
            WHERE merchandise.mer_id = ?
        `;

        db.query(sql, [mer_id], (error, purchase) => {
            if (error) {
                throw error;
            }

            var newloginid = req.session.name;
            var mer_id = post.mer_id;
            var newDate = new Date(); // 현재 날짜와 시간을 가져옵니다.
            var formattedDate = template.dateOfEightDigit(newDate); // 여기를 수정합니다.
            var newPrice = post.price;
            var newPoint = newPrice * 0.005;
            var newQty = post.qty;
            var newTotal = post.total;
            var newPayYN = post.payYN;
            var newCancel = post.cancel;
            var newRefund = post.refund;

            db.query(
                'INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [newloginid, mer_id, formattedDate, newPrice, newPoint, newQty, newTotal, newPayYN, newCancel, newRefund], // 여기를 수정합니다.
                (err, result) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    res.writeHead(302, { Location: `/purchase` });
                    res.end();
                }
            );
        });
    },
    cart: (req, res) => {
        var sql = `
        SELECT cart.*, merchandise.category, merchandise.name, merchandise.price, merchandise.stock, merchandise.brand, merchandise.supplier, merchandise.image, merchandise.sale_yn, merchandise.sale_price
        FROM cart
        LEFT JOIN merchandise ON cart.mer_id = merchandise.mer_id;
        `;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }

            //console.log('result:', results);

            var cartDetails = results || [];

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForcustomer.ejs',
                    who: req.session.name,
                    body: 'purchaseCart.ejs',
                    logined: 'YES',
                    cartDetails: cartDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                };

                //console.log(cartDetails);

                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    
    cart_process: (req, res) => {
        var post = req.body;
        var mer_id = post.mer_id;
        
        // 수정: 기존의 cart 테이블 조회 쿼리를 사용하지 않고, mer_id를 기반으로 데이터를 추가
        var newloginid = req.session.name;
        var newDate = new Date();
        var formattedDate = template.dateOfEightDigit(newDate);
    
        db.query(
            'INSERT INTO cart (loginid, mer_id, date) VALUES (?, ?, ?)',
            [newloginid, mer_id, formattedDate],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Internal Server Error");
                }
    
                res.redirect('/purchase/cart');
            }
        );
    },
    cancel: (req, res) => {
        var purchase_id = req.params.purchase_id;

        db.query('UPDATE purchase SET cancel = "Y" WHERE purchase_id = ?', [purchase_id], (error, result) => {
            if (error) {
                console.error("Error canceling purchase:", error);
                // 에러 처리 또는 다른 동작 수행
                return;
            }

            console.log("Purchase canceled successfully");

            // 구매 목록 갱신 로직 추가
            var sql = `
                SELECT purchase.*, merchandise.category, merchandise.name, merchandise.price,
                merchandise.stock, merchandise.brand, merchandise.supplier, merchandise.image,
                merchandise.sale_yn, merchandise.sale_price
                FROM purchase
                LEFT JOIN merchandise ON purchase.mer_id = merchandise.mer_id
            `;

            db.query(sql, (error, results) => {
                if (error) {
                    console.error("Error fetching updated purchase details:", error);
                    // 에러 처리 또는 다른 동작 수행
                    return;
                }

                var purchaseDetails = results || [];

                var sql1 = 'SELECT * FROM boardtype;';
                var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

                db.query(sql1 + sql2, (error, subIds) => {
                    if (error) {
                        console.error("Error fetching additional details:", error);
                        // 에러 처리 또는 다른 동작 수행
                        return;
                    }

                    var context = {
                        menu: 'menuForcustomer.ejs',
                        who: req.session.name,
                        body: 'purchase.ejs',
                        logined: 'YES',
                        purchaseDetails: purchaseDetails,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                    };

                    res.render('home', context, (err, html) => {
                        if (err) {
                            console.error(err);
                        }
                        res.end(html);
                    });
                });
            });
        });
    },

    checkout: (req, res) => {
        console.log("req.body:", req.body);
    
        // 로그 추가
        console.log("selectedItems type:", typeof req.body.selectedItems);
    
        // selectedItems가 배열로 들어오므로, 바로 사용
        var selectedItems = req.body['selectedItems[]'].map(Number);
    
        // quantities는 문자열 배열이므로 각 값을 숫자로 변환하여 사용
        var quantities = req.body['quantities[]'].map(Number);
        selectedItems = selectedItems.filter(item => !isNaN(item));
    
        // 여기에서 선택된 상품들을 구매 처리하고 카트에서 제거하는 로직을 작성
        // 선택된 상품의 mer_id 및 수량은 selectedItems 및 quantities 배열에서 가져와 사용할 수 있음
    
        var formattedMerIds = selectedItems.join(','); // '8,11,8' -> '8,11,8'
    
        db.query(
            `
            INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund)
            SELECT ?, cart.mer_id, NOW(), merchandise.price, merchandise.price * 0.005, 1, merchandise.price, 'Y', 'N', 0
            FROM cart
            LEFT JOIN merchandise ON cart.mer_id = merchandise.mer_id
            WHERE cart.mer_id IN (${formattedMerIds});
            `,
            [req.session.name], // 로그인된 사용자의 loginid를 사용
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Internal Server Error");
                }
    
                db.query(
                    `
                    DELETE FROM cart
                    WHERE mer_id IN (${formattedMerIds});
                    `,
                    (deleteErr, deleteResult) => {
                        if (deleteErr) {
                            console.error(deleteErr);
                            return res.status(500).send("Internal Server Error");
                        }
    
                        res.redirect('/purchase'); // 구매 처리 후 구매 목록 페이지로 이동
                    }
                );
            }
        );
    },
    view: (req, res) => {
        var vu = req.params.vu;

        var sql = `
        SELECT purchase.*, merchandise.name AS merchandise_name, merchandise.price AS merchandise_price, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image 
        FROM purchase 
        LEFT JOIN merchandise ON purchase.mer_id = merchandise.mer_id`;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }

            var purchaseDetails = results || [];

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchaseView.ejs',
                    logined: 'YES',
                    purchaseDetails: purchaseDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    vu: vu
                };

                //console.log(purchaseDetails);

                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    create: (req, res) => {
        //var vu = 'v';
        var sql = `
        SELECT purchase.*, merchandise.name AS merchandise_name, merchandise.price AS merchandise_price, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image 
        FROM purchase 
        LEFT JOIN merchandise ON purchase.mer_id = merchandise.mer_id`;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }
            var purchaseDetails = results[0] || {};

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'purchaseCU.ejs', // 업데이트 폼 템플릿
                    logined: 'YES',
                    purchase: null,
                    purchaseDetails: purchaseDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    //vu: vu

                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            })
        })
    },
    create_process: (req, res) => {
        var newloginid = req.session.name;
        var post = req.body;
        var mer_id = post.mer_id;
        var newDate = new Date(); // 현재 날짜와 시간을 가져옵니다.
        var formattedDate = template.dateOfEightDigit(newDate); // 여기를 수정합니다.
        var newPrice = post.price;
        var newPoint = newPrice * 0.005;
        var newQty = post.qty;
        var newTotal = post.total;
        var newPayYN = post.payYN;
        var newCancel = post.cancel;
        var newRefund = post.refund;

        db.query(
            'INSERT INTO purchase (loginid, mer_id, date, price, point, qty, total, payYN, cancel, refund) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [newloginid, mer_id, formattedDate, newPrice, newPoint, newQty, newTotal, newPayYN, newCancel, newRefund], // 여기를 수정합니다.
            (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `view/u` });
                res.end();
            })

    },
    update: (req, res) => {
        var id = req.params.purchase_id
        var purchase;
        var sql = `
    SELECT purchase.*, merchandise.name AS merchandise_name, merchandise.price AS merchandise_price, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image 
    FROM purchase 
    LEFT JOIN merchandise ON purchase.mer_id = merchandise.mer_id 
    WHERE purchase.purchase_id = ?`;

        // id를 쿼리에 전달
        db.query(sql, [id], (error, results) => {
            if (error) {
                throw error;
            }


            var purchaseDetails = results[0] || {};

            if (results.length > 0) {
                purchase = results[0];
            } else {
                purchase = null;
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
                    body: 'purchaseCU.ejs',
                    logined: 'YES',
                    purchase: purchase,
                    purchaseDetails: purchaseDetails,
                    vu: 'u',
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            })
        })
    },
    update_process: (req, res) => {
        //var id = req.params.purchase_id
        var newloginid = req.session.name;
        var post = req.body;
        var id = req.body.id;
        var mer_id = post.mer_id;
        var newDate = new Date(); // 현재 날짜와 시간을 가져옵니다.
        var formattedDate = template.dateOfEightDigit(newDate); // 여기를 수정합니다.
        var newPrice = post.price;
        var newPoint = newPrice * 0.005;
        var newQty = post.qty;
        var newTotal = post.total;
        var newPayYN = post.payYN;
        var newCancel = post.cancel;
        var newRefund = post.refund;
        console.log(post)
        db.query('UPDATE purchase SET mer_id=?, qty=?, price=?, payYN=?, cancel=?, refund=? WHERE purchase_id=?',
            [mer_id, newQty, newPrice, newPayYN, newCancel, newRefund, id], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/purchase/view/u` });
                res.end();
            })
    },
    delete_process: (req, res) => {
        var id = req.params.purchase_id;
        db.query('DELETE FROM purchase WHERE purchase_id = ?', [id], (error, purchase) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/purchase/view/u` });
            res.end();
        });
    },




    cartview: (req, res) => {
        var vu = req.params.vu;

        var sql = `
        SELECT cart.*, merchandise.name AS merchandise_name, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image, 
        merchandise.price AS merchandise_price, purchase.price AS purchase_price, purchase.qty AS purchase_qty
        FROM cart
        LEFT JOIN merchandise ON cart.mer_id = merchandise.mer_id
        LEFT JOIN purchase ON cart.mer_id = purchase.mer_id`;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }

            var cartDetails = results || [];

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;

            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cartView.ejs',
                    logined: 'YES',
                    cartDetails: cartDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    vu: vu
                };

                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            });
        });
    },
    cartcreate: (req, res) => {
        var sql = `
        SELECT cart.*, merchandise.name AS merchandise_name, merchandise.price AS merchandise_price, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image 
        FROM cart
        LEFT JOIN merchandise ON cart.mer_id = merchandise.mer_id`;

        db.query(sql, (error, results) => {
            if (error) {
                throw error;
            }
            var cartDetails = results[0] || {};

            var sql1 = 'SELECT * FROM boardtype;';
            var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
            db.query(sql1 + sql2, (error, subIds) => {
                if (error) {
                    throw error;
                }

                var context = {
                    menu: 'menuForManager.ejs',
                    who: req.session.name,
                    body: 'cartCU.ejs', // 업데이트 폼 템플릿
                    logined: 'YES',
                    cart: null,
                    cartDetails: cartDetails,
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                    //vu: vu

                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            })
        })
    },
    cartcreate_process: (req, res) => {
        var newloginid = req.session.name;
        var post = req.body;
        var mer_id = post.mer_id;
        var newDate = new Date();
        var formattedDate = template.dateOfEightDigit(newDate);

        db.query(
            'INSERT INTO cart (loginid, mer_id, date) VALUES (?, ?, ?)',
            [newloginid, mer_id, formattedDate],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/purchase/cartview/v` });
                res.end();
            })

    },
    cartupdate: (req, res) => {
        var id = req.params.cart_id
        var cart;
        var sql = `
        SELECT cart.*, merchandise.name AS merchandise_name, merchandise.brand AS merchandise_brand, merchandise.image AS merchandise_image, 
        merchandise.price AS merchandise_price, purchase.price AS purchase_price, purchase.qty AS purchase_qty
        FROM cart
        LEFT JOIN merchandise ON cart.mer_id = merchandise.mer_id
        LEFT JOIN purchase ON cart.mer_id = purchase.mer_id
        WHERE cart.cart_id = ?`;

        // id를 쿼리에 전달
        db.query(sql, [id], (error, results) => {
            if (error) {
                throw error;
            }


            var cartDetails = results[0] || {};

            if (results.length > 0) {
                cart = results[0];
            } else {
                cart = null;
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
                    body: 'cartCU.ejs',
                    logined: 'YES',
                    cart: cart,
                    cartDetails: cartDetails,
                    vu: 'u',
                    boardtypes: subIds[0],
                    subIds: subIds[1],
                };

                req.app.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                    }
                    res.end(html);
                });
            })
        })
    },
    cartupdate_process: (req, res) => {
        //var id = req.params.purchase_id
        var newloginid = req.session.name;
        var post = req.body;
        var id = req.body.id;
        var mer_id = post.mer_id;
        var newDate = new Date(); // 현재 날짜와 시간을 가져옵니다.
        var formattedDate = template.dateOfEightDigit(newDate); // 여기를 수정합니다.
        var newPrice = post.price;
        var newPoint = newPrice * 0.005;
        var newQty = post.qty;
        var newTotal = post.total;
        var newPayYN = post.payYN;
        var newCancel = post.cancel;
        var newRefund = post.refund;
        console.log(post)
        db.query('UPDATE cart SET mer_id=? WHERE cart_id=?',
            [mer_id, id], (err, result) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.writeHead(302, { Location: `/purchase/cartview/u` });
                res.end();
            })
    },
    cartdelete_process: (req, res) => {
        var id = req.params.cart_id;
        db.query('DELETE FROM cart WHERE cart_id = ?', [id], (error, purchase) => {
            if (error) {
                throw error;
            }
            res.writeHead(302, { Location: `/purchase/cartview/u` });
            res.end();
        });
    },
}

   