var db = connect("mongodb://localhost:27017/main");

db.createUser(
    {
        "user": "root", 
        "pwd": "toor", 
        "roles": [
            {
                "role": "readWrite", 
                "db": "main"
            }
        ], 
    }
);

db.users.insertOne(
    {
        "firstName": "harry", 
        "lastName": "sauers", 
        "email": "harry@hsauers.net", 
        "username": "hsauers", 
        "password": "fakepass", 
        "favoritesList": [], 
        "createdAt": new Date("2016-05-18T16:00:00Z")
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "Midi Name", 
        "midiData": "fakedata", 
        "modelId": "1", 
        "privacy": "public", 
        "notes": "fakenotes"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName1", 
        "midiData": "fakedata", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName2", 
        "midiData": "fakedata", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Bb"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName3", 
        "midiData": "fakedata", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Bb"
    }
);

db.model.insertOne(
    {
        "name": "fakepass", 
        "model_data": "fakedata"
    }
);
