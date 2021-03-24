const mongoose = require('mongoose')
const Model = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    modelData: {
        type: String,
        required: true,
    }, 
});

module.exports = mongoose.model('Model', Model, 'model'); 
