const db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var cookie = require('cookie');

function authIsOwner(req,res) {
    var isOwner = false;
    var cookies = {}; 
    if(req.headers.cookie)
        {  cookies= cookie.parse(req.headers.cookie);  }
    if(cookies.email==='giwonk' && cookies.password ==='jiwon@7860')
        {  isOwner = true;  } 
    return isOwner      
}

function authStatusUI(req,res) {
    var login = '<a href="/login">login</a>';
    if (authIsOwner(req,res)){  login = `<a href="/logout_process">logout</a>`  } 
    return login;
}

module.exports = { 
    home : (req,res) => {
            // var isOwner = false;
            // var cookies = {}; 
            // if(req.headers.cookie)
            //     {  cookies= cookie.parse(req.headers.cookie);  }
            // if(cookies.email==='bhwang99@gachon.ac.kr' && cookies.password ==='123456')
            //     {  isOwner = true;  } 

            db.query('SELECT * FROM topic', (error,topics)=>{  
                var login = ''
                // login = `<a href="/login">login</a>`
                // var isOwner = authIsOwner(req,res);
                // if (isOwner){  login = `<a href="/logout_process">logout</a>`  } 
                // else  {  login = `<a href="/login">login</a>`   }
                login = authStatusUI(req,res);
                var c = '<a href="/create">create</a>'
                var b = '<h2>Welcome</h2><p>Node.js Start Page</p>'
    
                var context = { lg : login, 
                                title: 'Topic List',
                                list:topics, 
                                control:c,
                                body:b};
                req.app.render('home', context, (err,html)=>{
                res.end(html)  })
            });
        },
    page : (req,res) => {
            var id = req.params.pageId;
            db.query('SELECT * FROM topic', (error,topics)=>{  
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id WHERE topic.id = ${id}`,(error2, topic)=>{
                    if(error2){
                        throw error2;
                    }
                    var login = ''
                    // login = `<a href="/login">login</a>`
                    login = authStatusUI(req,res);
                    var c = `<a href="/create">create</a>&nbsp;&nbsp;<a href="/update/${id}">update</a>&nbsp;&nbsp;<a href="/delete/${topic[0].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a>`
                    var b = `<h2>${topic[0].title}</h2>
                             <p>${topic[0].descrpt}</p>
                             <p>by ${topic[0].name}</p>`

                    var context = { lg : login,
                                    title : 'Topic Detail',
                                    list:topics, 
                                    control:c,
                                    body:b};
                        res.app.render('home', context, (err,html)=>{
                    res.end(html)  })
                })
            });
        },
    login : (req,res) => {
        db.query('SELECT * FROM topic', (error,topics)=>{  
            var c = '<a href="/create">create</a>'
            var b = `<form action="/login_process" method="post">
                        <p><input type = "text" name="email" placeholder="email"</p>
                        <p><input type = "text" name="password" placeholder="password"</p>
                        <p><input type="submit"></p>
                     </form>`

            var context = { lg : `<a href="/login">login</a>`,
                            title: 'Login',
                            list:topics, 
                            control:c,
                            body:b    };
            req.app.render('home', context, (err,html)=>{
            res.end(html)  })
        });

    },
    login_process : (req, res) => {
        var body = '';
        req.on('data', (data)=> {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            if(post.email==='giwonk' && post.password ==='jiwon@7860'){
                res.writeHead(302,{
                    'Set-Cookie':[
                        `email = ${post.email}`,
                        `password=${post.password}`,
                        `nickname=egoing`], Location:'/'});
                res.end();
                }
            else {
                res.end('Who?');
            }
        });
    },
    logout_process : (req, res) => {
        
            res.writeHead(302,{
                'Set-Cookie':[
                    `email = ; Max-Age=0`,
                    `password=;Max-Age=0`,
                    `nickname=;Max-Age=0`], Location:'/'});
                    res.end();

    },
    create : (req,res) => {
            if(authIsOwner(req,res) === false){
                res.end(`<script type='text/javascript'>alert("Login required ~~~")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
            }
            db.query(`SELECT * FROM topic`, (error,topics)=>{
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM author`,(err, authors)=>{
                    var i = 0;
                    var tag = '';
                    while(i<authors.length)
                    {
                        tag+= `<option value="${authors[i].id}">${authors[i].name}</option>`;
                        i++;
                    }

                    var login  =  '';
                    login = authStatusUI(req,res);
                    
                    var context = { lg : login,
                                    title : 'Topic Create',
                                    list:topics, 
                                    control: `<a href="/create">create</a>`, 
                                    body :`<form action="/create_process" method="post">
                                            <p><input type="text" name="title" placeholder="title"></p>
                                            <p><textarea name="description" placeholder="description"></textarea></p>
                                            <p><select name="author">
                                                  ${tag}
                                               </select></p>  
                                            <p><input type="submit"></p></form>`
                                };
                    req.app.render('home',context, (err, html) => {
                        res.end(html); 
                    }); 
                }); // 두번째 query 메소드 괄호
            }); // 첫번째 query 메소드 괄호
        },
    create_process : (req,res) => {
            if(authIsOwner(req,res) === false){
                res.end(`<script type='text/javascript'>alert("Login required ~~~")
                <!--
                setTimeout("location.href='http://localhost:3000/'",1000);
                //-->
                </script>`)
            }

            var body = '';
            
            req.on('data', (data)=> {
                body = body + data;
            });
            req.on('end', () => {
                var post = qs.parse(body);
                sanitizedTitile = sanitizeHtml(post.title)
                sanitizedDescription = sanitizeHtml(post.description)
                sanitizedAuthor = sanitizeHtml(post.author)
                db.query(`
                    INSERT INTO topic (title, descrpt, created, author_id)
                        VALUES(?, ?, NOW(),?)`,
                    [sanitizedTitile, sanitizedDescription, sanitizedAuthor ], (error, result)=> {
                        if(error) {
                            throw error;
                        }
                        //res.writeHead(302, {Location: `/page/${result.insertId}`});
                        res.redirect(`/page/${result.insertId}`)
                        res.end();
                    }
                );
            });
        },
    update : (req, res) => {
        var _url = req.url;
        id = req.params.pageId;
        db.query('SELECT * FROM topic', (error, topics)=> {
            if(error) { 
                throw error;
            }
            db.query(`SELECT * FROM topic WHERE id=?`,[id], (error2, topic) => {
                if(error2) {
                    throw error2;
                }
                db.query(`SELECT * FROM author`, (err, authors) => {  
                    if(err) {
                        throw err;
                    }
                    var i = 0;
                    var tag = '';
                    while(i < authors.length){
                        var selected = '';
                        if( authors[i].id === (topic[0].author_id) ) { selected = ' selected';}
                        tag+= `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
                        i++;
                    }
                    var context = { title : 'Topic Update',
                                    list:topics, 
                                    control: `<a href="/create">create</a> <a href="/update/${topic[0].id}">update</a>`, 
                                    body :`<form action="/update_process" method="post">
                                            <input type="hidden" name="id" value="${topic[0].id}">
                                            <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                                            <p><textarea name="description" placeholder="description">${topic[0].descrpt}</textarea></p>
                                            <p><select name="author">
                                                  ${tag}
                                               </select></p>
                                            <p><input type="submit"></p>
                                            </form>`
                                    };
                    req.app.render('home',context, (err, html) => {
                        res.end(html); 
                        }); 
                    }); // author 테이블 select 
                });  // topic 테이블 update할 레코드 select
            }); // topic 테이블 전체 select
        },
    update_process : (req, res)=> {
            var body = '';
            req.on('data', (data) => {
                body = body + data;
            });
            req.on('end', () => {
                var post = qs.parse(body);
                db.query('UPDATE topic SET title=?, descrpt=?, author_id = ? WHERE id=?',
                    [post.title, post.description, post.author , post.id], (error, result) => {
                    res.writeHead(302, {Location: `/page/${post.id}`});
                    res.end();
                });
            });
        },
    delete_process : (req, res) => {
            id = req.params.pageId ;
            db.query('DELETE FROM topic WHERE id = ?', [id], (error, result) => {
                    if(error) {
                         throw error;
                    }
                    res.writeHead(302, {Location: `/`});
                    res.end();
                });
        },
    upload: (req,res) => {
        var context = {lg: ''
    };
    req.app.render('uploadtest',context,(err,html) => {
        res.end(html)})
    }
}