//201935241 김지원
const express = require('express');
var session = require('express-session')
var MySqlStore = require('express-mysql-session')(session)
const app = express();
var options = {
  host : 'localhost',
  user : 'root',
  password: '1234',
  database:'webdb2023'
}
var sessionStore = new MySqlStore(options)

app.use(session({
  secret : 'keyboard cat',
  resave: false,
  saveUninitialized : true,
  store : sessionStore
}))

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))

app.set('views',__dirname+'/views');
app.set('view engine','ejs');

var db = require('./lib/db');
//var topic = require('./lib/topic');
//var author = require('./lib/author');
var authorRouter = require('./router/authorRouter')
var rootRouter = require('./router/rootRouter')


app.use('/',rootRouter)
app.use('/author',authorRouter)
app.use(express.static('public'))
app.listen(3000, () => console.log('Example app listening on port 3000')) ;