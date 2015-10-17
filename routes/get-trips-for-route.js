var express = require('express');
var router = express.Router();
var mongoDbConnection = require('../lib/db.js');

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

router.get('/:routeId', isAuthenticated, function(req, res) {
	routeId = req.params.routeId;
	collectionName = "trips";

	console.log("Requested: " + collectionName);
	mongoDbConnection(function(pdb) {
		pdb.collection(collectionName, function(err, collection) {
			collection.find({route_id: routeId}).toArray(function(err, items) {
				res.send(JSON.stringify(items));
			});
		});
	});
});
module.exports = router;