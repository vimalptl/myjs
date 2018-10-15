/*
 *
 * 
 */

 // dependencies
 var server = require('./lib/server.js');
 var workers = require('./lib/workers.js');

 // Delcear the app
 var app = {};

 // Init the function
 app.init = function() {
    // start the server
    server.init();
    // start the workers
    //workers.init();
 };

 // Execute
 app.init();

 // Export the app
 module.exports = app;