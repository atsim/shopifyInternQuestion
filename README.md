# Summer 2019 Developer Intern Challenge Question

This is a barebones marketplace written using Node.js and Express.js. The application is hosted on heroku with Google Cloud SQL.

The baseurl of the marketplace is: *shopifyantonytsim.herokuapp.com*


**Show all products**
----
  Returns json data containing all products.

* **URL**

  /products/

* **Method:**

  `GET`
  
*  **URL Params**

   **Optional:**
 
   `stock=1`

* **Sample Calls:**

  ```javascript
    curl 'shopifyantonytsim.herokuapp.com/products'
    curl 'shopifyantonytsim.herokuapp.com/products?stock=1'
  ```

**Show specific product**
----
  Returns json data containing one product.

* **URL**

  /products/:productid

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `productid=[integer]`

* **Sample Call:**

  ```javascript
    curl 'shopifyantonytsim.herokuapp.com/products/2'
  ```

**Purchase a product**
----
  Purchases an item from the online marketplace.

* **URL**

  /purchase/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `productid=[integer]`

* **Sample Call:**

  ```javascript
    curl --data "" 'shopifyantonytsim.herokuapp.com/purchase?productid=11'
  ```

**Show contents of cart**
----
  Returns json data containing all products within a cart and the total of all the products inside.

* **URL**

  /cart/

* **Method:**

  `GET`
  
*  **URL Params**

   **Required:**
 
   `cartid=[integer]`

* **Sample Call:**

  ```javascript
    curl 'shopifyantonytsim.herokuapp.com/cart?cartid=2'
  ```

**Create new cart**
----
  Create a new shopping cart.

* **URL**

  /cart/

* **Method:**

  `POST`

* **Sample Call:**

  ```javascript
    curl --data "" 'shopifyantonytsim.herokuapp.com/cart'
  ```

**Add to cart**
----
  Puts an item into the cart.

* **URL**

  /addtocart/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `cartid=[integer]`

   `productid=[integer]`   

* **Sample Call:**

  ```javascript
    curl --data "" 'shopifyantonytsim.herokuapp.com/addtocart?cartid=5&productid=12'
  ```

**Check out cart**
----
  Purchases all items within a cart.

* **URL**

  /checkout/

* **Method:**

  `POST`
  
*  **URL Params**

   **Required:**
 
   `cartid=[integer]`

* **Sample Call:**

  ```javascript
    curl --data "" 'shopifyantonytsim.herokuapp.com/checkout?cartid=2'
  ```