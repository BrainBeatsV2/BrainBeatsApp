const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 4000;

var username = process.env.MONGO_USERNAME;
var password = process.env.MONGO_PASSWORD;
var host = process.env.MONGO_HOSTNAME;
var port = process.env.MONGO_PORT;
var dbName = process.env.MONGO_DB ;

var mongo_uri = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + dbName;

function getConnection() {
    mongoose.connect(mongo_uri, { useNewUrlParser: true });
    var conn =  mongoose.connection;
    return conn;
}

app.get('/', (req, res) => {
    res.send("hello world");
})

app.get('/db', (req, res) => {
    var conn = getConnection();
    var db = conn.db;
    
    var users = db.collection("users").find().toArray();
    
    db.collection("users").find().toArray(function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
        res.send(data);
      }
    });
    
})

app.listen(PORT, () => console.log("Running on"), PORT);
