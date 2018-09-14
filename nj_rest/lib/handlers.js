/* 
 *  Rest Handlers  
*/

// Dependencies
var _data= require('./data');
var helpers = require('./helpers');
var config = require('../config');
// defin3e a handler
var handlers  = {};



//Users
handlers.users = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data,callback);
    } else {
        callback(405);
    }
};

handlers._users =  {};



// Users - post
// Take users and create file based on phone# as unique field.
// Required data : firstName, lastName, phone, password, tosAgreement
// optional data : none
handlers._users.post = function(data, callback) {
    // Validate required fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exist
        // we are using phone number as file name so we just have to check to see if it exist
        _data.read('users',phone, function(err, data) {
           if (err) {
               // hash password.
               var hashedPassword = helpers.hash(password);
               
               if (hashedPassword) {
                var userObject = {
                    'firstName': firstName,
                    'lastName' : lastName,
                    'phone' : phone,
                    'password' : hashedPassword,
                    'tosAgreement' : tosAgreement
                };
 
                // store the user
                _data.create('users', phone, userObject, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        console.log(err);
                        callback(500, {'Error': 'Could not create new user'});
                    }
                });
 
               } else {
                    callback(500, {'Error': 'Could not hash the user\'s password'});
               }

           } else {
               // user aleady exists
               callback(400, {'Error' : 'A user with that phone number already exists'});
           }
        });
    } else {
        callback(400, {'Error' :'Missing required fields'});
    }

};
// User  - get
// Require data: phone
// optional data: none
handlers._users.get = function(data, callback) {
    // Check that the phone number is valid
    // Check for the required field.
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the phone#
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', phone, function(err,data) {
                        if (!err && data) {
                            // Remove the hashed password from the user object before returning it to the request
                            delete data.password;
                            callback(200,data);
                        } else {
                            callback(404);
                        }
                      });               
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
            });

    } else {
       callback(400, {'Error': 'Missing required field'}) ;
    }  
};

// Users - put
// Required Data : phone
// Optional data : firstName, lastName, password (at least one must be specified)
// Only let an authenticated user update their own object.  Don't let them update another object.
handlers._users.put = function(data, callback) {
    
//    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

    // Check option fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

   // Error if phone in invalid
   if (phone) {
      // Error if nothing is send to update
      if (firstName || lastName || password) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the phone#
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', phone, function(err,userData) {
                        if (!err && userData) {
                            // Update user data 
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (password) {
                                userData.password = helpers.hash(password);
                            }
                            //Store the updated data
                            _data.update('users', phone, userData, function(err){
                                if (!err) {
                                    callback(200);
                                } else {
                                    callback(500, {'Error':'Could not update user'});
                                }
                            });
                        } else {
                            callback(400, {'Error':'The specified user does not exist'});
                        }
                      });            
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
            });
      } else {
        callback(400, {'Error': 'Missing fields to update'}) ;
      }
   } else {
      callback(400, {'Error': 'Missing required field'}) ;
   }    

};

//  Users - delete
//  Required field : phone
//  Only let an authenticated user delete their object. DOn't let them delete others object
//  Clean (delete) any other data file associated with this user
handlers._users.delete = function(data, callback) {
    // Check for the required field.
    var phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the phone#
            handlers._tokens.verifyToken(token, phone, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', phone, function(err,userData) {
                        if (!err && userData) {
                            _data.delete('users',phone, function(err) {
                               if (!err) {
                                   // Delete all checks associated with this user
                                   var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                                   var checksToDelete = userChecks.length;
                                   if (checksToDelete > 0) {
                                       // delete checks and keep track of how many were deleted
                                      var checksDeleted = 0;
                                      //  Error flag on delete.
                                      var deletionErrors = false;
                                      userChecks.forEach(checkId => {
                                          // Delete Checks
                                          _data.delete('checks',checkId, function(err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            checksDeleted++;
                                            if (checksDeleted == checksToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                }  else {
                                                    callback(500, {'Error':'Errors Encountered while attempting to delete checsk related to tis user'})
                                                }
                                            }   
                                          });
                                      });
                                   }  else {
                                       callback(200);
                                   }                              
                               } else {
                                   callback(500, {'Error': 'Could not delete the specified user'});
                               }
                            });               
                        } else {
                            callback(400,{ 'Error': 'Could not find specified user'});
                        }                            
                    });
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
       });
    } else {
       callback(400, {'Error': 'Missing required field'}) ;
    }  
};

