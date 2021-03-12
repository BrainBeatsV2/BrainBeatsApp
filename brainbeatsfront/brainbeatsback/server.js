const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const PORT = 4000

dotenv.config()

mongoose.connect(process.env.DATABASE_ACCESS, () =>console.log("Database connected"))

app.get('/', (req, res) => {
    res.send("hello world")
})

app.listen(PORT, () => console.log("Running on"), PORT)