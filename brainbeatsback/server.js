const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

const Timidity = require('timidity')

const PORT = 4000;

var mongo_username = process.env.MONGO_USERNAME;
var mongo_password = process.env.MONGO_PASSWORD;
var host = process.env.MONGO_HOSTNAME;
var port = process.env.MONGO_PORT;
var dbName = process.env.MONGO_DB;

var mongo_uri = 'mongodb://' + mongo_username + ':' + mongo_password + '@' + host + ':' + port + '/' + dbName;
var devPath = 'http://localhost:4000'; //For testing and development on electron, remove paramater for production

function getConnection() {
    mongoose.connect(mongo_uri, { useNewUrlParser: true });
    var conn = mongoose.connection;
    return conn;
}
setTimeout(getConnection, 3000);

// import schemas
const User = require('./schemas/user');
const Midi = require('./schemas/midi');
const Model = require('./schemas/model');

app.get(devPath + '/api', (req, res) => {
    res.send("hello world");
})

app.get(devPath + '/api/users', (req, res) => {
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
app.post(devPath + '/api/requestreset', function (req, res) {
    var body = req.body;

    var email = body.email;

    var conn = getConnection();
    var db = conn.db;

    User.findOne({ "email": email }).then(function (doc) {
        if (doc == null) {
            res.status(404).send("Account does not exist.");
        } else {
            res.status(200).send("Please check your email for a password reset token.");

            // generate token
            function genNumber() {
                return Math.round(Math.random() * 9);
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
app.post(devPath + '/api/resetpassword', function (req, res) {
    var body = req.body;
    var email = body.email;
    var token = body.token;
    var new_password = body.new_password;

    var conn = getConnection();

    User.findOne({ "email": email }).then(function (doc) {
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
    Validates user's username and password
    Will likely return a JWT token depending on which authorization route we go
*/
app.post(devPath + '/api/login', function (req, res) {
    var body = req.body;
    var username = body.username;
    var password = body.password;

    var conn = getConnection();

    User.findOne({ "username": username }).then(function (doc) {
        if (doc == null) {
            User.findOne({ "email": username }).then(function (doc) {
                if (doc == null) {
                    res.status(400).send("Invalid username or password");
                } else if (doc.password != password) {
                    res.status(400).send("Invalid username or password");
                }
                else if (doc.password == password) {
                    res.status(200).send("login successful");
                }
            });
        }
        else if (doc.password != password) {
            res.status(400).send("Invalid username or password");
        }
        else if (doc.password == password) {
            res.status(200).send("login successful");
        }
    });
});

/*
    Checks if username or email are already registered to another user if not saves
    information for new user
*/
app.post(devPath + '/api/register', function (req, res) {
    var conn = getConnection();
    var body = req.body;
    var email = body.email;
    var username = body.username;
    var password = body.password;

    // First checks if Username or Email is already being used then saves as new user
    User.findOne({
        $or: [{
            "email": email
        }, {
            "username": username
        }]
    }).then(user => {
        if (user) {
            let errors = {};
            if (user.username === username) {
                errors.username = "Username taken";
            } else {
                errors.email = "Email already in use";
            }
            // mongoose validation error
            return res.status(400).json(errors);
        } else {
            const postUser = new User({
                "username": username,
                "email": email,
                "password": password,
            });
            res.status(200).send("Successful Register");
            postUser.save();
            return res.status(200).json("Successful Register");
        }
    })
        .catch(err => {
            // Default 500 server error
            return res.status(500).json({
                error: err
            });
        });

});

/*
    Example:
        GET localhost:4000/api/models
        Headers- Content-Type: application/json; charset=utf-8
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work.
*/
app.get(devPath + '/api/models', function (req, res) {
    var conn = getConnection();

    Model.find().then(function (doc) {
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
app.get(devPath + '/api/models/all', function (req, res) {
    var conn = getConnection();

    Model.find().then(function (doc) {
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
app.get(devPath + '/api/models/:model_name', function (req, res) {
    var conn = getConnection();

    var model_name = req.params.model_name;

    Model.findOne({ "name": model_name }).then(function (doc) {
        if (doc == null) {
            res.status(404).send("Model does not exist.");
        } else {
            res.status(200).send(doc);
        }
    });
})

/*
    Example:
        POST localhost:4000/api/midis/public?skip=0&limit=100
        Headers- Content-Type: application/json; charset=utf-8
        Response- 200 OK
*/
<<<<<<< HEAD
<<<<<<< HEAD

app.get('/api/midis/public', async function (req, res) {
    // send public midi data
    var skip = 0;
    var limit = 0;

    if (req.params.skip) {
        skip = req.params.skip;
    }

    if (req.params.limit) {
        limit = req.params.limit;
    }

    Midi.find({ "privacy": "public" }).skip(skip).limit(limit).then(function (doc) {
        res.status(200).send(doc);
    });
})
=======
=======
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa
app.get('/api/midis/public', async function(req, res) {
    // send public midi data
    var skip = 0;
    var limit = 0;
    
    if (req.params.skip) {
        skip = req.params.skip;
    }
    
    if (req.params.limit) {
        limit = req.params.limit;
    }
    
    Midi.find({"privacy":"public"}).skip(skip).limit(limit).then(function(doc) {
        res.status(200).send(doc);
    });
})

<<<<<<< HEAD
>>>>>>> Update MIDI schema and allow fetch public MIDIs
=======
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa

/*
    Example:
        POST localhost:4000/api/midis/mine
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work.
    * Note the user's account info in the body.
*/
<<<<<<< HEAD
<<<<<<< HEAD
app.post(devPath + '/api/midis/mine', async function (req, res) {
=======
app.post('/api/midis/mine', async function(req, res) {
>>>>>>> Update MIDI schema and allow fetch public MIDIs
=======
app.post(devPath + '/api/midis/mine', async function(req, res) {
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // check credentials
    User.findOne({ "email": email }).then(function (doc) {
        if (doc == null || doc.password != password) {
            res.status(401).send("Incorrect account credentials.");
        } else {
            // send all midi data
            Midi.find({ "username": email }).then(function (doc) {
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
                "midi_privacy": "private", "midi_notes": "lorem ipsum"
                "midi_bpm": "123" }
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work.
    * Note the user's account info in the body.
*/
app.post(devPath + '/api/midis/create', async function (req, res) {
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // midi-specific vars
    var midi_name = body.midi_name;
    var midi_data = body.midi_data;
    var midi_model_id = body.midi_model_id;
    var midi_privacy = body.midi_privacy;
    var midi_notes = body.midi_notes;
    var midi_bpm = body.midi_bpm;
    var midi_time_signature = body.midi_time_signature;
<<<<<<< HEAD
<<<<<<< HEAD
    var midi_scale = body.midi_scale;
    var midi_key = body.midi_key;
=======
    var midi_scale = body.midi_scale; 
    var midi_key = body.midi_key; 
>>>>>>> Update API endpoints
=======
    var midi_scale = body.midi_scale; 
    var midi_key = body.midi_key; 
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa

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
    User.findOne({ "email": email }).then(function (doc) {
        if (doc == null) {
            res.status(401).send("Incorrect account username.");
        } else if (doc.password != password) {
            res.status(401).send("Incorrect account password.");
        } else {
            // create new midi
            var newMidi = Midi({
                "username": email,
                "modelId": midi_model_id,
                "name": midi_name,
                "midiData": midi_data,
                "privacy": midi_privacy,
                "notes": midi_notes,
<<<<<<< HEAD
                "bpm": midi_bpm,
                "timeSignature": midi_time_signature,
=======
                "bpm": midi_bpm, 
                "timeSignature": midi_time_signature, 
<<<<<<< HEAD
>>>>>>> Update API endpoints
=======
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa
                "scale": midi_scale,
                "key": midi_key
            });

            newMidi.save();
            res.status(200).send({
                "message": "MIDI uploaded successfully!",
                "id": newMidi._id
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
app.post(devPath + '/api/midis/:midi_id', async function (req, res) {
    var midi_id = req.params.midi_id;

    // fetch midi
    Midi.findOne({ "_id": midi_id }).then(function (midi_doc) {
        if (midi_doc.privacy != "private") {
            // send midi data
            res.status(200).send(midi_doc);
        } else {
            var body = req.body;
            var email = body.email;
            var password = body.password;

            User.findOne({ "email": email }).then(function (doc) {
                if (doc == null || doc.password != password || midi_doc.username != email) {
                    res.status(401).send("Incorrect account credentials.");
                } else {
                    // send midi data
                    res.status(200).send(midi_doc);
                }
            });
        }

    });
})


/*
    Download of raw MIDI file
    Example: 
        GET localhost:4000/download/midi/606e1726f9d7edf2fe715ee6
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
    * User account info not needed if MIDI is public
*/
app.post(devPath + '/download/midi/:midi_id', async function (req, res) {
    var midi_id = req.params.midi_id;

    // fetch midi
    Midi.findOne({ "_id": midi_id }).then(function (midi_doc) {
        if (midi_doc.privacy != "private") {
            // send midi data
            res.status(200).send(midi_doc['midiData']);
        } else {
            var body = req.body;
            var email = body.email;
            var password = body.password;

            User.findOne({ "email": email }).then(function (doc) {
                if (doc == null || doc.password != password || midi_doc.username != email) {
                    res.status(401).send("Incorrect account credentials.");
                } else {
                    // send midi data
                    res.status(200).send(midi_doc['midiData']);
                }
            });
        }

    });
})

/*
    Download of raw MIDI file
    Example: 
        GET localhost:4000/download/midi/606e1726f9d7edf2fe715ee6
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
    * You MUST supply the exact Content-Type above, or it won't work. 
    * User account info not needed if MIDI is public
*/
app.get(devPath + '/download/midi/:midi_id', async function (req, res) {
    var midi_id = req.params.midi_id;

    // fetch midi
    Midi.findOne({ "_id": midi_id }).then(function (midi_doc) {
        if (midi_doc.privacy != "private") {
            // send midi data
            res.status(200).send(midi_doc['midiData']);
        } else {
            res.status(401).send("Unauthorized.");
        }

    });
})


/*
    Update MIDI file
    Example: 
        GET localhost:4000/api/midis/606e1726f9d7edf2fe715ee6/update
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
*/
app.post(devPath + '/api/midis/:midi_id/update', async function (req, res) {
    var midi_id = req.params.midi_id;
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // midi-specific vars
    var midi_name = body.midi_name;
    var midi_privacy = body.midi_privacy;
    var midi_notes = body.midi_notes;

    // check credentials
    User.findOne({ "email": email }).then(function (doc) {
        if (doc == null) {
            res.status(401).send("Incorrect account username.");
        } else if (doc.password != password) {
            res.status(401).send("Incorrect account password.");
        } else {
            // update midi
            var newMidiValues = {};

            if (midi_name != null) {
                newMidiValues["name"] = midi_name;
            }
            if (midi_privacy != null) {
                newMidiValues["privacy"] = midi_privacy;
            }
            if (midi_notes != null) {
                newMidiValues["notes"] = midi_notes;
            }

            Midi.updateOne({ "_id": midi_id }, newMidiValues).then(function (err) {
                if (err.ok != 1) {
                    res.status(400).send("bad request");
                } else {
                    res.status(200).send({
                        "message": "MIDI updated successfully!",
                        "id": midi_id
                    });
                }
            });
        }
    });
});

/*
    Delete MIDI file
    Example: 
        GET localhost:4000/api/midis/606e1726f9d7edf2fe715ee6/delete
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
*/
app.post('/api/midis/:midi_id/delete', async function (req, res) {
    var midi_id = req.params.midi_id;
    var body = req.body;
    var email = body.email;
    var password = body.password;

<<<<<<< HEAD
    // check credentials
    User.findOne({ "email": email }).then(function (doc) {
=======
/*
    Delete MIDI file
    Example: 
        GET localhost:4000/api/midis/606e1726f9d7edf2fe715ee6/delete
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
*/
app.post('/api/midis/:midi_id/delete', async function(req, res) {
    var midi_id = req.params.midi_id;
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // check credentials
    User.findOne({"email": email}).then(function(doc) {
>>>>>>> Update MIDI schema and allow fetch public MIDIs
        if (doc == null) {
            res.status(401).send("Incorrect account username.");
        } else if (doc.password != password) {
            res.status(401).send("Incorrect account password.");
        } else {
<<<<<<< HEAD

            Midi.deleteOne({ "_id": midi_id },).then(function (err) {
=======
            
            Midi.deleteOne({"_id": midi_id},).then(function(err) {
>>>>>>> Update MIDI schema and allow fetch public MIDIs
                if (err.ok != 1) {
                    res.status(400).send("bad request");
                } else {
                    res.status(200).send({
                        "message": "MIDI deleted successfully!",
                        "id": midi_id
                    });
                }
<<<<<<< HEAD
            });
        }
    });
});
=======
              });
        }
    });
});


/*
    Delete MIDI file
    Example: 
        GET localhost:4000/api/midis/606e1726f9d7edf2fe715ee6/delete
        Headers- Content-Type: application/json; charset=utf-8
        Body- {"email": "harry@hsauers.net", "password": "Passwd123!"}
        Response- 200 OK
*/
app.post('/api/midis/:midi_id/delete', async function(req, res) {
    var midi_id = req.params.midi_id;
    var body = req.body;
    var email = body.email;
    var password = body.password;

    // check credentials
    User.findOne({"email": email}).then(function(doc) {
        if (doc == null) {
            res.status(401).send("Incorrect account username.");
        } else if (doc.password != password) {
            res.status(401).send("Incorrect account password.");
        } else {
            
            Midi.deleteOne({"_id": midi_id},).then(function(err) {
                if (err.ok != 1) {
                    res.status(400).send("bad request");
                } else {
                    res.status(200).send({
                        "message": "MIDI deleted successfully!",
                        "id": midi_id
                    });
                }
              });
        }
    });
});






>>>>>>> Update MIDI schema and allow fetch public MIDIs




// start app
app.listen(PORT, () => console.log("Running on"), PORT);


<<<<<<< HEAD
=======




/* Send Mail functionality - using SendGrid */
>>>>>>> ffacb92233c820f77340da3921666607fcaa48aa




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

    User.findOne({ "email": email }).then(function (doc) {
        if (doc == null) {
            return false;
        } else if (doc.password != password) {
            return false;
        } else {
            return true;
        }
    });
}
