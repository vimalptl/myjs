/*
 * Server related tasks
 * 
 */
// dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require('./config');
var fs = require("fs");
var handlers = require('./handlers');
var helpers = require('./helpers');
var path = require('path');

// instanticate the server module object
var server = {};

//TODO Get Rid of this
//  helpers.sendTwilioSMS("8183046189", "Hello", function(err) {
//      console.log("Twilio SMS Test");
//      console.log("Any error? ", err);
//  });

// Instantiate the server
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req,res);
});


// Instantiate the server
server.httpsServerOptions = {
    'key' : fs.readFileSync(path.join(__dirname,'/../https/key.pem')), 
    'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
};

server.httpsServer = https.createServer(server.httpsServerOptions, (req, res) => {
    server.unifiedServer(req,res);
});




// Server logic for both http and https
server.unifiedServer = (req, res) => {
    // Get url and parse it
    var parsedURL = url.parse(req.url, true);
    // get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the queryString as an object
    var queryStringObject = parsedURL.query;
    // Get the http method.
    var method = req.method.toLowerCase();
    // Get the header as an object
    var headers = req.headers;

    // get payload if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', (data) => {
        buffer = decoder.write(data);
    });

    req.on('end', () => {
        buffer += decoder.end();

        // Chose the handler this request should go to, if not found use the notfound hander
        var chosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notfound;

        // if the request is within the public directory, use the public handler instead
        chosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : chosenHandler;

        // Construct a data object to send to the hander
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method'  : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        // Rout the request to the handler specified in the router
        // 1/19/2019 -- add contentType to distinguish diff between html and json feed, default json
        chosenHandler(data, (statusCode, payload, contentType) => {

            // default json
            contentType = typeof(contentType) == 'string' && contentType.length > 0 ? contentType : 'json';

            //use the status code callback by the hander, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // return resonse for specific content type
            var payloadString = '';
            if (contentType == 'json') {
                res.setHeader('Content-Type', 'application/json');
                // payload called by the handler or default to empty  
                payload = typeof(payload) == 'object' ? payload : {};
                //Convert the payload to a string
                payloadString = JSON.stringify(payload);
            } 
            if (contentType == 'html') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) == 'string' ? payload : '';
            }
            if (contentType == 'favicon') {
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType == 'jpg') {
                res.setHeader('Content-Type', 'image/jpeg');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType == 'ico') {
                res.setHeader('Content-Type', 'image/x-icon');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType == 'png') {
                res.setHeader('Content-Type', 'image/png');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType == 'css') {
                res.setHeader('Content-Type', 'text/css');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }
            if (contentType == 'plain') {
                res.setHeader('Content-Type', 'text/html');
                payloadString = typeof(payload) !== 'undefined' ? payload : '';
            }

            //return response
            res.writeHead(statusCode);
            res.end(payloadString);

            //Log the request
            //console.log('Retur4n this response: ', statusCode, payloadString);
        });

    });

};



// Define a router
server.router = {
    '' : handlers.index,
    'account/create' : handlers.accountCreate,
    'account/edit' : handlers.accountEdit,
    'account/deleted' : handlers.accountDeleted,
    'session/create' : handlers.sessionCreate,
    'session/deleted' : handlers.sessionDeleted,
    'orders/orderlist' : handlers.orderList,
    'ping' : handlers.ping,
    'api/hello' : handlers.hello,
    'api/users' : handlers.users,
    'api/tokens' : handlers.tokens,
    'api/menus' : handlers.menus,
    'api/cart'  : handlers.cart,
    'api/orders' : handlers.orders,
    'api/checkout' : handlers.checkout
};

// Init script
server.init = function() {
    // start the http server
    server.httpServer.listen(config.httpPort, function() {
        console.log('\x1b[34m%s\x1b[0m',"The http is listening on port " +  config.httpPort + " in " + config.envName +" now")

    });
    
    // start there server as http
    server.httpsServer.listen(config.httpsPort, function() {
        console.log('\x1b[35m%s\x1b[0m',"The https is listening on port " +  config.httpsPort + " in " + config.envName +" now");
    });
};

// export the module
module.exports = server;
