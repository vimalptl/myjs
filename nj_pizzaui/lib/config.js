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
    'salestax' : 10,
    'stripe' : {
        'secretKey' : 'sk_test_YKgft69cKLC0PiaHc14VAl6u'
    },
    'mailgun' : {
        'apiKey' : '2f8d7233db369a52edae08bb4b7f1981-3939b93a-18441041'
    },
    'templateGlobals' : {
          'appName' : 'UpdatimeChecker',
          'companyName' : 'NotARealCompany Corp.',
          'yearCreated' : '2019',
          'baseUrl' : 'http://localhost:3000/'
    }
 };


 // Production 
environments.production = {
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName' : 'production',
    'hashingSecret' : 'thisisalsoasecret',
    'salestax' : 10,
    'stripe' : {
        'secretKey' : 'key here'
    },
    'mailgun' : {
        'apiKey' : 'key here'
    },
    'templateGlobals' : {
          'appName' : 'UpdatimeChecker',
          'companyName' : 'NotARealCompany Corp.',
          'yearCreated' : '2019',
          'baseUrl' : 'http://localhost:3000/'
    }
};

// Determine which env was passed as commond-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current env is set to one of the env above, if not default to staging.
var environmentsToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentsToExport;