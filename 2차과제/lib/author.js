// 201935241 김지원
const db = require('./db');
const qs = require('querystring');

module.exports = {
  home: (req, res) => {
    db.query('SELECT * FROM author', (error, authors) => {
      if (error) {
        throw error;
      }

      const c = '<a href="create">create</a>';
      const b = '<h2></h2><p></p>';

      const context = {
        list: authors,
        control: c,
        body: b
      };

      req.app.render('home', context, (err, html) => {
        res.end(html);
      });
    });
  },

  page: (req, res) => {
    const id = req.params.pageId;
    db.query('SELECT * FROM author', (error, authors) => {
      if (error) {
        throw error;
      }

      db.query(`SELECT * FROM author WHERE id = ${id}`, (error2, author) => {
        if (error2) {
          throw error2;
        }

        const c = `<a href="/create">create</a>&nbsp;&nbsp;
                   <a href="/update/${author[0].id}">update</a>&nbsp;&nbsp;
                   <a href="/delete/${author[0].id}" onclick='if(confirm("정말로 삭제하시겠습니까?")==false){ return false }'>delete</a>`;
        const b = `<h2>${author[0].name}</h2><p>${author[0].profile}</p>`;
        const context = {
          list: authors,
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
    db.query('SELECT * FROM author', (error, authors) => {
      if (error) {
        throw error;
      }

      const context = {
        list: authors,
        control: `<a href="/create">create</a>`,
        body: `<form action="/create_process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit"></p>
              </form>`
      };

      req.app.render('home', context, (err, html) => {
        res.end(html);
      });
    });
  },

  create_process: (req, res) => {
    let body = '';
    req.on('data', (data) => {
      body = body + data;
    });

    req.on('end', () => {
      const post = qs.parse(body);
      db.query('INSERT INTO author (name, profile) VALUES (?, ?)',
        [post.name, post.description], (error, result) => {
          if (error) {
            throw error;
          }

          res.writeHead(302, { Location: `/page/${result.insertId}` });
          res.end();
        }
      );
    });
  },

  update: (req, res) => {
    const id = req.params.pageId;
    db.query('SELECT * FROM author', (error, authors) => {
      if (error) {
        throw error;
      }

      db.query('SELECT * FROM author WHERE id = ?', [id], (error2, author) => {
        if (error2) {
          throw error2;
        }

        const context = {
          list: authors,
          control: `<a href="/create">create</a> <a href="/update/${author[0].id}">update</a>`,
          body: `<form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${author[0].id}">
                    <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                    <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                    <p><input type="submit"></p>
                  </form>`
        };

        req.app.render('home', context, (err, html) => {
          res.end(html);
        });
      });
    });
  },

  update_process: (req, res) => {
    let body = '';
    req.on('data', (data) => {
      body = body + data;
    });

    req.on('end', () => {
      const post = qs.parse(body);
      db.query('UPDATE author SET name=?, profile=? WHERE id=?',
        [post.name, post.description, post.id], (error, result) => {
          if (error) {
            throw error;
          }

          res.writeHead(302, { Location: `/page/${post.id}` });
          res.end();
        }
      );
    });
  },

  delete_process: (req, res) => {
    const id = req.params.pageId;
    db.query('DELETE FROM author WHERE id = ?', [id], (error, result) => {
      if (error) {
        throw error;
      }

      res.writeHead(302, { Location: `/` });
      res.end();
    });
  }
};
