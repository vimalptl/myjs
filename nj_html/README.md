# Node JS -  Rest Project UI Development, Core Node Version
master nodejs class - Nodejs Rest Service with html contentType

## Project structure
* 'index.js' : This file starts the node server;
* '/https/' : This folder contains the certificates  and key for https
* '/lib/'   : This folder contains helper modules
* '/lib/handlers.js' :  Module to handle incoming request [Get, Post, Put, Delete] on /Users /Ping /tokens /checks
* '/lib/helpers.js'  :  Module to common functions
* '/lib/config.js' : This file contain envioronment configuration.  For now we use staging and production.  Staging defaulted.
* '/lib/data.js  :  Instead of database we will be using files to store data, this is the file handling object.  This will use the .data directory for storage.
* '/lib/server.js' :  Server Init and functions
* './.data/'    :  .data directory was create with sub directory of /users, /checks and /tokens to store appropriate data from request calls.  Eventually this can be a database call.
* './template/' :   Server html templates based on path set in server.js
* './public/' : Static Content such as app.css, app.js, images
## Service requirement - TODO

* Content Type: HTML
[accountCreate] - Create Account
[accountDeleted] - Delete an existing account
[accountEdit] - Edit an account
[checksCreate] - Create checks to monitor for this user
[checksEdit] - Edit existing checks for this user
[checksList] - List out all the checks being monitored for this user
[sessionCreate] - Login creates a session token
[sessionDelete] - Logout deletes the session token

* Content Type: JSON
* api/users 
[post] -- create a user
[get] -- get a user with phone# (querystring) and a valid token in header.
[put] -- update user data and a valid token in header
[delete] -- delete user data with phone# (querystring) and remove any associated url checks and a valid token in header
* api/tokens 
[post] -- create a token id (20char alphanumeric) with phone# and password
[get] -- get token data with id (querystring). Need a valid token in header.
[put] -- update token data. Need a valid token in header.
[delete] -- delete token data with phone# (querystring). Need a valid token in header.

* api/checks (checks represents monitoring of a given url)
[post] -- create a check and update user object with check Id (20char alphanumeric)
[get] -- get check data. Need a valid token in header.
[put] -- update check data. Need a valid token in header.
[delete] -- delete check data with Check id# (querystring) and remove check id from user object. Need a valid token in header.


 ## Https Server
To setup https you need openssl to create key and cert.  Download open ssl from http://slproweb.com/products/Win32OpenSSL.html.
I installed 64bit and ran the following command to create the key and cert and manally moved the key.pem and cert.pem into nj-rest/https folder.

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
