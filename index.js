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

  //Query all items
  .get('/products', function(req, res, next) {
    let inStock = "";
    if (req.query.stock === "1") {
      inStock = " where inventory_count > 0";
    }
    connection.query(
      "select * FROM products" + inStock, req,
      function(error, results, fields) {
        if (error) throw error;

        res.json(results);
      }
    );
  })

  //Query specific item
  .get('/products/:productid', function(req, res, next) {
    const productid = req.params.productid;
    connection.query(
      "select * from products where product_id=?", [productid],
      function(error, results, fields) {
        if (error) throw error;

        res.json(results);
      }
    );
  })

  //Purchase an item
  .post('/purchase', function(req, res, next) {
    const productid = req.query.productid;
    let curInventory = 0;
    connection.query("select title,inventory_count from products where product_id=?", [productid],
      function(error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          curInventory = results[0].inventory_count;
          let itemName = results[0].title;

          if (curInventory > 0) {
            connection.query("update products set inventory_count=" + (curInventory-1) + " where product_id=?", [productid],
              function(error, results, fields) {
                if (error) throw error;

                res.send("Successfully purchased " + itemName + ". There are " + (curInventory-1) + " remaining.\n");
              }
            );
          } else {
            res.send("Unable to purchase. The item requested is out of stock\n");
          }
        } else {
          res.send("Requested item does not exist.\n");
        }
      }
    );
  })

  //Create new shopping cart
  .post('/cart', function(req, res, next) {
    connection.query("insert into carts() values()", req,
      function(error, results, fields) {
        if (error) throw error;

        connection.query("select max(cart_id) as cart_id from carts", req,
          function (error, results, fields) {
            if (error) throw error;

            res.send("Your new cart id is: " + results[0].cart_id + ".\n");
          }
        );
      }
    );
  })

  //Check out shopping cart
  .post('/checkout', function(req, res, next) {
    let checkoutLog = "";
    let cartid = req.query.cartid;
    connection.query("select prod.product_id from cartproducts cart left join products prod on cart.product_id = prod.product_id where cart_id=?" , [cartid],
      function (error, results, fields) {
        if (error) throw error;


        let cartSize = results.length;
        let curProduct = 1;
        //Check if item is in stock, if it is then check it out
        results.forEach(function(product) {
          const productid = product.product_id;
          let curInventory = 0;
          connection.query("select title,inventory_count from products where product_id=?", [productid],
            function(error, results, fields) {
              if (error) throw error;

              curInventory = results[0].inventory_count;
              let itemName = results[0].title;

              if (curInventory > 0) {
                connection.query("update products set inventory_count=" + (curInventory-1) + " where product_id=?", [productid],
                  function(error, results, fields) {
                    if (error) throw error;
                  }
                );
                checkoutLog += "Successfully purchased " + itemName + ".There are " + (curInventory-1) + " remaining.\n";
              } else {
                checkoutLog += "Unable to purchase " + itemName + ". The item requested is out of stock\n";
              }

              if (cartSize == curProduct) {
                checkoutLog += "Finished checking out cart " + cartid + ".\n";
                res.send(checkoutLog);
              }
              curProduct += 1;
            }
          );
        });
      }
    );
  })

  //Get shopping cart
  .get('/cart', function(req, res, next) {
    let cartid = req.query.cartid;
    connection.query("select title,price from cartproducts cart left join products prod on cart.product_id = prod.product_id where cart_id=?", [cartid],
      function(error, results, fields) {
        if (error) throw error;

        let total = 0;
        let productsList = [];
        results.forEach(function(product) {
          total += product.price;
          productsList.push(product.title);
        });

        res.send(JSON.parse('[{"total":' + total + ', "products":' + JSON.stringify(results) +  '}]'));
      }
    );
  })

  //Add to shopping cart
  .post('/addtocart', function(req, res, next) {
    let cartid = req.query.cartid;
    let productid = req.query.productid;

    connection.query("select title from products where product_id=?", [productid],
      function(error, results, fields) {
        if (results.length > 0) {
          let itemName = results[0].title;
          connection.query("insert into cartproducts(cart_id, product_id) values (?,?)", [cartid, productid],
            function(error, results, fields) {
              if (error) throw error;

              res.send("Successfully added " + itemName + " to cart " + cartid + ".\n");
            }
          );
        } else {
          res.send("The itmem you tried to add does not exist.\n");
        }
      }
    );
  })

// Port 8080 for Google App Engine
app.set('port', process.env.PORT || 3000);
app.listen(process.env.PORT || 3000);
