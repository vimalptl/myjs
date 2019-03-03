/* 
 *  Rest Handlers  
*/

// Dependencies
var _data= require('./data');
var helpers = require('./helpers');
var config = require('./config');

// defin3e a handler
var handlers  = {};
/*
 *   HTML Handlers
 *
 * 
 */

// List all Items in the cart - UI
handlers.cartsList = function(data, callback) {
    // Reject any request that isn't a get
    if (data.method == 'get') {
       // prepare data for interpolation
       var templateData = {
           'head.title' : 'Items in Cart',
           'body.class' : 'cartsList'
       }
       // Read in the index template as a string
       helpers.getTemplate('cartsList',templateData,function(err, str) {
           if (!err && str) {
               // Add the universal header and footer
               helpers.addUniversialTemplate(str, templateData,function(err,str) {
                   if (!err && str) {
                       // return the page as html
                       callback(200,str,'html');
                   } else {
                       callback(500, undefined, 'html');
                   }
               });
           } else {
               callback(500, undefined, 'html');
           }
       });
    } else {
       callback(405, undefined, 'html');
    }
 }

// List all Orders - UI
handlers.ordersList = function(data, callback) {
    // Reject any request that isn't a get
    if (data.method == 'get') {
       // prepare data for interpolation
       var templateData = {
           'head.title' : 'List of Orders',
           'body.class' : 'ordersList'
       }
       // Read in the index template as a string
       helpers.getTemplate('ordersList',templateData,function(err, str) {
           if (!err && str) {
               // Add the universal header and footer
               helpers.addUniversialTemplate(str, templateData,function(err,str) {
                   if (!err && str) {
                       // return the page as html
                       callback(200,str,'html');
                   } else {
                       callback(500, undefined, 'html');
                   }
               });
           } else {
               callback(500, undefined, 'html');
           }
       });
    } else {
       callback(405, undefined, 'html');
    }
 }
 
 // List all Menu - UI
 handlers.menusList = function(data, callback) {
     // Reject any request that isn't a get
     if (data.method == 'get') {
        // prepare data for interpolation
        var templateData = {
            'head.title' : 'Menu Items',
            'body.class' : 'menusList'
        }
        // Read in the index template as a string
        helpers.getTemplate('menusList',templateData,function(err, str) {
            if (!err && str) {
                // Add the universal header and footer
                helpers.addUniversialTemplate(str, templateData,function(err,str) {
                    if (!err && str) {
                        // return the page as html
                        callback(200,str,'html');
                    } else {
                        callback(500, undefined, 'html');
                    }
                });
            } else {
                callback(500, undefined, 'html');
            }
        });
     } else {
        callback(405, undefined, 'html');
     }
  }
 




handlers.index = function(data, callback) {
    // Reject any request that isn't a get
    if (data.method == 'get') {
       // prepare data for interpolation
       var templateData = {
           'head.title' : 'Uptime Monitoring - Made simple',
           'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPs sites of all kinds.  When your site goes down, will sent you a text as notification',
           'body.title' : 'Hello templated world!',
           'body.class' : 'index'
       }
       // Read in the index template as a string
       helpers.getTemplate('index',templateData,function(err, str) {
           if (!err && str) {
               // Add the universal header and footer
               helpers.addUniversialTemplate(str, templateData,function(err,str) {
                   if (!err && str) {
                       // return the page as html
                       callback(200,str,'html');
                   } else {
                       callback(500, undefined, 'html');
                   }
               });
           } else {
               callback(500, undefined, 'html');
           }
       });
    } else {
       callback(405, undefined, 'html');
    }
}

// Create a new account
handlers.accountCreate = function(data, callback) {
    // Reject any request that isn't a get
    if (data.method == 'get') {
       // prepare data for interpolation
       var templateData = {
           'head.title' : 'Create an Account',
           'head.description' : 'Signup is easy and only takes a few seconds',
           'body.class' : 'accountCreate'
       }
       // Read in the index template as a string
       helpers.getTemplate('accountCreate',templateData,function(err, str) {
           if (!err && str) {
               // Add the universal header and footer
               helpers.addUniversialTemplate(str, templateData,function(err,str) {
                   if (!err && str) {
                       // return the page as html
                       callback(200,str,'html');
                   } else {
                       callback(500, undefined, 'html');
                   }
               });
           } else {
               callback(500, undefined, 'html');
           }
       });
    } else {
       callback(405, undefined, 'html');
    }
}

