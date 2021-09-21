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
        "name": "fakepass", 
        "midiData": "fakedata", 
        "modelId": "1", 
        "privacy": "datatype?", 
        "notes": "fakenotes"
    }
);

db.model.insertOne(
    {
        "name": "fakepass", 
        "model_data": "fakedata"
    }
);
