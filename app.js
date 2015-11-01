var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var error = require('./routes/error');
var passport = require('passport');
var expressSession = require('express-session');
var flash = require('connect-flash');
var initPassport = require('./lib/passport/init');

var fileImport = require('./routes/import');
var fileExport = require('./routes/export');
var getCollection = require('./routes/get-collection');
var getStopTimes = require('./routes/get-stop-times');
var getStop = require('./routes/get-stop');
var saveEntry = require('./routes/save-entry');
var deleteEntry = require('./routes/delete-entry');
var logout = require('./routes/logout');
var login = require('./routes/login');
var getTripsForRoute = require('./routes/get-trips-for-route');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
app.locals.delimiters = '<% %>';

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    uploadDir: "/uploads",
    extended: true
}));
app.use(cookieParser());
app.use(require('less-middleware')({
    src: path.join(__dirname, 'public')
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static( path.join(__dirname, '/bower_components')));

app.use(expressSession({
    secret: 'gtfs',
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
initPassport(passport);

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

app.use('/', routes);
app.use('/error', error);
app.use('/login', login);
app.use('/logout', logout);
app.use('/import', fileImport);
app.use('/export', fileExport);
app.use('/api', getCollection);
app.use('/save-entry', saveEntry);
app.use('/delete-entry', deleteEntry);
app.use('/api/stoptimes-for-trip', getStopTimes);
app.use('/api/stop', getStop);
app.use('/api/trips-for-route', getTripsForRoute);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers
// development error handler
// will print stacktrace
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
