const db = require('./db.js');
var qs = require('querystring');
var sanitizeHtml=require('sanitize-html');

module.exports = {
    home: (req, res) => {
        db.query('SELECT * FROM topic', (err, topics) => {
            var i = 0;
            var tag = '<table border="1" style="border-collapse: collapse;">';
            
            tag = tag + '</table>';
    
            var context = {
                title: 'Topiclist',
                list: topics,
                control: '', 
                body: tag,     
            };
    
            req.app.render('home', context, (err, html) => {
                res.end(html);
            });
        });
    }
    
    ,

    page: (req, res) => {
        var id = req.params.pageId;
        db.query('SELECT * FROM topic', (error, topics) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id= author.id WHERE topic.id = ${id}`, (error2, topic) => {
                if (error2) {
                    throw error2;
                }

                var c = `
                <a href="/create">create</a>&nbsp;&nbsp;
                <a href="/update/${id}">update</a>&nbsp;&nbsp;
                <a href="/delete/${id}" onclick='if(confirm("정말로삭제하시겠습니까?")==false){ return false }'>delete</a>`;
                var b = `<h2>${topic[0].title}</h2>
                        <p>${topic[0].descrpt}</p>
                        <p>by ${topic[0].name}</p>`;
                var context = { title: 'Topiclist',
                    list: topics,
                    control: c,
                    body: b
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                });
            });
        });
    },

    create: (req, res) => {
        db.query(`SELECT * FROM topic`, (error, topics) => {
            if (error) {
                throw error;
            }
            db.query(`SELECT * FROM author`, (err, authors) => {
                var i = 0;
                var tag = '';
                while (i < authors.length) {
                    tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
                    i++;
                }
                var context = {
                    title: 'Topic Create',
                    list: topics,
                    control: `<a href="/create">create</a>`,
                    body: `<form action="/create_process" method="post">
                        <p><input type="text" name="title" placeholder="title"></p>
                        <p><textarea name="description" placeholder="description"></textarea></p>
                        <p><select name="author">
                            ${tag}
                        </select></p>
                        <p><input type="submit"></p></form>`
                };
                req.app.render('home', context, (err, html) => {
                    res.end(html);
                });
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
            var sanitizedTitle = sanitizeHtml(post.title);
            var sanitizedDescription = sanitizeHtml(post.description);
            var sanitizedAuthor = sanitizeHtml(post.author);
            db.query(
                `
                INSERT INTO topic (title, descrpt, created, author_id)
                VALUES (?, ?, NOW(), ?)
                `,
                [sanitizedTitle, sanitizedDescription, sanitizedAuthor],
                (error, result) => {
                    if (error) {
                        throw error;
                    }
                    // res.writeHead(302, { Location: `/page/${result.insertId}` });
                    res.redirect(`/page/${result.insertId}`);
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
                var b = `<form action="/author/create_process" method="post">
        <p><input type = "text" name = "name" placeholder = "name"></p>
        <p><input type = "text" name = "profile" placeholder = "profile"></p>
        <p><input type = "submit" value ="생성"></p>
        </form> `
                var context = { title: 'web',
                    list: topics,
                    control: `<a href="/create">create</a> <a href="/update/${authors[0].id}">update</a>`,
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
          var sanitizedTitle = sanitizeHtml(post.title);
          var sanitizedDescription = sanitizeHtml(post.description);
          var sanitizedAuthor = sanitizeHtml(post.author);
          db.query('UPDATE topic SET title=?, descrpt=?, author_id=? WHERE id=?',
            [sanitizedTitle, sanitizedDescription, sanitizedAuthor, post.id],
            (error, result) => {
              res.writeHead(302, { Location: `/page/${post.id}` });
              res.end();
            }
          );
        });
      },



      delete_process: (req, res) => {
        var id = req.params.pageId;
        db.query('DELETE FROM topic WHERE id = ?', [id], (error, result) => {
          if (error) {
            throw error;
          }
          res.writeHead(302, { Location: `/` });
          res.end();
        });
      }
        
};