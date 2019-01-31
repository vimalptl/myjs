/*
 *  Workers related Task
 */

 // Dependencies
 var path = require('path');
 var fs = require('fs');
 var _data = require('./data');
 var _log = require('./log');
 var http = require('http');
 var https = require('https');
 var url = require('url');
 var helpers = require('./helpers');

 // instanciate the worker object
 var workers = {};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = function() {
    // get all the checks
    _data.list('checks', function(err, checks) {
        if (!err && checks && checks.length > 0) {
            checks.forEach(check => {
                // read in the check data
                _data.read('checks',check, function(err, originalCheckData) {
                    if (!err && originalCheckData) {
                        // pass it to the check vlidator, andlet that function continue or log errors as needed.
                        workers.validateCheckData(originalCheckData);
                    } else {
                        console.log("Erro: Could not find any check to process");                       
                    }
                });              
            });
        } else {
            console.log("Erro: Could not find any check to process");
        }
    });
};

// Sanity-check the check-data
workers.validateCheckData = function(originalCheckData) {
    originalCheckData = typeof(originalCheckData) == 'object' && originalCheckData !== null ? originalCheckData : {};
    originalCheckData.id = typeof(originalCheckData.id) == 'string' && originalCheckData.id.trim().length == 20 ? originalCheckData.id.trim() : false;
    originalCheckData.phone = typeof(originalCheckData.phone) == 'string' && originalCheckData.phone.trim().length == 20 ? originalCheckData.phone.trim() : false;
    originalCheckData.protocol = typeof(originalCheckData.protocol) == 'string' && ['http','https'].indexOf(originalCheckData.protocol) > -1 ? originalCheckData.protocol.trim() : false;
    originalCheckData.url = typeof(originalCheckData.url) == 'string' && originalCheckData.url.trim().length > 0 ? originalCheckData.url.trim() : false;
    originalCheckData.method = typeof(originalCheckData.method) == 'string' && ['post','get','put','delete'].indexOf(originalCheckData.method) > -1 ? originalCheckData.method.trim() : false;
    originalCheckData.successCodes = typeof(originalCheckData.successCodes) == 'object' && originalCheckData.successCodes instanceof Array && originalCheckData.successCodes.length > 0 ? originalCheckData.successCodes : false;
    originalCheckData.timeoutSeconds = typeof(originalCheckData.timeoutSeconds) == 'number' && originalCheckData.timeoutSeconds % 1 === 0 && originalCheckData.timeoutSeconds >= 1 && originalCheckData.timeoutSeconds <= 5 ? originalCheckData.timeoutSeconds : false; 

    // Set the keys that may not be set (if the workers have never seen this check)
    originalCheckData.state = typeof(originalCheckData.state) == 'string' && ['up','down'].indexOf(originalCheckData.state) > -1 ? originalCheckData.state.trim() : 'down';
    originalCheckData.lastChecked = typeof(originalCheckData.lastChecked) == 'number' && originalCheckData.lastChecked >= 1  ? originalCheckData.lastChecked : false; 

    // if all the checks pass, pass data along to the next stp in the process
    if (originalCheckData.id &&
        originalCheckData.userPhone &&
        originalCheckData.protocol &&
        originalCheckData.url &&
        originalCheckData.method &&
        originalCheckData.successCodes &&
        originalCheckData.timeoutSeconds) {
            workers.performCheck(originalCheckData);
        } else {
            console.log("Error: One of the checks is not properly formatted, skipping it.")
        }
};

// Perform the check, send the originalCheckData and the outcome of the check process
workers.performCheck = function(originalCheckData) {
   //Prepare the inital check outcome
   var checkOutcome = {
       'error' : false,
       'responseCode' : false
   };
   // mark that the outcome has not been sent yet.
   var outcomeSent = false;

   // Parse the hostname and the path out of the oiginal check data
   var parsedUrl = url.parse(originalCheckData.protocol+'://'+originalCheckData.url, true);
   var hostName = parsedUrl.hostname;
   var path = parsedUrl.path; // useing path and not 'pathname' because w whan tthe query sting.

   // contrust the request
   var requestDetails = {
    'protocol' : originalCheckData.protocol + ':',
    'hostname' : hostName,
    'method' : originalCheckData.method.toUpperCase(),
    'path' : path,
    'timeout' : originalCheckData.timeoutSeconds *1000
   };

   // Instantiate the request object (using either the http or https)
   var _moduleToUse = originalCheckData.protocol == 'http'? http : https;
   var req = _moduleToUse.request(requestDetails, function(res){
        // Grab the status of the request
        var status = res.statusCode;
        // Update the checkOutcom and pass the data along
        checkOutcome.responseCode = status;
        if (!outcomeSent) {
            workers.processCheckOutcome(originalCheckData, checkOutcome);
            outcomeSent == true;
        }
   });
   // bind the erro event
   req.on('error', function(e) {
     // update the checkoutcome and pass the data along
     checkOutcome.error = {
        'error' : true,
        'value' : e
     };

     if (!outcomeSent) {
        workers.processCheckOutcome(originalCheckData, checkOutcome);
        outcomeSent == true;
     };

   });

   // Bind the timeout event
   req.on('timeout', function(e) {
    // update the checkoutcome and pass the data along
    checkOutcome.error = {
       'error' : true,
       'value' : 'timeout'
    };

    if (!outcomeSent) {
       workers.processCheckOutcome(originalCheckData, checkOutcome);
       outcomeSent == true;
    };

  });

  // end the request
  req.end();

};

