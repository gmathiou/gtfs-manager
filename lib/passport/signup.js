var LocalStrategy = require('passport-local').Strategy;
var mongoDbConnection = require('../db.js');

module.exports = function(passport) {

    passport.use('signup', new LocalStrategy({
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function() {
                // find a user in Mongo with provided username
                mongoDbConnection(function(pdb) {
                    pdb.collection("users", function(err, collection) {
                        collection.findOne({
                            'username': username
                        }, function(err, user) {
                            // In case of any error, return using the done method
                            if (err) {
                                console.log('Error in SignUp: ' + err);
                                return done(err);
                            }
                            // already exists
                            if (user) {
                                console.log('User already exists with username: ' + username);
                                return done(null, false, req.flash('message', 'User Already Exists'));
                            } else {
                                // if there is no user with that email
                                // create the user
                                var newUser = new User();

                                // set the user's local credentials
                                newUser.username = username;
                                newUser.password = password;

                                //TODO: save the user
                            }
                        });
                    });
                });

            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        }));
}