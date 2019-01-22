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

// Html Template Serve Helper
helpers.getTemplate = function(templateName, data, callback) {
    templateName = typeof(templateName) == 'string' && templateName.length > 0 ? templateName : '';
    data = typeof(object) && data !== null ? data : {};

    if (templateName) {
        var templateDir = path.join(__dirname, '/../templates/');
        fs.readFile(templateDir+templateName+'.html','utf8',function(err, str) {
            if (!err && str && str.length>0) {
                // DO interplation on the string
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