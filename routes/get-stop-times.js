var express = require('express');
var router = express.Router();
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

/* GET home page. */
router.get('/:tripId', isAuthenticated, function(req, res) {
  tripId = req.params.tripId;
  collectionName = "stoptimes";

  mongoDbConnection(function(pdb) {
    pdb.collection(collectionName, function(err, collection) {
      collection.find({
        trip_id: tripId
      }).sort({
        stop_sequence: 1
      }).toArray(function(err, items) {

        console.log(items);

        //return the stoptimes sorted by stop_sequence
        var jsonItems = JSON.stringify(items);
        var sortedArray = items.sort(function(obj1, obj2) {
          // Ascending: first age less than the previous
          st1 = parseInt(obj1.stop_sequence, 10);
          st2 = parseInt(obj2.stop_sequence, 10);
          return st1 - st2;
        });
        //console.log(sortedArray);
        res.send(sortedArray);
      });
    });
  });
});

router.post('/:tripId', function(req, res) {
  res.send(405);
});

router.post('/', function(req, res) {
  res.send(405);
});



module.exports = router;