// Process the check, update the check as needed, trigger a alert 
// Special logic to check for check that has never been tested before (don't alert on this one)
workers.processCheckOutcome = function(originalCheckData, checkOutcome) {
    // decide if the check is considered up or down
    var state = !checkOutcome.error && checkOutcome.responseCode && originalCheckData.successCodes.indexOf(checkOutcome.responseCode)>-1 ? 'up': 'down';

    // Decide if an alert is warrented
    var alertWarrented = originalCheckData.lastChecked && originalCheckData.state != state ? true : false;
    // Log the outcome
    var timeOfCheck = Date.now();
    workers.log(originalCheckData, checkOutcome, state, alertWarrented, timeOfCheck);

    // Udatea the check data
    var newCheckData = originalCheckData;
    newCheckData.state = state;
    newCheckData.lastChecked = Date.now();


    // Sate the updates
    _data.update('checks',newCheckData.id, newCheckData, function(err){
        if (!err) {
            // Send the check data to the next phane in the process
            if (alertWarrented) {
                workers.alertUsertoStateChange(newCheckData);
            } else {
                console.log("Check outcome as not changed, not alert needed");
            }
        } else {
            console.log("Erro trying to save updates to one of the checks");
        }
    });
};


workers.alertUsertoStateChange = function (newCheckData) {
    var msg = 'Alert: Your check for '+newCheckData.method.toUpperCase()+' ' + newCheckData.protocol+'://'+newCheckData.url+' is currently '+newCheckData.state;
    helpers.sendTwilioSMS(newCheckData, newCheckData.userPhone, msg, function(err){
        if (!err) {
            console.log("Success: user was alerted to a state change in their check");            
        } else {
            console.log("Success: Could not sent SMS alert to user regarding state change in their check");            
        }
    });

};


workers.log = function(originalCheckData, checkOutcome, state, alertWarranted, timeOfCheck) {
    // Form the log Data
    var logData = {
        'check' : originalCheckData,
        'outcome' : checkOutcome,
        'state' : state,
        'alert' : alertWarranted,
        'time' : timeOfCheck
        };

    // convert data into string
    var logString = JSON.stringify(logData);

    // Determine the name of log file
    var logFileName = originalCheckData.id;
    
    // Append the log string to file
    _log.append(logFileName, logString, function(err){
        if (!err) {
            console.log("logging to file successful");
        } else {
            console.log("logging to file failed");
        }
    });
};




// Timer to execute the worker-process once per minute
workers.loop = function() {
    setInterval(function() {
        workers.gatherAllChecks();
    },1000*60);  /* run once a minute */
};

// Rotate (Compress) the log file
workers.rotateLogs = function () {
    // List all the (non compressed) log files
    _log.list(false, function(err, logs) {
        if (!err && logs && logs.length > 0) {
            logs.forEach(function(logName) {
                // Compress the data to a different file
                var logId = logName.replace('.log', '');
                var newFileId = logId+'-'+Date.now();
                _log.compress(logId, newFileId, function(err) {
                    if (!err) {
                        // Truncate the log
                        _log.truncate(logId, function(err) {
                            if (!err) {
                                console.log("Success truncating logFile");
                            } else {
                                console.log("Error truncating logFile");
                            }
                        });
                    } else {
                        console.log("Error compressing one of the log files", err);
                    }
                });
            });
        } else {
            console.log("Error: could not find any logs to rotate");
        }
    });
};

// Timer to execute the log-roatpion process once a day
workers.logRotationLoop = function() {
    setInterval(function() {
        workers.gatherAllChecks();
    },1000*60*60*24);  /* run once a day */
};
    // Display in console in Yellow
    console.log('\x1b[33m%s\x1b[0m','Background workers are running')

     // Init script
     workers.init = function() {
    // execute all the checks immediately
    workers.gatherAllChecks();
    // call the loop so the checks will execute later on
    workers.loop();

    // compress all the logs immediately
    workers.rotateLogs();

    // Call the compress loop so logs will be compressed later on
    workers.logRotationLoop();
 };

// Export the module
 module.exports = workers;
