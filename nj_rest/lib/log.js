/*
 *  Log Library
 */

 //  Dependencies
 var fs = require('fs');
 var path = require('path');
 var zlib = require('zlib');

 // Container for the module
 var lib = {};

 // Base directory for data folder
lib.baseDir = path.join(__dirname, '/../.log/');

// Append a string to a file, Create the file if it doesn't exist.
lib.append = function(file, str, callback) {
    // open the file for append
    fs.open(lib.baseDir+file+'.log','a',function(err, fileDescriptor) {
        if (!err && fileDescriptor) {
            // Apped the file and close it
            fs.appendFile(fileDescriptor, str+'\n',function(err) {
                if (!err) {
                    fs.close(fileDescriptor, function(err) {
                        if (!err) {
                            callback(false);
                        } else {
                            callback("Error closing file that was being appended");
                        }
                    });
                } else {
                    callback("Error appending to file");
                }
            });
        } else{
            callback("Could not open file for appending");
        }
    });
};

// List all the logs and optionally include the compressed logs
lib.list = function(includeCompressedLogs, callback) {
    fs.readdir(lib.baseDir, function (err, data){
        if (!err && data && data.length > 0) {
            var trimmedFileName = [];
            data.forEach(function(fileName){
                // Add the .log files
                if (fileName.indexOf('.log') > -1){
                    trimmedFileName.push(fileName.replace('.log', ''));
                }
                // Add on the .gz files
                if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
                    trimmedFileName.push(fileName.replace('.gz.b64'), '');
                }
            });
            callback(false, trimmedFileName);
        } else {
            callback(err, data);
        }
    });
};

lib.compress = function(logId, newFileId, callback) {
    var sourceFile = logId+'.log';
    var destFile = newFileId+'.gz.b64';

    //read source file
    fs.readFile(lib.baseDir+sourceFile,'utf8',function(err, inputString) {
        if (!err && inputString) {
            // Compress the data gzip
            zlib.gzip(inputString, function(err, buffer) {
                if (!err && buffer) {
                    // send the data to the destination file
                    fs.open(lib.baseDir+destFile, 'wx',function(err, fileDescriptor){
                        // Write to the destination file
                        fs.writeFile(fileDescriptor, buffer.toString('base64'), function(err) {
                            if (!err) {
                             // clost eh destination file
                             fs.close(fileDescriptor, function(err) {
                                if (!err) {
                                    callback(false);
                                } else {
                                    callback(err);
                                }
                             });
                            } else{
                                callback(err);
                            }
                        });
                    });
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);

        }
    });
};

// Decompress the contents of a .gz.b64 file int a string variable
lib.decompress = function(fileId, callback) {
    var fileName = fileId+'.gz.b64';
    fs.readFile(lib.baseDir+fileName, 'utf8',function(err, str){
        if (!err && str) {
            // Decopress the data
            var inputBuffer = Buffer.from(str, 'base64');
            zlib.unzip(inputBuffer, function(err, outputBuffer) {
                if (!err && str) {
                    // callback
                    var str = outputBuffer.toString();
                    callback(false, str);
                } else {
                    callback(err);
                }
            });
        } else {
            callback(err);
        }
    });
};

// Tuncate a log file
lib.truncate = function(logId, callback) {
    fs.truncate(lib.baseDir+logId+'.log', 0, function(err){
        if (!err) {
            callback(false);
        } else {
            callback(err);
        }
    });
};

 module.exports = lib;