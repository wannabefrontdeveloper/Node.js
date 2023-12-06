//201935241 김지원
var db = require('./db');
const merchandise = require('./merchandise');

function authIsOwner(req, res) {
    if (req.session.is_logined) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    home: (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var sql2 = `SELECT * FROM code_tbl where main_id = '0000';`;
        var sql3 = `SELECT address, ROUND((COUNT(*) / (SELECT COUNT(*) FROM person)) * 100, 2) AS rate FROM person GROUP BY address;`;
    
        var subIds;
        var isOwner = authIsOwner(req, res);
        var context;
    
        db.query(sql1 + sql2 + sql3, (error, results) => {
            if (error) {
                throw error;
            }
    
            subIds = results;
    
            var vu = req.params.vu;
            var category = req.params.category;
            var uu = req.params.uu;
    
            if (category) {
                db.query('SELECT * FROM merchandise WHERE category = ?', [category], processMerchandise);
            } else {
                db.query('SELECT * FROM merchandise', processMerchandise);
            }
    
            function processMerchandise(err, merchandise) {
                var i = 0;
                var tag = `<table border="1" width="100%" height="100px">`;
                if (merchandise.length < 1) {
                    tag = "자료 없음";
                } else {
                    while (i < merchandise.length) {
                        tag = tag + `<tr><td><img src=${merchandise[i].image} style="width:100px;height:100px;"></td>
                        <td>${merchandise[i].name}</td><td>가격 : ${merchandise[i].price}</td><td>브랜드 : ${merchandise[i].brand}</td></tr>`;
                        i = i + 1;
                    }
                }
    
                tag = tag + '</table>';
    
                if (isOwner) {
                    if (req.session.class === '01') {
                        context = {
                            menu: 'menuForManager.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            merchandise: merchandise,
                            updatePage: false,
                            vu: vu,
                            boardtypes: subIds[0],
                            subIds: subIds[1],
                            uu: "v",
                        };
                    }
                    else if (req.session.class === '00') {
                        context = {
                            menu: 'menuForMIS.ejs',
                            who: req.session.name,
                            body: 'customerAnal.ejs',
                            logined: 'YES',
                            merchandise: merchandise,
                            updatePage: false,
                            vu: vu,
                            boardtypes: subIds[0],
                            subIds: subIds[1],
                            uu: "o",
                            percentage: results[2] // 'percentage' 변수를 추가하고, 결과의 세 번째 쿼리의 결과를 값으로 설정합니다.
                        };
                    }
                    else if (req.session.class === '02') {
                        context = {
                            menu: 'menuForCustomer.ejs',
                            who: req.session.name,
                            body: 'merchandise.ejs',
                            logined: 'YES',
                            merchandise: merchandise,
                            updatePage: false,
                            vu: vu,
                            boardtypes: subIds[0],
                            subIds: subIds[1],
                            uu: "o",
                        };
                    }
                } else {
                    context = {
                        menu: 'menuForCustomer.ejs',
                        who: '손님',
                        body: 'merchandise.ejs',
                        logined: 'NO',
                        merchandise: merchandise,
                        vu: vu,
                        boardtypes: subIds[0],
                        subIds: subIds[1],
                        uu: "v",
                    };
                }
    
                res.render('home', context, (err, html) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    res.end(html);
                });
            }
        });
    },

    // shop.js
    search: (req, res) => {
        var sql1 = 'SELECT * FROM boardtype;';
        var searchQuery = req.body.search;
        var uu = req.params.uu;
        console.log('검색어:', searchQuery);

        if (!searchQuery) {
            res.send('검색어를 입력해주세요.');
            return;
        }

        var sql2 = `SELECT * FROM merchandise
                    WHERE name = '${searchQuery}' OR brand = '${searchQuery}' OR supplier = '${searchQuery}';`;
        console.log('Search SQL Query:', sql2);

        // subIds 변수를 밖으로 빼서 선언
        var subIds;

        db.query(sql1 + sql2, (error, result) => {
            if (error) {
                throw error;
            }

            subIds = result[0]; // boardtype 정보
            var searchResult = result[1]; // 실제 검색 결과

            console.log('Result : ', searchResult); // 결과를 콘솔에 출력

            var tag = `<table border="1" width="100%" height="100px">`;
            if (searchResult.length < 1) {
                // 검색 결과가 없는 경우 빈 테이블로 설정
                tag = '검색 결과가 없습니다.';
            } else {
                var i = 0;
                while (i < searchResult.length) {
                    tag = tag + `<tr><td><img src=${searchResult[i].image} style="width:100px;height:100px;"></td>
                        <td>${searchResult[i].name}</td><td>가격 : ${searchResult[i].price}</td><td>브랜드 : ${searchResult[i].brand}</td></tr>`;
                    i = i + 1;
                }
            }

            tag = tag + '</table>';

            var isOwner = authIsOwner(req, res);
            var context;

            
        if (isOwner) {
            // 매니저의 경우 처리
            if (req.session.class === '01') {
                context = {
                    menu: 'menuForCustomer.ejs', // 수정된 부분
                    who: req.session.name,
                    body: 'merchandise.ejs', // 수정된 부분
                    logined: 'YES',
                    merchandise: searchResult,
                    updatePage: false,
                    vu: "u",
                    boardtypes: subIds,
                    uu: "o", // 이 부분을 추가합니다.
                };
            }
            else if (req.session.class === '02') {
                // 일반 사용자의 경우 처리
                context = {
                    menu: 'menuForCustomer.ejs', // 수정된 부분
                    who: req.session.name,
                    body: 'merchandise.ejs', // 수정된 부분
                    logined: 'YES',
                    merchandise: searchResult,
                    updatePage: false,
                    vu: null,
                    boardtypes: subIds,
                    uu: "o",
                };
            }
        } else {
            // 일반 사용자의 경우 처리
            context = {
                menu: 'menuForCustomer.ejs', // 수정된 부분
                who: '손님',
                body: 'merchandise.ejs', // 수정된 부분
                logined: 'NO',
                merchandise: searchResult,
                vu: null,
                boardtypes: subIds,
                uu: "o",
            };
        }
            console.log('검색 결과:', searchResult);

            // 여기서 uu 변수를 추가합니다.
            context.uu = uu;

            req.app.render('home', context, (err, html) => {
                if (err) {
                    console.error(err);
                    return;
                }
                res.end(html);
            });
        });
    },
