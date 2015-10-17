var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res) {
	res.render('login', {
		title: 'GTFS Manager',
		message: req.flash().message
	});
});

router.post('/', passport.authenticate('login', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}));

module.exports = router;