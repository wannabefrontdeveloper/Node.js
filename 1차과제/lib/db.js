// 201935241 김지원
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'webdb2023'
});

db.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 오류: ' + err.stack);
    return;
  }
  console.log('데이터베이스 연결 성공');
});

module.exports = db;
