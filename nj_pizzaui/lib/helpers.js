/* 
 *  Helper class for Common Functions  
*/

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');
var fs = require("fs");
var path = require("path");


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

// List of test Cards for Stripe.com 
helpers.testCardNumbers = function() {
    return {
        '4242424242424242'  : 'tok_visa',
        '4000056655665556'  : 'tok_visa_debit',
        '5555555555554444'  : 'tok_mastercard',
        '5200828282828210'  : 'tok_mastercard_debit',
        '5105105105105100'  : 'tok_mastercard_prepaid',
        '378282246310005'   : 'tok_amex',
        '6011111111111117'  : 'tok_discover',
        '30569309025904'    : 'tok_diners',
        '3566002020360505'  : 'tok_jcb',
        '6200000000000005'  : 'tok_unionpay'
    };
}

// Send payment via Stripe
// return : status, transid, paid status
// This is done in a complex way with native node implementation.
/*  Usage:
        helpers.sendStripePayment(100,4242424242424242, 'Order number abcd', (res) => {
            if (res.status == 200 || res.status == 201) {
                callback(200, ?);
            } else {         
                callback(400, {'Error': res.message});
            }
        });
*/
helpers.sendStripePayment = function(amount, cardNbr, description, callback) {
    var amount = typeof(amount) == 'number' && amount > 0 ? amount : false;
    var cardNbr = typeof(cardNbr) == 'number' && cardNbr >= 0 ? cardNbr : false;
    var description = typeof(description) == 'string' && description.trim().length > 0 ? description.trim() : false; 
    var cclist = this.testCardNumbers();
    //console.log("amount: " + amount + " cardNbr: " + cardNbr + "desc: " + description + " cardToken: " + cclist[cardNbr]);
    if (amount && cardNbr && description) {
        var data = {
            amount: amount,
            currency: "usd",
            source: cclist[cardNbr], 
            description: description
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

// Html Template Serve Helper
helpers.getTemplate = function(templateName, data, callback) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : '';
    data = typeof(object) && data !== null ? data : {};

    if (templateName) {
        var templateDir = path.join(__dirname, '/../templates/');
        fs.readFile(templateDir+templateName+'.html','utf8',function(err, str) {
            if (!err && str && str.length>0) {
                // DO interpolation on the string
                var finalString = helpers.interpolate(str, data);
                callback(false, finalString);
            } else {
                callback('No template could be found');
            }
        });
    } else {
        callback('A valid template name was not specified');
    }
}

//Add the universal header and footer to the string, and pass provided data object to header and the footer.
helpers.addUniversialTemplate = function(str, data, callback) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(object) && data !== null ? data : {};
    // get the header
    helpers.getTemplate('_header', data, function(err, headerString) {
        if (!err && headerString) {
        // get the footer
            helpers.getTemplate('_footer', data, function(err, footerString) {
                if (!err && footerString) {
                    // add them all togeather
                    var fullString = headerString+str+footerString;
                    callback(false, fullString);
                } else {
                    callback('Could not find the footer template');
                }
            });
        } else {
            callback('Could not find the header template');             
        }   
    });
}

helpers.interpolate = function(str, data) {
    str = typeof(str) == 'string' && str.length > 0 ? str : '';
    data = typeof(object) && data !== null ? data : {};

    // Add the templateGlobals to the data object, prepend their key name with "global"
    for (var keyName in config.templateGlobals) {
        if (config.templateGlobals.hasOwnProperty(keyName)) {
            data['global.'+keyName] = config.templateGlobals[keyName];
        }
    }
    // For each key in the data object, insert its value into the string at the corresponding placeholder
    for (var key in data) {
        if (data.hasOwnProperty(key) && typeof(data[key]) == 'string') {
            var replace = data[key];
            var find = '{'+key+'}';
            str = str.replace(find, replace);
        }
    }
    return str;
}

// Get the contents of a static public asset
helpers.getStaticAsset = function(fileName, callback) {
    fileName = typeof(fileName) == 'string' && fileName.length > 0 ? fileName : false;
    if (fileName) {
        var publicDir = path.join(__dirname, '/../public/');
        fs.readFile(publicDir+fileName, function(err,data) {
            if (!err && data) {
                callback(false, data);
            } else {
                callback('No file could be found');
            }
        });
    }
}




// Export the module
module.exports = helpers;