// delete an existing account account
handlers.accountDeleted = function(data, callback) {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // prepare data for interpolation
      var templateData = {
          'head.title' : 'Delete an account',
          'head.description' : 'Delete an account',
          'body.class' : 'accountDeleted'
      }
      // Read in the index template as a string
      helpers.getTemplate('accountDeleted',templateData,function(err, str) {
          if (!err && str) {
              // Add the universal header and footer
              helpers.addUniversialTemplate(str, templateData,function(err,str) {
                  if (!err && str) {
                      // return the page as html
                      callback(200,str,'html');
                  } else {
                      callback(500, undefined, 'html');
                  }
              });
          } else {
              callback(500, undefined, 'html');
          }
      });
   } else {
      callback(405, undefined, 'html');
   }
}

// edit an existing account account
handlers.accountEdit = function(data, callback) {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // prepare data for interpolation
      var templateData = {
          'head.title' : 'Edit an account',
          'body.class' : 'accountEdit'
      }
      // Read in the index template as a string
      helpers.getTemplate('accountEdit',templateData,function(err, str) {
          if (!err && str) {
              // Add the universal header and footer
              helpers.addUniversialTemplate(str, templateData,function(err,str) {
                  if (!err && str) {
                      // return the page as html
                      callback(200,str,'html');
                  } else {
                      callback(500, undefined, 'html');
                  }
              });
          } else {
              callback(500, undefined, 'html');
          }
      });
   } else {
      callback(405, undefined, 'html');
   }
}

// Login
handlers.sessionCreate = function(data, callback) {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // prepare data for interpolation
      var templateData = {
          'head.title' : 'Login',
          'body.class' : 'sessionCreate'
      }
      // Read in the index template as a string
      helpers.getTemplate('sessionCreate',templateData,function(err, str) {
          if (!err && str) {
              // Add the universal header and footer
              helpers.addUniversialTemplate(str, templateData,function(err,str) {
                  if (!err && str) {
                      // return the page as html
                      callback(200,str,'html');
                  } else {
                      callback(500, undefined, 'html');
                  }
              });
          } else {
              callback(500, undefined, 'html');
          }
      });
   } else {
      callback(405, undefined, 'html');
   }
}

// Log out
handlers.sessionDeleted = function(data, callback) {
   // Reject any request that isn't a get
   if (data.method == 'get') {
      // prepare data for interpolation
      var templateData = {
          'head.title' : 'Logout',
          'body.class' : 'sessionDeleted'
      }
      // Read in the index template as a string
      helpers.getTemplate('sessionDeleted',templateData,function(err, str) {
          if (!err && str) {
              // Add the universal header and footer
              helpers.addUniversialTemplate(str, templateData,function(err,str) {
                  if (!err && str) {
                      // return the page as html
                      callback(200,str,'html');
                  } else {
                      callback(500, undefined, 'html');
                  }
              });
          } else {
              callback(500, undefined, 'html');
          }
      });
   } else {
      callback(405, undefined, 'html');
   }
}



// Favicon
handlers.favicon = function(data,callback) {
    // Reject any requset that is not Get
    if (data.method == 'get') {
        // ready favicon data
        helpers.getStaticAsset('favicon.ico', function(err, data) {
           if (!err && data) {
               // callback the data
               callback(200,data,'favicon');
           } else {
               callback(500);
           }
        });
    } else {
        callback(405);
    }
}

