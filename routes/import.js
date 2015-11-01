var formidable = require('formidable');
var fs = require('fs-extra');
var express = require('express');
var async = require('async');
var path = require('path');
var router = express.Router();
var unzip = require('unzip');
var csv = require('csv');
var uploadsDir = __dirname + "/../public/uploads/";
var newPath = "";
var tempFilePath = "";
var mongoDbConnection = require('../lib/db.js');
var utils = require('../lib/utils.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

router.post('/', isAuthenticated, function(req, res, next) {
  importingError = false;
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    newPath = uploadsDir + files.file.name;
    fs.copy(files.file.path, newPath, function (error) {
      if(error) {
        throw error;
        //res.send(500, { error: error });
      } else {
        tempFilePath = files.file.path;
        res.send(200);
        async.series([
            unzipFile,
            removeDatabase,
            importFiles,
            removeUploads,
            removeTempFiles
        ], function(error, results) {
          if(error) {
            console.log(error);
            res.send(500, { error: error });
          } else {
            console.log("Completed uploading");
          }
        });
      }
    });
  });
});

function unzipFile(callback){
  console.log("Unzipping file: " + newPath)
  fs.createReadStream(newPath)
    .pipe(unzip.Extract({ path: uploadsDir }).on('close', function(){console.log("close"); callback(null, true); }))
    .on('error', function(error){
      console.log("Unzipping error: " + error);
      callback(error, false);
    });
}

function removeDatabase(callback, result) {
    mongoDbConnection(function(pdb) {
    console.log("Remove old db");
    async.forEach(GTFSFiles, function(GTFSFile, cb){
        pdb.collection(GTFSFile.collection, function(error, collection) {
          collection.remove({}, function(error, numberOfRemovedDocs) {
            if(error){
              console.log(error);
              cb(error, false);
            } else {
              cb(null, true);
            }
          });
        });
    }, function(error){
      if(error) {
        console.log(error);
        callback(error, false);
      } else {
        console.log("--> Finished removing old db");
        callback(null, false);
      }
    });
  });
}

function importFiles(callback, result) {
  mongoDbConnection(function(pdb) {
   async.forEach(GTFSFiles, function(GTFSFile, cb){
     if(GTFSFile){
       var filepath = path.join(uploadsDir, GTFSFile.fileNameBase + '.txt');
       if (!fs.existsSync(filepath)) return cb();
       csv()
        .from.path(filepath, {columns: true})
        .on('record', function(line, index){
          pdb.collection(GTFSFile.collection, function(error, collection){
            collection.insert(line, {continueOnError:true}, function(error, inserted) {
               if(error) {
                console.log(error);
              }
            });
          });
        })
        .on('end', function(count){
          console.log("Imported collection: " + GTFSFile.collection + " --Entries: " + count);
          cb(null, true);
        })
        .on('error', function(error){
          console.log(error);
          cb(error, false);
        });
      }
    }, function(error){
      if(error){
        callback(error, false);
      } else {
        callback(null, true);
        console.log("--> Importing completed");
      }
    });
  });
}

function removeUploads(callback, result){
  fs.readdir(uploadsDir, function(error, files) {
    async.forEach(files, function(file, cb){
      var filePath = uploadsDir + file;
      fs.remove(filePath, function(error){
        if(error) {
          console.log(error);
        }
      });
      cb(null);
    }, function(error){
      if(error){
        callback(error, false);
      } else {
        console.log("--> Removing files completed");
        callback(null, true);
      }
    });
  });
}

function removeTempFiles(callback, result){
  //Remove temp file
  fs.remove(tempFilePath, function(error){
    if (error) {
      console.error(error);
      callback(error, false);
    } else {
      console.log("Removed: " + tempFilePath);
      callback(null, true);
    }
  });
}

router.get('/', function(req, res, next) {
  res.send("Only POST is available in this router");
});

module.exports = router;