// Tokens
handlers.tokens = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._tokens[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._tokens =  {};

// Tokens - Post
// Requred data: phone, password
// Optional Data: none
handlers._tokens.post = function(data, callback) {
    var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (phone && password) {
        // Lookup the user who matches the phone#
        _data.read('users',phone,function(err, userData) {
            if (!err && userData) {
                // Hash the sent password and compare to the password stored
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.password) {
                    // if valid, create a new token with a random name, Set expiration data 1 hour in future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;
                    var tokenObject = {
                        'phone' : phone,
                        'id' : tokenId,
                        'expires' : expires
                    };
                    //Store the token
                    _data.create('tokens', tokenId, tokenObject, function(err) {
                        if (!err) {
                            callback(200, tokenObject);
                        } else {
                            callback(500, {'Error':'Could not create a new token'})
                        }
                    });
                } else {
                    callback(400,{'Error': 'Password did not match the specified user'});
                }
            } else {
                callback(400,{'Error': 'Could not find the specified user'});
            }
        });

    } else {
        callback(400,{'Error': 'Missing required field(s)'});
    }
};

// Tokens - get
// Require data: id
// optional data: none
handlers._tokens.get = function(data, callback) {
    // Check for the required field.
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
       _data.read('tokens', id, function(err,tokenData) {
         if (!err && tokenData) {
             callback(200,tokenData);
         } else {
             callback(404);
         }
       });
    } else {
       callback(400, {'Error': 'Missing required field'}) ;
    }  
};

// Tokens - put
// Require data: id, Extend
// optional data: none
handlers._tokens.put = function(data, callback) {
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;

    // Check option fields
    var extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend == true ? true : false;

   // Error if id is invalid
   if (id) {
      // Error if nothing is send to update
      if (extend) {
        _data.read('tokens', id, function(err,tokensData) {
            if (!err && tokensData) {
                // Update tokens data 
                if (tokensData.expires > Date.now()) {
                    var expires = Date.now() + 1000 * 60 * 60;
                    tokensData.expires = expires;
                    //Store the updated data
                    _data.update('tokens', id, tokensData, function(err){
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {'Error':'Could not update user token'});
                        }
                    });
                } else {
                   callback(400, {'Error':'The token has already expired, and cannot be extended'})                 
                }

            } else {
                callback(400, {'Error':'The specified user token does not exist'});
            }
          });
      } else {
        callback(400, {'Error': 'Missing fields to update'}) ;
      }
   } else {
      callback(400, {'Error': 'Missing required field'}) ;
   }  
};

// Tokens - delete
// Require data: id
// optional data: none
handlers._tokens.delete = function(data, callback) {
    // Check for the required field.
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
       _data.read('tokens', id, function(err,data) {
         if (!err && data) {
             _data.delete('tokens',id, function(err,data) {
                if (!err) {
                    callback(200);
                } else {
                    callback(500, {'Error': 'Could not delete the specified user token'});
                }
             });
         } else {
             callback(400,{ 'Error': 'Could not find specified user token'});
         }
       });
    } else {
       callback(400, {'Error': 'Missing required field'}) ;
    }  
};

// Tokens - verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = function(id, phone, callback) {
    //look up the token
    _data.read('tokens',id,function(err, tokenData) {
    if (!err && tokenData) {
     // check that the token is for the given user and has not expired.
     if(tokenData.phone == phone && tokenData.expires > Date.now()) {
         callback(true);
     } else { 
         callback(false);
     }
    } else {
        callback(false);        
    }
 });

};

// Checks
handlers.checks = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checks[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._checks =  {};

// Checks - Post
// Requred data: id, protocol, url, method, successCode, timeoutSeconds
// Optional Data: token in header
handlers._checks.post = function(data, callback) {
    var protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol.trim() : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method.trim() : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false; 

    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get token from the headers
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;

        // Lookup the user by reading the token
        _data.read('tokens', token, function(err, tokenData) {
            if (!err && tokenData) {
                var userPhone = tokenData.phone;
                // look up user data
                _data.read('users',userPhone, function(err, userData) {
                    if (!err && userData) {
                        var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // verify that the user has less then the number of max checks per user.
                        if (userChecks.length < config.maxChecks) {
                            // Create a random id for the check
                            var checkId = helpers.createRandomString(20);
                            // create the check object, and include the user phone
                            var checkObject = {
                                'id' : checkId,
                                'userPhone' : userPhone,
                                'protocol' : protocol,
                                'url' : url,
                                'method' : method,
                                'successCodes' : successCodes,
                                'timeoutSeconds' : timeoutSeconds
                            };
                            //Store the Check
                            _data.create('checks', checkId, checkObject, function(err) {
                                if (!err) {
                                    // Add the checkid to the user's object
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);

                                    // Save the new user Data
                                    _data.update('users',userPhone,userData, function(err) {
                                        if (!err) {
                                            callback(200, checkObject);
                                        } else {
                                            callback(500, {'Error':'Could not update the user with the new check'});
                                        }
                                    });
                                } else {
                                    callback(500, {'Error':'Could not create a new Check'})
                                }
                            });
                        } else {
                            callback(400, {'Error': 'The user already has the max number of checks (' + userChecks.length + ')'});
                        }
                    } else {
                        callback(403);
                    }
                });
            } else {
                callback(403);
            }
        });

    } else {
        callback(400, { 'Error': 'Missing required inputs, or inputs are invalid'});
    }
};