// shop.js

detail: (req, res) => {
    var merId = req.params.merid;
    var sql1 = 'SELECT * FROM boardtype;';
    var sql2 = `SELECT * FROM merchandise WHERE mer_id = ${merId};`;

    // subIds 변수를 밖으로 빼서 선언
    var subIds;

    // 쿼리 실행
    db.query(sql1 + sql2, (error, result) => {
        if (error) {
            throw error;
        }

        subIds = result[0]; // boardtype 정보
        var detailResult = result[1]; // 특정 상품의 상세 정보

        // 결과를 테이블 형식으로 만들기
        var tag = `<table border="1" width="100%" height="100px">`;
        if (detailResult.length < 1) {
            tag = '해당 상품의 상세 정보가 없습니다.';
        } else {
            var i = 0;
            while (i < detailResult.length) {
                tag = tag + `<tr><td><img src=${detailResult[i].image} style="width:100px;height:100px;"></td>
                <td>${detailResult[i].name}</td><td>가격 : ${detailResult[i].price}</td><td>브랜드 : ${detailResult[i].brand}</td></tr>`;
                i = i + 1;
            }
        }

        tag = tag + '</table>';

        var isOwner = authIsOwner(req, res);
        var context;

        if (isOwner) {
            // 매니저의 경우 처리
            if (req.session.class === '01') {
                context = {
                    menu: 'menuForCustomer.ejs', // 수정된 부분
                    who: req.session.name,
                    body: 'merchandiseDetail.ejs', // 수정된 부분
                    logined: 'YES',
                    merchandise: detailResult,
                    updatePage: false,
                    vu: "u",
                    boardtypes: subIds,
                    uu: "o", // 이 부분을 추가합니다.
                };
            }
            else if (req.session.class === '02') {
                // 일반 사용자의 경우 처리
                context = {
                    menu: 'menuForCustomer.ejs', // 수정된 부분
                    who: req.session.name,
                    body: 'merchandiseDetail.ejs', // 수정된 부분
                    logined: 'YES',
                    merchandise: detailResult,
                    updatePage: false,
                    vu: null,
                    boardtypes: subIds,
                    uu: "o",
                };
            }
        } else {
            // 일반 사용자의 경우 처리
            context = {
                menu: 'menuForCustomer.ejs', // 수정된 부분
                who: '손님',
                body: 'merchandiseDetail.ejs', // 수정된 부분
                logined: 'NO',
                merchandise: detailResult,
                vu: null,
                boardtypes: subIds,
                uu: "o",
            };
        }

        // 여기서 uu 변수를 추가합니다.
        //context.uu = context.uu;

        // 여기서 'merchandiseDetail.ejs'를 렌더링하도록 수정합니다.
        res.render('home', context, (err, html) => {
            if (err) {
                console.error(err);
            }
            res.end(html);
        });
    });
},

