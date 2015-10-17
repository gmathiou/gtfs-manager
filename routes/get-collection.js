var express = require('express');
var router = express.Router();
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

router.get('/:collection', isAuthenticated, function(req, res) {
	collectionName = req.params.collection;
	console.log("Requested: " + collectionName);
	mongoDbConnection(function(pdb) {
		pdb.collection(collectionName, function(err, collection) {
			collection.find().toArray(function(err, items) {
				res.send(JSON.stringify(items));
			});
		});
	});
});
module.exports = router; 