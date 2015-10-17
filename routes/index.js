var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}

/* GET home page. */
router.get('/', isAuthenticated, function(req, res) {
  res.render('index', { title: 'GTFS Manager', user: req.user});
});


module.exports = router;
