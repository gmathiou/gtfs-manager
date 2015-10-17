var login = require('./login');
var signup = require('./signup');
var mongoDbConnection = require('../db.js');
var ObjectId = require('mongodb').ObjectID;

module.exports = function(passport) {

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        mongoDbConnection(function(pdb) {
            pdb.collection("users", function(err, collection) {
                collection.findOne({
                    '_id': new ObjectId(id)
                }, function(err, user) {
                    done(err, user);
                });
            });
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    //signup(passport);
}