var express = require('express');
var router = express.Router();
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

/* GET home page. */
router.get('/:stop_id', isAuthenticated, function(req, res) {
  stop_id = req.params.stop_id;
  mongoDbConnection(function(pdb) {
    pdb.collection("stops", function(err, collection) {
      collection.find({stop_id:stop_id}).toArray(function(err, items) {
        res.send(JSON.stringify(items[0]));
      });
    });
  });
});

module.exports = router;