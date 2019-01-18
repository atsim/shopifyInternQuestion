require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database');

/*
app.route('/')
  .get(function(req, res, next) {
    connection.query(
      "SELECT * FROM products", req,
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  });
*/
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .get('/', (req, res) => res.render('index'))
  .get('/products', function(req, res, next) {
    connection.query(
      "SELECT * FROM products", req,
      function(error, results, fields) {
        if (error) throw error;
        res.json(results.rows);
        res.send(results.rows);
      }
    );
  })
  .get('/products/:itemName', function(req, res, next) {
    const itemName = req.params.itemName;
    console.log(itemName);
    connection.query(
      "SELECT * FROM products where title=?", [itemName],
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  })
app.get('/status', (req, res) => res.send('Working!'))

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 3000);
app.listen(3000);
