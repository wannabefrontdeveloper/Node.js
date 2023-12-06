//201935241 김지원
const express = require('express') 
const app = express()
app.set('views',__dirname + '/views')
app.set('view engine','ejs')

var rootRouter = require('./router/rootRouter')
var authRouther = require('./router/authRouter')

var session = require('express-session')
var MysqlStore = require('express-mysql-session')(session)
var options = {
  host : 'localhost',
  user : 'root',
  password: '1234',
  database:'webdb2023'
}
var sessionStore = new MysqlStore(options)

app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true,
  store : sessionStore
}))

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))


app.use('/', rootRouter)
app.use('/auth',authRouther)

app.listen(3000, () => console.log('Example app listening on port 3000'))