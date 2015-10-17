var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
//the MongoDB connection
var connectionInstance;

module.exports = function(callback) {
  //if already we have a connection, don't connect to database again
  if (connectionInstance) {
    callback(connectionInstance);
    return;
  }

  var db = new Db('gtfsdb', new Server('localhost', 27017), {w:0, auto_reconnect: true});

  db.open(function(error, databaseConnection) {
    databaseConnection.authenticate('gtfs_mainuser', 'gtfsuser', function(err, success) {
      if (error) throw new Error(error);
      connectionInstance = databaseConnection;
      callback(databaseConnection);
    });
  });

};