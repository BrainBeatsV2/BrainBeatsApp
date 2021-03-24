const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

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
setTimeout(getConnection, 3000);

// import schemas
const User = require('./schemas/user');
const Midi = require('./schemas/midi');
const Model = require('./schemas/model');

app.get('/api', (req, res) => {
    res.send("hello world");
})

app.get('/api/users', (req, res) => {
    var conn = getConnection();
    var db = conn.db;
        
    db.collection("users").find().toArray(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data);
        }
    });
})

/*
    Example: 
        POST localhost:4000/requestreset
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
*/
app.post('/api/requestreset', function(req, res) {
    var body = req.body;

    var email = body.email;

    var conn = getConnection();
    var db = conn.db;

    User.findOne({"email": email}).then(function(doc) {
        if (doc == null) {
            res.status(404).send("Account does not exist.")
        } else {
            res.status(200).send("Please check your email for a password reset link.");

            // generate token
            function genNumber() {
                return Math.round(Math.random()*9);
            }
            var token = genNumber() + "" + genNumber() + "" + genNumber() + "" + genNumber();
            console.log(token);

            console.log(doc);

            // write token to db
            doc.token = token;
            doc.tokenExpires = Date.now() + 86400 * 1000;
            doc.save();

            // send email
            var email_text = "Your password reset token is: " + token;
            sendMail(doc.email, "hsauers@knights.ucf.edu", "Reset your Password", email_text, email_text)
        }   
    });
})

/*
    Example: 
        POST localhost:4000/resetpassword
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "token": "1234", "new_password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
*/
app.post('/api/resetpassword', function(req, res) {
    var body = req.body;
    var email = body.email; 
    var token = body.token;
    var new_password = body.new_password;

    var conn = getConnection();

    User.findOne({"email": email}).then(function(doc) {
        if (doc == null) {
            res.status(404).send("Account does not exist.")
        } else if (doc.token != token) {
            res.status(401).send("Token does not match.");
        } else if (doc.tokenExpires < Date.now()) {
            res.status(401).send("Token expired.");
        } else {
            doc.password = new_password;
            doc.token = "";
            doc.tokenExpires = Date.now();
            doc.save();
            res.status(200).send("Password successfully reset.");
        }
    });
})

// start app
app.listen(PORT, () => console.log("Running on"), PORT);


/* Send Mail functionality - using SendGrid */

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function sendMail(to, from, subject, text, html) {
    var msg = {
        to: to, 
        from: from, 
        subject: subject, 
        text: text, 
        html: html
    }
    sgMail.send(msg).then(() => {
        console.log('Email sent')
    })
    .catch((error) => {
        console.error(error)
    })
}
