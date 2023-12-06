//201935241 김지원
var mysql = require('mysql')
var db = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password: '1234',
  database:'webdb2023',
  multipleStatements: true
})

db.connect()
module.exports = db