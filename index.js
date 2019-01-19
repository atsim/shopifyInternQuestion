require('dotenv').config()

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({extended: true}))
  .get('/', (req, res) => res.render('index'))
  .get('/products', function(req, res, next) {
    let inStock = "";
    if (req.query.stock === "1") {
      inStock = " WHERE inventory_count > 0";
    }
    connection.query(
      "SELECT * FROM products" + inStock, req,
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  })
  .get('/products/:itemName', function(req, res, next) {
    const itemName = req.params.itemName;
    connection.query(
      "SELECT * FROM products where title=?", [itemName],
      function(error, results, fields) {
        if (error) throw error;
        res.json(results);
      }
    );
  })
  .post('/purchase', function(req, res, next) {
    const itemName = req.body.itemname;
    var curInventory = 0;
    connection.query("SELECT inventory_count FROM products where title=?", [itemName],
      function(error, results, fields) {
        if (error) throw error;
        curInventory = results[0].inventory_count;

        if (curInventory > 0) {
          connection.query("UPDATE products SET inventory_count=" + (curInventory-1) + " where title=?", [itemName],
            function(error, results, fields) {
              if (error) throw error;
              res.send("Successfully purchased " + itemName + ".\nThere are " + (curInventory-1) + " remaining.\n");
            }
          );
        } else {
          res.send("Unable to purchase. The item requested is out of stock");
        }
      }
    );
  })

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
