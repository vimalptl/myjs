# Node JS -  Rest Project
This is my master class - Nodejs Rest Service

## Project structure
* 'index.js' : This file starts the node server;
* 'config.js' : This file contain envioronment configuration.  For now we use staging and production.  Staging defaulted.
* `/https/' : This folder contains the certificates  and key for https

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
