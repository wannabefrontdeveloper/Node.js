//201935241 김지원
var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var MySqlStore = require('express-mysql-session')(session)

var options = {
  host : 'localhost',
  user : 'root',
  password: '1234',
  database:'webdb2023'
}
var sessionStore = new MySqlStore(options)
var app = express()

app.use(session({
  secret : 'keyboard cat',
  resave : false,
  saveUninitialized : true,
  store : sessionStore
}))

app.get('/',function(req,res,next){
  console.log(req.session)
  if(req.session.num === undefined) {
    req.session.num = 1;
  }
  else {
    req.session.num += 1;
  }
  res.send(`Hello session : ${req.session.num}`)
})

app.listen(3000, function() {
  console.log('3000!')
})