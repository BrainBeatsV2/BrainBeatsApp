const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const PORT = 4000

dotenv.config()

mongoose.connect('mongodb://<MONGO_USERNAME>:<MONGO_PASSWORD>@<MONGO_HOSTNAME>:<MONGO_PORT>/<MONGO_DB>', () =>console.log("DB Connected Successfully"));

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(PORT, () => console.log("Running on"), PORT);
