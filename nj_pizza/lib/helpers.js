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

// Send SMS message via Twilio
helpers.sendStripPayment = function(callback) {
    // Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")(config.stripe.secretKey);

    const charge = stripe.charges.create({
    amount: 999,
    currency: 'usd',
    source: 'tok_visa',
    receipt_email: 'vimalp@ri-net.com',
    });

};

// Send mail with mailgun
// to use free email test you have to register the recepient
helpers.sendMailGunMail = function(toMail, subject, text, callback) {
 
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
                    callback(status, {'message': dataObject.message});
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
}


// Send SMS message via Twilio
helpers.sendTwilioSMS = function(phone, msg, callback) {
    // validate parameters
    var phone = typeof(phone) == 'string' && phone.trim().length == 10 ? phone.trim() : false;
    var msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false; 
    if (phone && msg) {
        // Configure the request payload
        var payLoad = {
            "From" : config.twilio.fromPhone,
            "To" : '+1'+phone,
            "Body": msg
        };
        // Configure the request details
        var stringPayLoad = querystring.stringify(payLoad);
        // Configure the request details
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : 'api.twilio.com',
            'method' : 'POST',
            'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
            'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
            'headers' : {
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(stringPayLoad)
            }
        };
        var req = https.request(requestDetails,function(res) {
            // Grab the status of the sent request
            var status = res.statusCode;
            // Callback successfully if the request went through
            if (status == 200 || status ==201) {
                callback(false);
            } else {
                callback("Status code returned was " + status);
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
};



// Export the module
module.exports = helpers;