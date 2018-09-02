# Node JS -  Rest Project
This is my master class - Nodejs Rest Service

## Project structure
* `./index.js` : This file starts the node server;
* `./server` : This module contains the handler of the server, in other words how it handles the requests and does the responses;
* `./server/https/` : This folder contains the certificates and if you clone this repo it also contains the command line instruction to create your own certificates;
* `./controllers` : This module was created to allow expansion of the controllers and exports them as needed;
* `./controllers/hello` : This module is my hello world controller, basically it exports a function that is called from the `/server` module;
* `./config` : This module is responsible to export the configuration information. Basically we have the http and https ports.
* `./config/config.json` : This file contains the environments configurations that are used in the `./config` module.
 ## Https Server
To initialize the HTTPS server you will need to create your certificates. Just ensure that you have openssl installed and execute the command on `./server/https/command.txt`
 ## Start the server
To start the server you can do one of the follow from the `/`:
 *Staging environment*
```
$ node index.js
```
```
$ NODE_ENV=staging node index.js
```
 *Production environment*
```
$ NODE_ENV=production node index.js
```
