var db = connect("mongodb://localhost:27017/main");

db.users.insertOne(
    {
        "name": "harry", 
        "email": "harry@hsauers.net", 
        "id": 123, 
        "password": "fakepass"
    }
);

db.midi.insertOne(
    {
        "id": 123, 
        "user_id": 123, 
        "model_id": 1, 
        "name": "fakepass", 
        "midi_data": "fakedata", 
        "privacy": "datatype?", 
        "notes": "fakenotes"
    }
);

db.model.insertOne(
    {
        "id": 123, 
        "name": "fakepass", 
        "model_data": "fakedata"
    }
);
