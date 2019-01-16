/* 
 *  Helper class for Common Functions  
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');

// Init Container
var helpers = {};

// Create a SHA256 Hash
helpers.hash = function(str) {
    if (typeof(str) == 'string' && str.length > 0) {
       var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
       return hash;  
    } else {
        return false;
    }
};


// Parse a json string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str)  {
    try {
        var obj = JSON.parse(str);
        return obj;
    }catch (e) {
        return {};
    }
};

// Create a string of random alpha numberic string
helpers.createRandomString = function(strLength) {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // define all the possible char that could go into a string
        var possibleChar = 'abcdefghijklmnopqrstuvwxyz0123456789'

        // Start the final string
        var str = '';
        for (i = 1; i <=strLength; i++) {
            // Get a random char from the possibleChar string
            var randomChar = possibleChar.charAt(Math.floor(Math.random()*possibleChar.length));
            //Append this char to the final string
            str+=randomChar;
        }
        // return the final string
        return str;

    } else {
        return false;
    }
};

// Send payment via Stripe
// return : status, transid, paid status
// This is done in a complex way with native node implementation.
/*  Usage:
        helpers.sendStripePayment((res) => {
            if (res.status == 200 || res.status == 201) {
                callback(200, ?);
            } else {         
                callback(400, {'Error': res.message});
            }
*/
helpers.sendStripePayment = function(amount, cardNbr, description, callback) {
    var amount = typeof(amount) == 'number' && amount > 0 ? amount : false;
    var cardNbr = typeof(cardNbr) == 'number' && cardNbr > 0 ? cardNbr : false;
    var description = typeof(description) == 'string' && description.trim().length > 0 ? description.trim() : false; 

    if (amount && cardNbr && description) {
        var data = {
            amount: 100,
            currency: "usd",
            source: "tok_visa", // obtained with Stripe.js
            description: "Charge for vimalp@ri-net.com"
            };
            
                // Configure the request details
                var stringPayLoad = querystring.stringify(data);
                // Configure the request details
                var requestDetails = {
                    'protocol' : 'https:',
                    'hostname' : 'api.stripe.com',
                    'method' : 'POST',
                    'path' : '/v1/charges',
                    'auth' : config.stripe.secretKey,
                    'headers' : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(stringPayLoad)
                    },
                    'data' : stringPayLoad
                };
                var req = https.request(requestDetails,function(res) {
                    // Grab the status of the sent request
                    var status = res.statusCode;
                    // Callback successfully if the request went through
                    if (status == 200 || status ==201) {
                        res.on("data", (d) => {
                            var data = d.toString();
                            var dataObject = JSON.parse(data);                         
                            //console.log("transId: " + dataObject.id);
                            //console.log("paid: " + dataObject.paid);
                            callback({'status' : status, 'transId' : dataObject.id, 'paid' : dataObject.paid});
                        });
                    } else {
                        // Bind to the error event so it does not get thrown
                        req.on("data", function(e) {
                            var data = e.toString();
                            var dataObject = JSON.parse(data);                    
                            callback({'status' : status, 'message' : e.message});
                        });
                    }
                });    
                // Bind to the error event so it does not get thrown
                req.on("error", function(e) {
                    callback(e);
                });
        
                // add the payload
                req.write(stringPayLoad);
                //end the request
                req.end();    
    } else {
        callback({'status' : 400, 'message' : "Missing fields for card payment processing"});
    }
};

// Send mail with mailgun
// return: for now just sent the email.   TODO: Refine further as needed
// to use free email test you have to register the recepient
helpers.sendMailGunMail = function(toMail, subject, text, callback) {
    // TODO: Add email validation, since i am using specific registred email, skip for now.
    var subject = typeof(subject) == 'string' && subject.trim().length > 0 ? subject.trim() : false; 
    var text = typeof(text) == 'string' && text.trim().length > 0 ? text.trim() : false; 

    if (toMail && subject && text) {
        var data = {
            from: 'postmaster@sandboxecb7847e575040758fd44093e747a84b.mailgun.org',
            to: toMail,
            subject: subject,
            text: text
            };
            
                // Configure the request details
                var stringPayLoad = querystring.stringify(data);
                // Configure the request details
                var requestDetails = {
                    'protocol' : 'https:',
                    'hostname' : 'api.mailgun.net',
                    'method' : 'POST',
                    'path' : '/v3/sandboxecb7847e575040758fd44093e747a84b.mailgun.org/messages',
                    'auth' : 'api:'+config.mailgun.apiKey,
                    'headers' : {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(stringPayLoad)
                    },
                    'data' : stringPayLoad
                };
                var req = https.request(requestDetails,function(res) {
                    // Grab the status of the sent request
                    var status = res.statusCode;
                    // Callback successfully if the request went through
                    if (status == 200 || status ==201) {
                        callback(false);
                    } else {
                        // Bind to the error event so it does not get thrown
                        req.on("data", function(e) {
                            var data = e.toString();
                            var dataObject = JSON.parse(data);                    
                            callback(dataObject.message);
                        });
                    }
                });
        
                // Bind to the error event so it does not get thrown
                req.on("error", function(e) {
                    callback(e);
                });
        
                // add the payload
                req.write(stringPayLoad);
                //end the request
                req.end();        
    } else {
        callback("Given parameters where missing or invalid");
    }
}





// Export the module
module.exports = helpers;