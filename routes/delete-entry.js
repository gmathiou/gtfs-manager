var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res) {
  res.send("This router does not support get");
});

router.delete('/:collection/id/:id',isAuthenticated, function(req, res) {
  entryId = req.params.id;
  collectionName = req.params.collection;
  console.log(entryId);
  if ((isValidObjectId(entryId)) == false) {
    console.log("Not a valid object ID");
    res.send(404);
  }

  mongoDbConnection(function(pdb) {
    pdb.collection(collectionName, function(err, collection) {
      if (err) {
        console.log(err);
        res.send(404);
      };
      //Update or insert document
      collection.remove({
        _id: ObjectId(entryId)
      }, function(err, numberOfRemovedDocs) {
        if (err) {
          console.log(err);
          res.send(404);
        };
        res.send(200);
      });
    });
  });
});

function isValidObjectId(str) {
  var pattern = new RegExp("^[0-9a-fA-F]{24}$");
  var res = pattern.test(str);
  return res;
}
module.exports = router;