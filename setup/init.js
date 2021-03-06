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
        "name": "NickName1", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAFkwDAAQCQNEAggDRAAJA0QCCANEAAkDlAIIA5QACQOUAggDlAAJA0QCCANEAAkDlAIIA5QACQNEAggDRAAJA5QCCAOUAAkDJAK4AyQACQMkBAgDJAAJAyQECAMkAAkDRAQIA0QACQN0AQgDdAAJA0QBCANEAAkDlAEIA5QACQNEAQgDRAAJA5QBCAOUAAkDdAEIA3QACQOUCBAIA5QACQAECBAIAAQACQMkCBAIAyQACQNEAqgDRAAJA3QCuAN0AAkDdAK4A3QACQN0AqgDdAAJAyQCCAMkAAkDlAIIA5QACQNEBAgDRAAJA5QECAOUAAkABAQIAAQACQNEBAgDRAAJA0QBCANEAAkDJAFoAyQACQMkAVgDJAAJA0QBWANEAAkDJAFoAyQACQOUAVgDlAAJA0QBWANEAAkDJAIIAyQACQAECBAIAAQACQAECBAIAAQACQAECBAIAAQACQMkCBAIAyQACQOUCBAIA5QACQMkCBAIAyQACQMkArgDJAAJAyQCuAMkAAkDlAKoA5QACQN0ArgDdAAJAAQCuAAEAAkABAKoAAQACQNEBAgDRAAJAAQECAAEAAkABAQIAAQACQMkBAgDJAAJA3QECAN0AAkABAQIAAQACQN0AQgDdAAJAyQBCAMkAAkDRAEIA0QACQMkAggDJAAJA5QBaAOUAAkDRAFYA0QACQAEAVgABAAJAyQBaAMkAAkDRAKoA0QACQN0ArgDdAAJA0QBCANEAAkDlAEIA5QACQOUAQgDlAAJAyQIEAgDJAAJAyQBWAMkAAkDJAFoAyQACQAEAVgABAAJAAQBWAAEAAkABAQIAAQACQAEBAgABAAJA0QECANEAAkDlAQIA5QACQNEBAgDRAAJA3QECAN0AAkDRAEIA0QACQMkBAgDJAAJA0QECANEAAkDRAQIA0QACQN0CBAIA3QACQMkCBAIAyQACQAEBAgABAAJAyQBaAMkAAkDRAFYA0QACQMkAVgDJAAJAyQBaAMkAAkDRAQIA0QACQMkBAgDJAAJA3QECAN0AAkDJAQIAyQACQOUBAgDlAAJA3QECAN0AAkDJAIIAyQACQN0AggDdAAJA5QCCAOUAAkDRAIIA0QACQN0AggDdAAJAyQCCAMkAAkDlAIIA5QACQNEAggDRAAJAAQBCAAEAAkDlAEIA5QACQOUAQgDlAAJAyQBCAMkAAkDRAEIA0QACQN0AQgDdAAJA0QBWANEAAkDRAFYA0QACQN0AWgDdAAJAyQBWAMkAAkDJAEIAyQACQMkAQgDJAAJA0QBCANEAAkDdAQIA3QACQMkArgDJAAJA0QCqANEAAkABAgQCAAEAAkDlAgQCAOUAAkABAgQCAAEAAkDdAgQCAN0AAkDJAgQCAMkAAkDRAgQCANEAAkDlAgQCAOUAAkDdAgQCAN0AAkDRAK4A0QACQMEArgDBAAJAwQCqAMEAAkDRAgQCANEAAkDdAgQCAN0AAkDRAgQCANEAAkABAgQCAAEAAkDdAgQCAN0AAkDRAgQCANEAAkDRAgQCANEAAkDJAgQCAMkAAkDJAIIAyQACQAEAggABAAJA0QCCANEAAkDJAIIAyQACQN0AggDdAAJA0QCCANEAAkDdAIIA3QACQN0AggDdAAJA3QCuAN0AAkDJAK4AyQACQN0AqgDdAAJAyQCuAMkAAkABAK4AAQACQN0AqgDdAAJA0QCuANEAAkDlAK4A5QACQNEAggDRAAJAAQCCAAEAAkDdAEIA3QACQNEAQgDRAAJA0QBCANEAAkDJAEIAyQACQMkAQgDJAAJA0QBCANEAAkDJAEIAyQACQNEAQgDRAAJA0QBWANEAAkDRAFYA0QACQMkAWgDJAAJA0QBWANEAAkDdAFYA3QACQNEAWgDRAAJA5QCqAOUAA/y8A", 
        "modelId": "1", 
        "privacy": "public", 
        "notes": "fakenotes"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName1-private", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAFkwDAAQCQNEAggDRAAJA0QCCANEAAkDlAIIA5QACQOUAggDlAAJA0QCCANEAAkDlAIIA5QACQNEAggDRAAJA5QCCAOUAAkDJAK4AyQACQMkBAgDJAAJAyQECAMkAAkDRAQIA0QACQN0AQgDdAAJA0QBCANEAAkDlAEIA5QACQNEAQgDRAAJA5QBCAOUAAkDdAEIA3QACQOUCBAIA5QACQAECBAIAAQACQMkCBAIAyQACQNEAqgDRAAJA3QCuAN0AAkDdAK4A3QACQN0AqgDdAAJAyQCCAMkAAkDlAIIA5QACQNEBAgDRAAJA5QECAOUAAkABAQIAAQACQNEBAgDRAAJA0QBCANEAAkDJAFoAyQACQMkAVgDJAAJA0QBWANEAAkDJAFoAyQACQOUAVgDlAAJA0QBWANEAAkDJAIIAyQACQAECBAIAAQACQAECBAIAAQACQAECBAIAAQACQMkCBAIAyQACQOUCBAIA5QACQMkCBAIAyQACQMkArgDJAAJAyQCuAMkAAkDlAKoA5QACQN0ArgDdAAJAAQCuAAEAAkABAKoAAQACQNEBAgDRAAJAAQECAAEAAkABAQIAAQACQMkBAgDJAAJA3QECAN0AAkABAQIAAQACQN0AQgDdAAJAyQBCAMkAAkDRAEIA0QACQMkAggDJAAJA5QBaAOUAAkDRAFYA0QACQAEAVgABAAJAyQBaAMkAAkDRAKoA0QACQN0ArgDdAAJA0QBCANEAAkDlAEIA5QACQOUAQgDlAAJAyQIEAgDJAAJAyQBWAMkAAkDJAFoAyQACQAEAVgABAAJAAQBWAAEAAkABAQIAAQACQAEBAgABAAJA0QECANEAAkDlAQIA5QACQNEBAgDRAAJA3QECAN0AAkDRAEIA0QACQMkBAgDJAAJA0QECANEAAkDRAQIA0QACQN0CBAIA3QACQMkCBAIAyQACQAEBAgABAAJAyQBaAMkAAkDRAFYA0QACQMkAVgDJAAJAyQBaAMkAAkDRAQIA0QACQMkBAgDJAAJA3QECAN0AAkDJAQIAyQACQOUBAgDlAAJA3QECAN0AAkDJAIIAyQACQN0AggDdAAJA5QCCAOUAAkDRAIIA0QACQN0AggDdAAJAyQCCAMkAAkDlAIIA5QACQNEAggDRAAJAAQBCAAEAAkDlAEIA5QACQOUAQgDlAAJAyQBCAMkAAkDRAEIA0QACQN0AQgDdAAJA0QBWANEAAkDRAFYA0QACQN0AWgDdAAJAyQBWAMkAAkDJAEIAyQACQMkAQgDJAAJA0QBCANEAAkDdAQIA3QACQMkArgDJAAJA0QCqANEAAkABAgQCAAEAAkDlAgQCAOUAAkABAgQCAAEAAkDdAgQCAN0AAkDJAgQCAMkAAkDRAgQCANEAAkDlAgQCAOUAAkDdAgQCAN0AAkDRAK4A0QACQMEArgDBAAJAwQCqAMEAAkDRAgQCANEAAkDdAgQCAN0AAkDRAgQCANEAAkABAgQCAAEAAkDdAgQCAN0AAkDRAgQCANEAAkDRAgQCANEAAkDJAgQCAMkAAkDJAIIAyQACQAEAggABAAJA0QCCANEAAkDJAIIAyQACQN0AggDdAAJA0QCCANEAAkDdAIIA3QACQN0AggDdAAJA3QCuAN0AAkDJAK4AyQACQN0AqgDdAAJAyQCuAMkAAkABAK4AAQACQN0AqgDdAAJA0QCuANEAAkDlAK4A5QACQNEAggDRAAJAAQCCAAEAAkDdAEIA3QACQNEAQgDRAAJA0QBCANEAAkDJAEIAyQACQMkAQgDJAAJA0QBCANEAAkDJAEIAyQACQNEAQgDRAAJA0QBWANEAAkDRAFYA0QACQMkAWgDJAAJA0QBWANEAAkDdAFYA3QACQNEAWgDRAAJA5QCqAOUAA/y8A", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName2", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAyADAAQCQMkAggDJAAJA3QCCAN0AAkDRAIIA0QACQNEAQgDRAAJA0QBCANEAAkDJAK4AyQACQNEAqgDRAAJA5QCuAOUAAkABAK4AAQACQNEAqgDRAAJAAQCuAAEAAkABAgQCAAEAAkDlAFYA5QACQAEAWgABAAJA3QBWAN0AAkDRAFYA0QACQNEAWgDRAAJA0QBWANEAAkDJAIIAyQACQAEAggABAAJA0QCCANEAAkDdAIIA3QACQN0ArgDdAAJAAQCqAAEAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Major"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName3", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Major"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName4", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Major"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName5", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Major"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName6", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Minor"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName7", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Major"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName8", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Pentatonic"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName9", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Minor"
    }
);

db.midi.insertOne(
    {
        "username": "harry@hsauers.net", 
        "name": "NickName10", 
        "midiData": "TVRoZAAAAAYAAAABAIBNVHJrAAAAtwDAAQCQAEAggABAAJA0QCCANEAAkDRAIIA0QACQAEAggABAAJA5QCCAOUAAkDlAIIA5QACQN0AggDdAAJA0QCCANEAAkDRAQIA0QACQN0BAgDdAAJA3QECAN0AAkDJAQIAyQACQNEBAgDRAAJA0QECANEAAkABAQIAAQACQMkBAgDJAAJA0QECANEAAkDJAQIAyQACQAEBAgABAAJAyQECAMkAAkDRAEIA0QACQMEArgDBAAP8vAA", 
        "modelId": "1", 
        "privacy": "private", 
        "notes": "fakenotes", 
        "bpm": "60", 
        "timeSignature": "4/4", 
        "scale": "Bb", 
        "key": "Chromatic"
    }
);

db.model.insertOne(
    {
        "name": "fakepass", 
        "model_data": "fakedata"
    }
);
