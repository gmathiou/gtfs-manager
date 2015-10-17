var fs = require('fs');
var express = require('express');
var router = express.Router();
var mongoDbConnection = require('../lib/db.js');
var path = require('path');
var AdmZip = require('adm-zip');
var downloadsDir = __dirname + "/../public/downloads/";
var async = require('async');
var stringify = require('csv-stringify');

var isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

router.get('/', isAuthenticated, function(req, res) {
    console.log("Exporting GTFS");

    //Create new zip
    var zip = new AdmZip();
    var now = new Date();
    var zipFileName = "gtfs_" + now.getTime() + ".zip";
    var zipFilePath = path.join(downloadsDir, zipFileName);
    var zipBuffer;
    var iterationCount = 0;

    mongoDbConnection(function(pdb) {
        GTFSFiles.forEach(function(GTFSFile) {

            var txtFileName = GTFSFile.fileNameBase + ".txt";
            var txtFilePath = path.join(downloadsDir, txtFileName);

            //Load data for collection
            pdb.collection(GTFSFile.collection, function(error, collection) {
                collection.find({}, {
                    "_id": false
                }).toArray(function(err, items) {
                    //Create a new file. Open for writing
                    fs.open(txtFilePath, "w+", function(error, fd) {
                        //Parse collection
                        stringify(items, {
                            header: true
                        }, function(err, fileContents) {
                            if (err) {
                                console.log(err);
                            }
                            //Add contents to file
                            fs.writeFile(txtFilePath, fileContents, function(err) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(txtFileName + " created");

                                    //Add txt file to zip
                                    if (items.length > 0) {
                                        zip.addLocalFile(txtFilePath);
                                        console.log(txtFileName + " added to zip");
                                    }
                                    //Delete txt file
                                    fs.unlinkSync(txtFilePath, function(err) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });

                                    zipBuffer = zip.toBuffer();
                                    zip.writeZip(zipFilePath);

                                    //When every file is ready write up the zip
                                    iterationCount++;
                                    if (iterationCount == GTFSFiles.length) {
                                        res.download(zipFilePath, function(err) {
                                            console.log(zipFileName + " created");
                                            if (err)
                                                console.log(err);
                                        });
                                    }
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;