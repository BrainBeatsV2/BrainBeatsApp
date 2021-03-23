const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 4000;

var username = process.env.MONGO_USERNAME;
var password = process.env.MONGO_PASSWORD;
var host = process.env.MONGO_HOSTNAME;
var port = process.env.MONGO_PORT;
var db = process.env.MONGO_DB ;

var mongo_uri = 'mongodb://' + username + ':' + password + '@' + host + ':' + port + '/' + db;

var db;
function connectToDB() {
    mongoose.connect(mongo_uri, { useNewUrlParser: true });
    db =  mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

setTimeout(connectToDB, 5000);

app.get('/', (req, res) => {
    res.send("hello world");
})

app.get('/db', (req, res) => {
    var users = db.collection("users").find({}).toArray();
    var midi = db.collection("midi").find({}).toArray();
    var model = db.collection("model").find({}).toArray();

    var data = {
        "users": users, 
        "midi": midi, 
        "model": model,
    }

    res.send(data);
})

app.listen(PORT, () => console.log("Running on"), PORT);
