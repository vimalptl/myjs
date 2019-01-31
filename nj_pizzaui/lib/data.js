/*
 *  Library for storing and editing data   
*/

// Dependencies
var fs = require("fs");
var path = require("path");
var helpers = require('./helpers');

// Container for the module to be exported
var lib = {};

// Base directory for data folder
lib.baseDir = path.join(__dirname, '/../.data/');

// Create
lib.create = function(dir, file, data, callback) {
     // open file th write
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx', function(err,fileDescripter) {
        if (!err && fileDescripter) {
           // Convert data to string
           var stringData = JSON.stringify(data);

                // write to file and close
                fs.writeFile(fileDescripter, stringData, function(err) {
                    if (!err) {
                        fs.close(fileDescripter, function(err) {
                            if (!err) {
                                callback(false);
                            } else {
                                callback("Error closing new file");
                            }
                        });
                    } else {
                        callback('Error writing to new file');
                    }
                });
           
        } else {
            callback('Could not create new file, it may not exist.');
        };
    });
};

lib.read = function(dir, file, callback) {
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8', function(err,data) {
        if (!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err,data);
        }
    });
};

lib.update = function(dir, file, data, callback) {
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+', function(err,fileDescripter) {
        if (!err && fileDescripter) {
           // Convert data to string
           var stringData = JSON.stringify(data);

           // Truncate the file
           fs.truncate(fileDescripter, function(err) {
              if (!err) {
                // write to file and close
                fs.writeFile(fileDescripter, stringData, function(err) {
                    if (!err) {
                        fs.close(fileDescripter, function(err) {
                            if (!err) {
                                callback(false);
                            } else {
                                callback("Error closing file");
                            }
                        });
                    } else {
                        callback('Error writing to existing file');
                    }
                });
              } else {
                  callback('Error truncating file')
              }
           });
           
        } else {
            callback('Could not open file for update, it may not exist.');
        };
    });
};

lib.delete = function(dir, file, callback) {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',function(err) {
        if (!err) {
            callback(false);
        } else {
            callback('Error deleting file');
        }
    });
};


//List all the items in the directory
lib.list = function(dir,callback) {
    fs.readdir(lib.baseDir+dir+'/',function(err,data){
        if (!err && data && data.length > 0) {
            var trimmedFileNames = [];
            data.forEach(fileName => {  
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false, trimmedFileNames);

        } else {
            callback(err,data);
        }
    });
};

// Export the module for exposure
module.exports = lib;

