const db = require('./db');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');

module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM topic', (error, topics) => {
            db.query('SELECT * FROM author', (err, authors) => {
                var i = 0;
                var tag = '<table border = "1" style="border-collapse: collapse;">'
                while (i < authors.length) {
                    tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td>
                    <a href="/author/update/${authors[i].id}">update</a></td><td>
                    <a href="/author/delete/${authors[i].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a></td></tr>`
                                i += 1;
                }
                tag = tag + '</table>'
                var b = `<form action="/author/create_process" method="post">
        <p><input type = "text" name = "name" placeholder = "name"></p>
        <p><input type = "text" name = "profile" placeholder = "profile"></p>
        <p><input type = "submit" value ="생성"></p>
        </form> `
                var context = {
                    title: 'Authorlist',
                    list: topics,
                    control: tag,
                    body: b
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html)
                })
            });
        });
    },

    
    create: (req, res) => {
        db.query(`SELECT * FROM author`, (error, authors) => {
            if (error) {
                throw error;
            }
            var context = { title: 'web',
                list: authors,
                control: `<a href="/create">create</a>`,
                body: `<form action="/create_process" method="post">
        <p><input type="text" name="name" placeholder="name"></p>
        <p><textarea name="profile" placeholder="profile"></textarea></p>
        <p><input type="submit"></p></form>`
            };
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
    },
    create_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            sanitizedName = sanitizeHtml(post.name)
            sanitizedProfile = sanitizeHtml(post.profile)
            db.query(`
                INSERT INTO author (name, profile)
                VALUES(?, ?)`,
                [sanitizedName, sanitizedProfile], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    //res.writeHead(302, {Location: `/page/${result.insertId}`});
                    res.redirect(`/author`)
                    res.end();
                }
            );
        });
    },
    update: function (request, response) {
        var _url = request.url;
        id = request.params.pageId;
        db.query('SELECT * FROM author', (error, authors) => {
            db.query('SELECT * FROM topic', (err, topics) => {
                var i = 0;
                var tag = '<table border = "1" style="border-collapse: collapse;">'
                while (i < authors.length) {
                    tag = tag + `<tr><td>${authors[i].name}</td><td>${authors[i].profile}</td><td><a 
                    href="/author/update/${authors[i].id}">update</a></td><td><a href="/author/delete/${authors[i].id}">delete</a></td></tr>`
                                i += 1;
                }
                tag = tag + '</table>'

                var updateForm = '';

if (authors.length > 0) {
    var author = authors.find(author => author.id === parseInt(id));
    if (author) {
        b = `
            <form action="/author/update_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <p><input type="text" name="name" placeholder="name" value="${author.name}"></p>
                <p><textarea name="profile" placeholder="profile">${author.profile}</textarea></p>
                <p><input type="submit"></p>
            </form>
        `;}
    }
    
                var context = {  title: 'Update',
                    list: topics,
                    control:tag,
                    body: b
                };
                request.app.render('home', context, function (err, html) {
                    response.end(html);
                });
            });
        })
    },
    update_process: (req, res) => {
        var body = '';
        req.on('data', (data) => {
            body = body + data;
        });
        req.on('end', () => {
            var post = qs.parse(body);
            sanitizedName = sanitizeHtml(post.name);
            sanitizedProfile = sanitizeHtml(post.profile);
            db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
                [sanitizedName, sanitizedProfile, post.id], (error, result) => {
                    if (error) {
                        throw error;
                    }
                    //res.writeHead(302, { Location: `/author/${post.id}` });
                    res.redirect('/author')
                    res.end();
                });
        });
    },
    delete_process: (req, res) => {
        const id = req.params.pageId;
    
        // 먼저 확인하려는 'author'가 'topic' 테이블에서 참조되는지 확인
        db.query('SELECT author_id FROM topic WHERE author_id = ?', [id], (error, result) => {
            if (error) {
                throw error;
            }
            
            if (result.length > 0) {
                // 'topic' 테이블에서 참조되는 경우
                res.send('이 저자는 topic에서 참조되므로 삭제할 수 없습니다.');
            } else {
                // 참조되지 않는 경우, 'author' 테이블에서 삭제 진행
                db.query('DELETE FROM author WHERE id = ?', [id], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    res.writeHead(302, { Location: `/author` });
                    res.end();
                });
            }
        });
    }
    
}