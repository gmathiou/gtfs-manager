var express = require('express');
var router = express.Router();
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;

router.get('/', function(req, res) {
	req.logout();
	res.redirect('/login');
});
module.exports = router;