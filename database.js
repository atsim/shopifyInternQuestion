const mysql = require('mysql');

// Database Connection for Production

let config = {
  host: process.env.DB_HOST,
  user: process.env.SQL_USER,
  database: process.env.SQL_DATABASE,
  password: process.env.SQL_PASSWORD,
}

let connection = mysql.createConnection(config);

  module.exports = connection;