// Public
handlers.public = function(data,callback) {
   // Reject any requset that is not Get
   if (data.method == 'get') {
       // Get the filename being requested
       var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
       if (trimmedAssetName.length > 0) {
           // Read in the asset's data
           helpers.getStaticAsset(trimmedAssetName, function(err, data) {
               if (!err && data) {
                   // Determine the content type (default to plain text)
                   var contentType = 'plain';
                   if(trimmedAssetName.indexOf('.css') > -1) {
                       contentType = 'css';
                   }
                   if(trimmedAssetName.indexOf('.png') > -1) {
                       contentType = 'png';
                   }
                   if(trimmedAssetName.indexOf('.jpg') > -1) {
                       contentType = 'jpg';
                   }
                   if(trimmedAssetName.indexOf('.ico') > -1) {
                       contentType = 'favicon';
                   }
                   callback(200,data,contentType);
               } else {
                   callback(404);
               }
            });
   
       }
   } else {
       callback(405);
   }
}


/*
*   JSON API Handlers
*
* 
*/






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
// Take users and create file based on email as unique field.
// Required data : firstName, lastName, email, address, password, tosAgreement
// optional data : none
handlers._users.post = function(data, callback) {
    // Validate required fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && email && address && password && tosAgreement) {
        // make sure that the user doesn't already exist
        _data.read('users',email, function(err, data) {
           if (err) {
               // hash password.
               var hashedPassword = helpers.hash(password);
               
               if (hashedPassword) {
                var userObject = {
                    'firstName': firstName,
                    'lastName' : lastName,
                    'address'  : address,
                    'email' : email,
                    'password' : hashedPassword,
                    'tosAgreement' : tosAgreement,
                    'orders' : []
                };
 
                // store the user
                _data.create('users', email, userObject, function(err) {
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
               callback(400, {'Error' : 'A user with that email already exists'});
           }
        });
    } else {
        callback(400, {'Error' :'Missing required fields'});
    }

};
// User  - get
// Require data: email
// optional data: none
handlers._users.get = function(data, callback) {
    // Check that the email is valid
    // Check for the required field.
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length > 0 ? data.queryStringObject.email.trim() : false;
    if (email) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the email
            console.log("Print TOken" + token);
            handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', email, function(err,data) {
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
// Required Data : email
// Optional data : firstName, lastName, address, password (at least one must be specified)
// Only let an authenticated user update their own object.  Don't let them update another object.
handlers._users.put = function(data, callback) {
    
//    var email = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;

    // Check option fields
    var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    var address = typeof(data.payload.address) == 'string' && data.payload.address.trim().length > 0 ? data.payload.address.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

   // Error if email in invalid
   if (email) {
      // Error if nothing is send to update
      if (firstName || lastName || address || password) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the phone#
            handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', email, function(err,userData) {
                        if (!err && userData) {
                            // Update user data 
                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName;
                            }
                            if (address) {
                                userData.address = address;
                            }

                            if (password) {
                                userData.password = helpers.hash(password);
                            }
                            //Store the updated data
                            _data.update('users', email, userData, function(err){
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
//  Required field : email
//  Only let an authenticated user delete their object. DOn't let them delete others object
//  Clean (delete) any other data file associated with this user
handlers._users.delete = function(data, callback) {
    // Check for the required field.
    var email = typeof(data.queryStringObject.email) == 'string' && data.queryStringObject.email.trim().length == 10 ? data.queryStringObject.email.trim() : false;
    if (email) {
        // Only let an authenticated user access their object. Don't let them access other obects
        var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // verify the given token is valid for the email
            handlers._tokens.verifyToken(token, email, function(tokenIsValid) {
                if (tokenIsValid) {
                    _data.read('users', email, function(err,userData) {
                        if (!err && userData) {
                            _data.delete('users',email, function(err) {
                               if (!err) {
                                   // Delete all orders associated with this user
                                   var userOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
                                   var ordersToDelete = userOrders.length;
                                   if (ordersToDelete > 0) {
                                       // delete orders and keep track of how many were deleted
                                      var ordersDeleted = 0;
                                      //  Error flag on delete.
                                      var deletionErrors = false;
                                      userOrders.forEach(orderId => {
                                          // Delete Checks
                                          _data.delete('orders',orderId, function(err) {
                                            if (err) {
                                                deletionErrors = true;
                                            }
                                            ordersDeleted++;
                                            if (ordersDeleted == ordersToDelete) {
                                                if (!deletionErrors) {
                                                    callback(200);
                                                }  else {
                                                    callback(500, {'Error':'Errors Encountered while attempting to delete order related to this user'})
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
// Requred data: email, password
// Optional Data: none
handlers._tokens.post = function(data, callback) {
    var email = typeof(data.payload.email) == 'string' && data.payload.email.trim().length > 0 ? data.payload.email.trim() : false;
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    if (email && password) {
        // Lookup the user who matches the email
        _data.read('users',email,function(err, userData) {
            if (!err && userData) {
                // Hash the sent password and compare to the password stored
                var hashedPassword = helpers.hash(password);
                if (hashedPassword == userData.password) {
                    // if valid, create a new token with a random name, Set expiration data 1 hour in future
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;

                    var tokenObject = {
                        'email' : email,
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
handlers._tokens.verifyToken = function(id, email, callback) {
    //look up the token
    _data.read('tokens',id,function(err, tokenData) {
    if (!err && tokenData) {
     // check that the token is for the given user and has not expired.
     if(tokenData.email == email && tokenData.expires > Date.now()) {
         callback(true);
     } else { 
         callback(false);
     }
    } else {
        callback(false);        
    }
 });

};

// menus
handlers.menus = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._menus[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._menus =  {};

// Retrieve Individual Menu Item
/* usage: 
                handlers._menus.getItemDetails('P10IGFDX', function(data) {
                    if (data) {
                        console.log(data.Code + " " + data.Price);
                    } else {
                        console.log("Item not found");
                    }
                });
*/
handlers._menus.getItemDetails = function(itemCode, callback) {
    itemCode = typeof(itemCode) == 'string' && itemCode.length > 0 ? itemCode : false;
     if (itemCode) {
        // Lookup menu
        _data.read('menus','menu',function(err, menuData) {
            if (!err && menuData) {
                    // Lookup item in menu
                    menuData.forEach(item => {
                         if (item.Code == itemCode) {
                            console.log(item.Code + ":::");
                             callback(item);
                         }
                     })                       
            } else {
                callback(false);
            }
        });
    } else {
        callback(false) ;
    }  
 }; 

// Menus - Get
// You can get the menu with or without a token
handlers._menus.get = function(data, callback) {
    // menus for the required field.
    var menuType = typeof(data.queryStringObject.menutype) == 'string' && data.queryStringObject.menutype.trim().length > 0 ? data.queryStringObject.menutype.trim() : false;
    var itemType = typeof(data.queryStringObject.itemtype) == 'string' && data.queryStringObject.itemtype.trim().length > 0 ? data.queryStringObject.itemtype.trim() : false;
    // console.log("Print MenuType: " + menuType)
    // console.log("Print ItemType: " + itemType)
    if (menuType) {
        // Lookup menu
        _data.read('menus','menu',function(err, menuData) {
            if (!err && menuData) {
                if (itemType) {
                    // Lookup item in menu
                    menuData.forEach(item => {
                         if (item.Code == itemType) {
                            //  console.log(item.Code + ":::");
                             callback(200,item);
                         }
                     })                       
                } else {
                    callback(200,menuData);
                }    
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, {'Error': 'Missing required field'}) ;
    }  
};


// Checks - Post
// Requred data: id, protocol, url, method, successCode, timeoutSeconds
// Optional Data: token in header
handlers._menus.post = function(data, callback) {
    callback(200);
};

// Menus - Put
// TODO: Future Implementation
// Optional Data: id and token in header
handlers._menus.put = function(data, callback) {
    callback(200);
};

// Menus - Delete
// Requred data: id
// TODO:  Future Implementation for deleting menu items.
// Optional Data: token in header
handlers._menus.delete = function(data, callback) {
    callback(200);
};

// cart
handlers.cart = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._cart[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._cart =  {};


// Cart - Post
// Requred data: id (generated not included), email, itemcode, count
// Optional Data: token in header
handlers._cart.post = function(data, callback) {
    var itemCode = typeof(data.payload.itemcode) == 'string' &&  data.payload.itemcode.trim().length > 0  ?  data.payload.itemcode.trim() : false;
    var count = typeof(data.payload.count) == 'number' &&  data.payload.count >= 1  ? data.payload.count : false; 
    // Retrieve item details    
    if (itemCode) {
        // Lookup menu
        _data.read('menus','menu',function(err, menuData) {
            if (!err && menuData) {
                // Lookup item in menu
                var itemData = {};
                menuData.forEach(item => {
                if (item.Code == itemCode) {
                   console.log(item.Code + ":::");
                    itemData = item;
                }
                });                       
                // User integer value only for node class  eg. 10.00 as 1000
                var price = 0;
                if (itemData !== null) {
                    price = Number(itemData.Price);
                }
                price = typeof(price) == 'number'  ? price : false;    
                // TODO: Validate email and itemCode before saving to cart
                console.log(" itemCode: " + itemCode + " count:" + count + " price:" + price)
                if (itemCode && count && price) {
                    // Get token from the headers
                    var token = typeof(data.headers.token) == 'string' && data.headers.token.trim().length > 0 ? data.headers.token.trim() : false;
                    // Lookup the user by reading the token
                    _data.read('tokens', token, function(err, tokenData) {
                        if (!err && tokenData) {
                            var userEmail = tokenData.email;
                            // look up cart based on token - cart will exist as long as token exist
                            _data.read('carts',tokenData.id, function(err, cartData) {
                                // if cart exist than add to cart else create
                                if (!err && cartData) {
                                    var itemLists = typeof(cartData.itemlists) == 'object' && cartData.itemlists instanceof Array ? cartData.itemlists : [];                        
                                    // add to itemList
                                    var itemObject = {
                                        'code' : itemCode,
                                        'count' : count,
                                        'price' : price,
                                        'total' : price * count
                                    };
                                    // Add the itemObject to the carts itemlist
                                    cartData.itemlists = itemLists;
                                    cartData.itemlists.push(itemObject);
                                    // Save the new cart Data
                                    _data.update('carts',tokenData.id,cartData, function(err) {
                                        if (!err) {
                                            // TODO -- calculate total balance price of all items in the list.
                                            // lets add sales tax of 10% -- govt is little too greedy :)
                                            // this can be done by summing up the total.                                                               
                                            handlers._cart.calcCartTotals(tokenData.id, function(calcd) {
                                                if (!calcd) {
                                                    callback(500, {'Error' : 'Could not calculate cart totals'});
                                                }
                                            });                                                          
                                            callback(200);
                                        } else {
                                            callback(500, {'Error':'Could not update the cart with the new item'});
                                        }
                                    });
                                } else {
                                    // create the cart object, and include the user email
                                    var total = price * count;
                                    var cartObject = {
                                        'id' : tokenData.id,
                                        'email' : userEmail,
                                        'itemlists' : [ {
                                            'code' : itemCode,
                                            'count' : count,
                                            'price' : price,
                                            'total' : total
                                        }],
                                        'totals' : 0,
                                        'taxes' : 0,
                                        'pay' : 0
                                    };
                                    //Store the Cart
                                    _data.create('carts', tokenData.id, cartObject, function(err) {
                                        if (err) {
                                            callback(500, {'Error':'Could not create a new cart'});
                                        } else {
                                            // TODO -- calculate total price of all items in the list.
                                            // this can be done by summing up the total.      
                                            handlers._cart.calcCartTotals(tokenData.id, function(calcd) {
                                                if (!calcd) {
                                                    callback(500, {'Error' : 'Could not calculate cart totals'});
                                                }
                                            });                                                          
                                            callback(200);
                                        }
                                    });                            
                                }
                            });
                        } else {
                            console.log("Forbidden here");
                            callback(403);
                        }
                    });
            
                } else {
                    callback(400, { 'Error': 'Missing required inputs, or inputs are invalid'});
                }
            } else {
                callback(400, { 'Error': 'Not a valid menu Item'});
            }
        });
    }

};

// Cart - Get
// Requred data: token in header - cart is based on token for now
// Optional Data: token in header
handlers._cart.get = function(data, callback) {
    // retrieve token
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // lcok up cart
    _data.read('carts', token, function(err, cartData) {
        if (!err && cartData) { 
            // verify the given token is valid for the email#
            handlers._tokens.verifyToken(token, cartData.email, function(tokenIsValid) {
                if (tokenIsValid) {    
                    callback(200,cartData);
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
            });
        } else {
            callback(400, {'Error': 'Cart does not exist'});
        }  
    });
}

// Calculate cart totals
handlers._cart.calcCartTotals = function(cartId, callback) {
   cartId = typeof(cartId) == 'string' && cartId.length > 0 ? cartId : false;
    if (cartId) {
               // look up cart based on token - cart will exist as long as token exist
               _data.read('carts',cartId, function(err, cartData) {
                // if cart exist than add to cart else create
                if (!err && cartData) {
                    var itemLists = typeof(cartData.itemlists) == 'object' && cartData.itemlists instanceof Array ? cartData.itemlists : [];                        
                    // Loop thought Items and calculate the totals         
                    var totalPrice = 0;
                    itemLists.forEach(item => {  
                        totalPrice = totalPrice + item.total 
                    });
                    cartData.totals = totalPrice;
                    cartData.taxes = Math.round(totalPrice *  (config.salestax / 100));
                    cartData.pay = cartData.totals + cartData.taxes;
                    // Save the new cart Data
                    _data.update('carts',cartId,cartData, function(err) {
                        if (!err) {
                            // TODO -- calculate total balance price of all items in the list.
                            // lets add sales tax of 10% -- govt is little too greedy :)
                            // this can be done by summing up the total.                                                                
                            callback(true);
                        } else {
                            callback(false);
                        }
                    });
                } else {
                    callback(false);
                }
            });

    };
};

// cart - Delete
// Required data: token in header
// Optional Data: token in header
handlers._cart.delete = function(data, callback) {
    // retrieve token 
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // look up cart
    _data.read('carts', token, function(err, cartData) {
        if (!err && cartData) { 
            // verify the given token is valid for the email#
            handlers._tokens.verifyToken(token, cartData.email, function(tokenIsValid) {
                if (tokenIsValid) {    
                    // delete cart :)
                    _data.delete('carts',token, function(err) {
                        if (!err) {
                                callback(200);
                        } else {
                            callback(500, {'Error': 'Could not delete the specified cart'});
                        }
                     }); 
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
            });
        } else {
            callback(400, {'Error': 'Cart does not exist'});
        }  
    });  
};


// orders
handlers.orders = function(data, callback) {
    var acceptableMethods = ['get','delete'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._orders[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._orders =  {};



// orders - Get
// Requred data: orderId
// Optional Data: token in header
handlers._orders.get = function(data, callback) {
    // retrieve token
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // lcok up cart
    _data.read('orders', orderId, function(err, orderData) {
        if (!err && orderData) { 
            // verify the given token is valid for the email#
            handlers._tokens.verifyToken(token, orderData.email, function(tokenIsValid) {
                if (tokenIsValid) {    
                    callback(200,orderData);
                } else {
                    callback(403, {'Error':'Missing requred token in header or token is invalid'});
                }
            });
        } else {
            callback(400, {'Error': 'Cart does not exist'});
        }  
    });
}

// Orders - Delete
// Required data: orderId
// Optional Data: token in header
handlers._orders.delete = function(data, callback) {
    // retrieve token 
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // TODO :  Refund orders if not processed or paid.
};

// checkout
handlers.checkout = function(data, callback) {
    var acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._checkout[data.method](data,callback);
    } else {
        callback(405);
    }
};

// Container for all the tokens methods
handlers._checkout =  {};



// checkout - post
// checkout cart by making payment this should create and a paid order
// Requred data: token in header and an available cart record.
// Optional Data: token in header
handlers._checkout.post = function(data, callback) {
    // retrieve token
    var token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
    // validate payment information
    var name = typeof(data.payload.name) == 'string' &&  data.payload.name.trim().length > 0  ?  data.payload.name.trim() : false;
    var cardNbr = typeof(data.payload.cardnbr) == 'number' && data.payload.cardnbr > 0 ? data.payload.cardnbr : false;
    var expDate = typeof(data.payload.expdate) == 'number' && data.payload.expdate > 0 ? data.payload.expdate : false;
    var cvv = typeof(data.payload.cvv) == 'number' && data.payload.cvv > 0 ? data.payload.cvv : false;
    if (token && cardNbr) {
        // lcok up cart and send total for payment.
        _data.read('carts', token, function(err, cartData) {
            if (!err && cartData) { 
                // verify the given token is valid for the email#
                handlers._tokens.verifyToken(token, cartData.email, function(tokenIsValid) {
                    if (tokenIsValid) {
                        // create order
                        var orderId = helpers.createRandomString(10);
                        var now = new Date();
                        var jsonDate = now.toJSON();                    
                        var orderObject = {
                            'id' : orderId,
                            'email' : cartData.email,
                            'itemlists' : cartData.itemlists,
                            'totals' : cartData.totals,
                            'taxes' : cartData.taxes,
                            'pay' : cartData.pay,
                            'paymentid' : '',
                            'paid' : false,
                            'create_date' : jsonDate
                        };
                        console.log(orderObject.pay);
                        // Send items in cart for payment
                        helpers.sendStripePayment(cartData.pay,cardNbr, 'Order number #' + orderId, (res) => {
                            if (res.status == 200 || res.status == 201) {
                                // indicate order was processed 
                                orderObject.paymentid = res.transId;
                                orderObject.paid = res.paid;                                        
                            } else {         
                                orderObject.paid = false;
                            }
                        });                                                                

                        // store and complete the order
                        _data.create('orders', orderId, orderObject, function(err) {
                            if (!err) {
                                // Make Payment
                                // Add the orderid to the user's object
                                // look up user data
                                _data.read('users',cartData.email, function(err, userData) {
                                    if (!err && userData) {
                                        var userOrders = typeof(userData.orders) == 'object' && userData.orders instanceof Array ? userData.orders : [];
                                        userData.orders = userOrders;
                                        userData.orders.push(orderId);

                                        // Save the new user Data
                                        _data.update('users',cartData.email,userData, function(err) {
                                            if (!err) {
                                                //    Notify user when order is complete
                                                helpers.sendMailGunMail('vimalp@ri-net.com', 
                                                                        'Pizza Order # '+ orderId + " processed", 
                                                                        'Order was processed successfully.',
                                                                        (err_res) => {
                                                    if (!err_res) {
                                                        // indicate order was processed
                                                        // remove cart
                                                        _data.delete('carts', token, (err) => {
                                                             if (err) {
                                                                callback(400, {'Error':'Could not remove cart...logout and log back in to process another order'});
                                                            } else {
                                                                callback(200, orderObject);                                        
                                                             }
                                                        })
                                                    } else {         
                                                        // mark order as failed.
                                                        callback(400, {'Error':'Order # '+ orderId +' was created, but could not process email notification.'});
                                                    }
                                                });
                                            } else {
                                                callback(500, {'Error':'Could not update the user with the new order'});
                                            }
                                        });

                                    } else {
                                        callback(500, {'Error':'Could not retrieve user data'})
                                    }
                                });
                            } else {
                                callback(500, {'Error':'Could not create a new order'})
                            }
                        });
                    } else {
                        callback(403, {'Error':'Missing requred token in header or token is invalid'});
                    }
                });
            } else {
                callback(400, {'Error': 'Cart does not exist'});
            }  
        });
    } else {
        callback(403, {'Error':'Missing requred token in header or Payment Data'});
    }
}


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