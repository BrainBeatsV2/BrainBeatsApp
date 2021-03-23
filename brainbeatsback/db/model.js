const mongoose = require('mongoose')
const Model = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    modelData: {
        type: String,
        required: true,
    }, 
});

module.exports = mongoose.model('Model', Model); 