customeranal: (req, res) => {
    var isOwner = authIsOwner(req, res);

    if (isOwner) {
        if (req.session.class === '00') {
            var sql1 = `select * from boardtype;`;
            var sql2 = `select address,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
                        from person group by address;`;

            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForMIS.ejs',
                    body: 'customerAnal.ejs',
                    /*********** menuForMIS.ejs에 필요한 변수 ***********/
                    who: req.session.name,
                    logined: 'YES',
                    boardtypes: results[0],
                    /*********** customerAnal.ejs에 필요한 변수 ***********/
                    percentage: results[1]
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                });
            });
        }
    } else {
        var sql1 = `select * from boardtype;`;
        var sql2 = `select * from merchandise;`; // Assuming this is the correct SQL for the second case

        db.query(sql1 + sql2, (error, results) => {
            var context = {
                /*********** home.ejs에 필요한 변수 ***********/
                menu: 'menuForCustomer.ejs',
                body: 'merchandise.ejs',
                /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                who: '손님',
                logined: 'NO',
                boardtypes: results[0],
                /*********** mechandise.ejs에 필요한 변수 ***********/
                merchandise: results[1],
                vu: 'v'
            };
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
    }
},

customerbirth: (req, res) => {
    var isOwner = authIsOwner(req, res);

    if (isOwner) {
        if (req.session.class === '00') {
            var sql1 = `select * from boardtype;`;
            var sql2 = `select birth,ROUND(( count(*) / ( select count(*) from person )) * 100, 2) as rate
                        from person group by birth;`;

            db.query(sql1 + sql2, (error, results) => {
                var context = {
                    /*********** home.ejs에 필요한 변수 ***********/
                    menu: 'menuForMIS.ejs',
                    body: 'customerbirth.ejs',
                    /*********** menuForMIS.ejs에 필요한 변수 ***********/
                    who: req.session.name,
                    logined: 'YES',
                    boardtypes: results[0],
                    /*********** customerAnal.ejs에 필요한 변수 ***********/
                    percentage: results[1]
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                });
            });
        }
    } else {
        var sql1 = `select * from boardtype;`;
        var sql2 = `select * from merchandise;`; // Assuming this is the correct SQL for the second case

        db.query(sql1 + sql2, (error, results) => {
            var context = {
                /*********** home.ejs에 필요한 변수 ***********/
                menu: 'menuForCustomer.ejs',
                body: 'merchandise.ejs',
                /*********** menuForCustomer.ejs에 필요한 변수 ***********/
                who: '손님',
                logined: 'NO',
                boardtypes: results[0],
                /*********** mechandise.ejs에 필요한 변수 ***********/
                merchandise: results[1],
                vu: 'v'
            };
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
    }
}

    }
