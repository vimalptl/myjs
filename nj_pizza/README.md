# Node JS -  Pizza Cart Project HW#2
This is my master class - Nodejs Rest Service

## Sample service calls.

/tokens  -- login
{ "email": ? , "password" : ?}

/menus?menutype=pizza  -- retrieve menu

/cart  -- add to cart
{  "email" : ?, "itemcode" : "P10IGFCZ","count" : 2, "price" : 1199}

/checkout   -- complete cart -- currently addition card details carry no value since we are using stripe sandbox.
{ "name" : "Vimal Patel", "cardnbr" : 378282246310005,"expdate" : 102020,"cvv" : 443}

/tokens?id=tokenId  -- logout


## Project structure
* 'index.js' : This file starts the node server;
* '/https/' : This folder contains the certificates  and key for https
* '/lib/'   : This folder contains helper modules
* '/lib/handlers.js' :  Module to handle incoming request [Get, Post, Put, Delete] on /Users /Ping /tokens /cart
* '/lib/helpers.js'  :  Module to common functions
* '/lib/config.js' : This file contain envioronment configuration.  For now we use staging and production.  Staging defaulted.
* '/lib/data.js  :  Instead of database we will be using files to store data, this is the file handling object.  This will use the .data directory for storage.
* '/lib/server.js' :  Server Init and functions
* './.data/'    :  .data directory was create with sub directory of /users, /carts and /tokens to store appropriate data from request calls.  Eventually this can be a database call.

## Service requirement
1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.
2. Users can log in and log out by creating (use post /tokens) or destroying (use get /tokens?id=) a token.
3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system). 
4. A logged-in user should be able to fill a shopping cart with menu items
5. A logged-in user should be able to create an order. 
6. When an order is placed, you should email the user a receipt.

* /menus
[get] -- Retrieve hard-coded pizza menu  -- menu is retrieve regardless of weather you are logged in or not.
      -- ?menutype=pizza

* /users 
[post] -- create a user
[get] -- get a user with email# (querystring) and a valid token in header.
[put] -- update user data and a valid token in header
[delete] -- delete user data with email (querystring) and a valid token in header [TODO: deal with hangover orders]

* /tokens  
[post] -- create a token id (20char alphanumeric) with email# and password
[get] -- get token data with id (querystring). Need a valid token in header.
[put] -- update token data. Need a valid token in header.
[delete] -- delete token data with email (querystring). Need a valid token in header.

* /cart (pizza cart for orders incurred within a token session)
[post] -- create a cart order or add to cart order
[get] -- get cart order based on token. Need a valid token in header.

* /orders (Orders incurred)
[get] -- get order based on user. Need a valid token in header.

* /checkout (Checkout Order)
[post] -- Create an order
       -- make payment based on cart.pay using Stripe, 
       -- Add order to user profile to track user related orders,
       -- remove cart if order was successfully proccessed by Stripe, 
       -- email notification using MailGun.


 ## Https Server
To setup https you need openssl to create key and cert.  Download open ssl from http://slproweb.com/products/Win32OpenSSL.html.
I installed 64bit and ran the following command to create the key and cert and manally moved the key.pem and cert.pem into nj-pizza/https folder.

```
$ openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
-- key is created and you may need to fill in the organization information to generate the cert.
```

 ## Start the server
To start the server you can do one of the follow from the `/nj-rest` folder:
 *Staging environment*
```
$ node index.js
```
```
-- using windows command...
$ set NODE_ENV=staging
$ node index.js
```
 *Production environment*
```
$ set NODE_ENV=production 
$ node index.js
```
