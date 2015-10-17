var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res) {
  res.send("This router does not support get");
});

router.post('/:collection', isAuthenticated, function(req, res) {
  json = req.body;
  collectionName = req.params.collection;
  console.log(json);
  if ((isValidObjectId(json["_id"])) == false) {
    console.log("New entry");
    mongoDbConnection(function(pdb) {
      pdb.collection(collectionName, function(err, collection) {
        //Insert to document
        collection.insert(json, {safe:true},
          function(err, result) {
            if (err || result == null) {
              console.log(err);
              res.send(404);
            } else {
              console.log(result);
              var newObj = copyId(collectionName, result[0]);
              res.send(JSON.stringify(newObj));
            }
          });
      });
    });
  } else {
    mongoDbConnection(function(pdb) {
      //console.log("Update entry");
      pdb.collection(collectionName, function(err, collection) {
        json["_id"] = ObjectId(json["_id"]);
        console.log("\nUpdate: " + json["_id"] + ": " + json["stop_id"] + " - " + json["stop_sequence"]);
        //Update document
        collection.update({
          _id: json["_id"]
        }, json, function(err, result) {
          if (err) {
            console.log(err);
            res.send(404);
          }
          res.send(200);
        });
      });
    });
  }
});

function isValidObjectId(str) {
  var pattern = new RegExp("^[0-9a-fA-F]{24}$");
  var res = pattern.test(str);
  return res;
}

//This is to make sure that the gtfs _id of each item is unique. 
//And to make that sure we copy to the _id of each field the object id
function copyId(collectionName, jsonObject) {
  console.log("\nCOPY ID ");
  console.log(jsonObject);
  var objToUpdate = {};
  //Update json object with the _id returned from the precious insertion
  switch (collectionName) {
    case "agencies":
      jsonObject.agency_id = jsonObject._id.toString();
      break;
    case "stops":
      jsonObject.stop_id = jsonObject._id.toString();
      break;
    case "routes":
      jsonObject.route_id = jsonObject._id.toString();
      break;
    case "trips":
      jsonObject.trip_id = jsonObject._id.toString();
      break;
    case "calendars":
      jsonObject.service_id = jsonObject._id.toString();
      break;
  }

  //Update db
  mongoDbConnection(function(pdb) {
    pdb.collection(collectionName, function(err, collection) {
      collection.update({
          _id: ObjectId(jsonObject._id)
        }, {
          $set: jsonObject
        },
        function(err, result) {
          if (err) {
            console.log("Error updating _id: " + err + " Result: " + result);
          }
        });
    });
  });
  return jsonObject;
}

module.exports = router;