// Checks - Get
// Requred data: id
// Optional Data: token in header
handlers._checks.get = function(data, callback) {
    // Check for the required field.
    var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {

        // Lookup check
        _data.read('checks',id,function(err, checkData) {
            if (!err && checkData) {
                // Only let an authenticated user access their object. Don't let them access other obects
                var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                // verify the given token is valid for the phone#
                    handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                        if (tokenIsValid) {
                            callback(200,checkData);
                        } else {
                            callback(403);
                        }
                    });
            } else {
                callback(404);
            }
        });

    } else {
       callback(400, {'Error': 'Missing required field'}) ;
    }  

};

// Checks - Put
// Requred data: protocol, url, method, successCode, timeoutSeconds
// Optional Data: id and token in header
handlers._checks.put = function(data, callback) {
    // required field
    var id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    // Optional field    
    var protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol.trim() : false;
    var url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    var method = typeof(data.payload.method) == 'string' && ['post','get','put','delete'].indexOf(data.payload.method) > -1 ? data.payload.method.trim() : false;
    var successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    var timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds >= 1 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false; 
    // make sure id is valid
    if (id) {
        // check to see if one of more fields are sent
        if (protocol || url || method || successCodes || timeoutSeconds) {
            // lcok up checks
            _data.read('checks', id, function(err, checkData) {
                if (!err && checkData) {
                    // ensure that the token in the head is valid
                    // Only let an authenticated user access their object. Don't let them access other obects
                    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    // verify the given token is valid for the phone#
                        handlers._tokens.verifyToken(token, checkData.userPhone, function(tokenIsValid) {
                            if (tokenIsValid) {
                                // update the check
                                if (protocol) checkData.protocol = protocol;
                                if (url) checkData.url = url;
                                if (method) checkData.method = method;
                                if (successCodes) checkData.successCodes = successCodes;
                                if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;
                                // Store the new data
                                _data.update('checks', id, checkData, function(err) {
                                    if (!err) {
                                        callback(200);
                                    } else {
                                        callback(500, {'Error': 'Could not update the checks'});   
                                    }
                                });
                            } else {
                                callback(403);
                            }
                        });                           
                } else {
                    callback(400, {'Error': 'Check Id does not exist'});
                }
            });
        } else {
            callback(400, {'Error': 'Missing required field'});
        }
            
    } else {
        callback(400, {'Error': 'Missing required field'});
    }

};

// Checks - Delete
// Requred data: id
// Optional Data: token in header
handlers._checks.delete = function(data, callback) {
        // Check for the required field.
        var id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
        if (id) {
            // Look up the checks
            _data.read('checks', id, function(err, checksData) {
                if (!err && checksData) {
                    // Only let an authenticated user access their object. Don't let them access other obects
                    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
                    // verify the given token is valid for the phone#
                        handlers._tokens.verifyToken(token, checksData.userPhone, function(tokenIsValid) {
                            if (tokenIsValid) {
                                // Delete the check Data
                                _data.delete('checks',id, function(err) {
                                    if (!err) {
                                        _data.read('users', checksData.userPhone, function(err,userData) {
                                            if (!err && userData) {
                                                // get checks from user
                                                var userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];                                                                
                                                // Delete id from user data
                                                // find the check id in array
                                                var checkPosition = userChecks.indexOf(id);
                                                if (checkPosition > -1) {
                                                    userChecks.splice(checkPosition, 1);
                                                    _data.update('users', userData.phone, userData, function(err) {
                                                        if (!err) {
                                                            callback(200);
                                                        } else {
                                                            callback(500,{ 'Error': 'Could not find specified user'});
                                                        }
                                                    });    
                                                } else {
                                                    callback(500,{ 'Error': 'Could not find specified user who created the checks, could not remove check data from user object'});                                                    
                                                }
                                            } else {
                                                callback(500,{ 'Error': 'Could not find specified user who created the checks, could not remove check data from user object'});
                                            }                            
                                        });
                                    } else {
                                        callback(500, {'Error': 'Could not delete check'});
                                    }
                                });                
                            } else {
                                callback(403);
                            }
                });
                } else {
                    callback(400,{ 'Error': 'Check ID does not exist'});
                }
            });
        } else {
           callback(400, {'Error': 'Missing required field'}) ;
        }    
};



// ping handler - can be used to monitor the process 
handlers.ping = function (data, callback) {
    // callback a http status code, and a payload object
    callback(200);
};

// sample handler
handlers.hello = function (data, callback) {
    // callback a http status code, and a payload object
    callback(200, { 'message': "Hello world, this is my first rest service with nodejs  :) "});
};

// not founct hander
handlers.notfound = function (data, callback) {
    // callback a http status code, and a payload object
    callback(404);
};




// Export the module
module.exports = handlers;