var LocalStrategy = require('passport-local').Strategy;
var mongoDbConnection = require('../db.js');

module.exports = function(passport) {

    passport.use('login', new LocalStrategy({
            passReqToCallback: true
        },
        function(req, username, password, done) {
            // check in mongo if a user with username exists or not

            mongoDbConnection(function(pdb) {
                pdb.collection("users", function(err, collection) {
                    collection.findOne({
                        'username': username
                    }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err)
                            return done(err);
                        // Username does not exist, log the error and redirect back
                        if (!user) {
                            console.log('User Not Found with username ' + username);
                            return done(null, false, req.flash('message', 'User Not found.'));
                        }

                        if (password != user.password) {
                            console.log('User Found but Password is incorrect');
                            return done(null, false, req.flash('message', 'User exists but password did not match'));
                        }
                        // User exists but wrong password, log the error 
                        // if (!isValidPassword(user, password)) {
                        //     console.log('Invalid Password');
                        //     return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                        // }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    });
                });
            });
        }));
}