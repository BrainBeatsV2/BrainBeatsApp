const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const PORT = 4000;

var mongo_username = process.env.MONGO_USERNAME;
var mongo_password = process.env.MONGO_PASSWORD;
var host = process.env.MONGO_HOSTNAME;
var port = process.env.MONGO_PORT;
var dbName = process.env.MONGO_DB ;

var mongo_uri = 'mongodb://' + mongo_username + ':' + mongo_password + '@' + host + ':' + port + '/' + dbName;

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
        POST localhost:4000/api/requestreset
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
            res.status(404).send("Account does not exist.");
        } else {
            res.status(200).send("Please check your email for a password reset link.");

            // generate token
            function genNumber() {
                return Math.round(Math.random()*9);
            }
            var token = genNumber() + "" + genNumber() + "" + genNumber() + "" + genNumber();

            // write token to db
            doc.token = token;
            doc.tokenExpires = Date.now() + 86400 * 1000;
            doc.save();

            // send email
            var email_text = "Your password reset token is: " + token;
            sendMail(doc.email, "hsauers@knights.ucf.edu", "Reset your Password", email_text, email_text);
        }   
    });
})

/*
    Example: 
        POST localhost:4000/api/resetpassword
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
            res.status(404).send("Account does not exist.");
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

/*
    Example: 
        GET localhost:4000/api/models
        Headers- Content-Type: application/json; charset=utf-8
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
*/
app.get('/api/models', function(req, res) {
    var conn = getConnection();

    Model.find().then(function(doc) {
        if (doc == null) {
            res.status(404).send("No models found.");
        } else {
            var data = []
            doc.forEach(model => data.push(model.name));
            res.status(200).send(data);
        }
    });
})

/*
    Example: 
        GET localhost:4000/api/models/all
        Headers- Content-Type: application/json; charset=utf-8
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
*/
app.get('/api/models/all', function(req, res) {
    var conn = getConnection();

    Model.find().then(function(doc) {
        if (doc == null) {
            res.status(404).send("No models found.");
        } else {
            res.status(200).send(doc);
        }
    });
})

/*
    Example: 
        GET localhost:4000/api/models/MODEL_NAME
        Headers- Content-Type: application/json; charset=utf-8
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
*/
app.get('/api/models/:model_name', function(req, res) {
    var conn = getConnection();

    var model_name = req.params.model_name;

    Model.findOne({"name": model_name}).then(function(doc) {
        if (doc == null) {
            res.status(404).send("Model does not exist.");
        } else {
            res.status(200).send(doc);
        }
    });
})


/*
    Example: 
        GET localhost:4000/api/midis
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
    * Note the user's account info in the body. 
    * 
    * @TODO - this feels bad. I don't like the various nested levels. fix it at some point. 
*/
app.post('/api/midis', async function(req, res) {
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // check credentials
    User.findOne({"email": email}).then(function(doc) {
        if (doc == null || doc.password != password) {
            res.status(401).send("Incorrect account credentials.");
        } else {
            // send all midi data
            Midi.find({"user_email": email}).then(function(doc) {
                res.status(200).send(doc);
            });
        }
    });
})

/*
    Example: 
        GET localhost:4000/api/midis/create
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!", 
                "midi_name": "midi_name1", "midi_data", "12345", 
                "midi_privacy": "private", "midi_notes": "lorem ipsum"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
    * Note the user's account info in the body. 
*/
app.post('/api/midis/create', async function(req, res) {
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // midi-specific vars
    var midi_name = body.midi_name;
    var midi_data = body.midi_data;
    var midi_model_id = body.midi_model_id;
    var midi_privacy = body.midi_privacy;
    var midi_notes = body.midi_notes;

    // validate input
    if (midi_name == null || midi_name == "") {
        res.status(400).send("midi_name missing!")
    }
    if (midi_data == null || midi_data == "") {
        res.status(400).send("midi_data missing!")
    }
    if (midi_model_id == null || midi_model_id == "") {
        res.status(400).send("midi_model_id missing!")
    }
    if (midi_privacy == null || midi_privacy == "") {
        midi_privacy = "private";
    }

    // check credentials
    User.findOne({"email": email}).then(function(doc) {
        if (doc == null || doc.password != password) {
            res.status(401).send("Incorrect account credentials.");
        } else {
            // create new midi
            var newMidi = Midi({
                "user_email": email, 
                "name": midi_name, 
                "midi_data": midi_data, 
                "model_id": midi_model_id, 
                "privacy": midi_privacy, 
                "notes": midi_notes, 
            });

            newMidi.save();
            res.status(200).send({
                "message": "MIDI uploaded successfully!"
            });
        }
    });
})


/*
    Example: 
        GET localhost:4000/api/midis/606e1726f9d7edf2fe715ee6
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
    * User account info not needed if MIDI is public
*/
app.post('/api/midis/:midi_id', async function(req, res) {
    var body = req.body;
    var email = body.email;
    var password = body.password;

    var midi_id = req.params.midi_id;

    // fetch midi
    Midi.findOne({"_id": midi_id}).then(function(midi_doc) {
        if (midi_doc.privacy != "private") {
            // send midi data
            res.status(200).send(midi_doc);
        } else {
            User.findOne({"email": email}).then(function(doc) {
                if (doc == null || doc.password != password || midi_doc.user_email != email) {
                    res.status(401).send("Incorrect account credentials.");
                } else {
                    // send midi data
                    res.status(200).send(midi_doc);
                }
            });
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

/* Authentication functionality @TODO not working */
function checkAuth(email, password) {
    var conn = getConnection();

    User.findOne({"email": email}).then(function(doc) {
        if (doc == null) {
            return false;
        } else if (doc.password != password) {
            return false;
        } else {
            return true;
        }
    });
}