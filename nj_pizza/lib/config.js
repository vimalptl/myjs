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
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName' : 'staging',
    'hashingSecret' : 'thisisasecret',
    'salestax' : 10,
    'stripe' : {
        'secretKey' : 'key here'
    },
    'mailgun' : {
        'apiKey' : 'key here'
    }
 };


 // Production 
environments.production = {
    'httpPort' : 6000,
    'httpsPort': 6001,
    'envName' : 'production',
    'hashingSecret' : 'thisisalsoasecret',
    'salestax' : 10,
    'stripe' : {
        'secretKey' : 'key here'
    },
    'mailgun' : {
        'apiKey' : 'key here'
    }
};

// Determine which env was passed as commond-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is set to one of the env above, if not default to staging.
var environmentsToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentsToExport;