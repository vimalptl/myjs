/* 
 * Create and export configuration variable
 * Author : Vimal Patel
 * Date : 9/1/2018
 * 
 * Usage: (Windows)  set NODE_ENV=staging or production  (default staging)
 * than run node index.js
 * 
 * 
*/

// Container for all the environments
var environments = {};

// We will create 2 env, Staging and Production, staging as default

// default
environments.staging = {
    'httpPort' : 3000,
    'httpsPort': 3001,
    'envName' : 'staging',
    'hashingSecret' : 'thisisasecret',
    'maxChecks' : 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
      },
    'salestax' : 10
 };


 // Production 
environments.production = {
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisisalsoasecret',
    'maxChecks' : 5,  
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
      },
    'salestax' : 10
};

// Determine which env was passed as commond-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is set to one of the env above, if not default to staging.
var environmentsToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentsToExport;