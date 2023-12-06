const express = require('express');
const app = express()
app.set('views', __dirname + '/views' )
app.set('view engine','ejs');

var db = require('./lib/db')
var author = require('./lib/author')



app.get('/', (req,res) => {
  author.home(req,res);
    })

app.get('/:id',(req,res) => {
  author.page(req,res);
})
  


app.get('/favicon.ico',(req, res) => res.writeHead(404));
app.listen(3000, () => console.log('Example app listening on port 3000'));
