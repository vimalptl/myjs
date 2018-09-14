// dependencies
var http = require("http");
var https = require("https");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require('./config');
var fs = require("fs");
var handlers = require('./lib/handlers');
var helpers = require('./lib/helpers');

//TODO Get Rid of this
helpers.sendTwilioSMS("8183046189", "Hello", function(err) {
    console.log("Twilio SMS Test");
    console.log("Any error? ", err);
});

// Instantiate the server
var httpServer = http.createServer((req, res) => {
    unifiedServer(req,res);
});

// start there server as http
httpServer.listen(config.httpPort, function() {
 console.log("The http is listening on port " +  config.httpPort + " in " + config.envName +" now");
});

// Instantiate the server
var httpsServerOptions = {
    'key' : fs.readFileSync('./https/key.pem'), 
    'cert' : fs.readFileSync('./https/cert.pem')
}
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req,res);
});

// start there server as http
httpsServer.listen(config.httpsPort, function() {
 console.log("The https is listening on port " +  config.httpsPort + " in " + config.envName +" now");
});



// Server logic for both http and https
var unifiedServer = (req, res) => {
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
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notfound;
        // Construct a data object to send to the hander
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method'  : method,
            'headers' : headers,
            'payload' : helpers.parseJsonToObject(buffer)
        };

        // Rout the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {

            //use the status code callback by the hander, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // payload called by the handler or default to empty  
            payload = typeof(payload) == 'object' ? payload : {};
            //Convert the payload to a string
            var payloadString = JSON.stringify(payload);
            //return response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            //Log the request
            console.log('Retur4n this response: ', statusCode, payloadString);
        });

    });

};



// Define a router
var router = {
    'ping' : handlers.ping,
    'hello' : handlers.hello,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'checks' : handlers.checks
};
