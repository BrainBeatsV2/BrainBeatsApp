const mongoose = require('mongoose')
const Midi = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    modelId: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    midiData: {
        type: String,
        required: true,
    },
    privacy: {
        type: String,
        required: true, 
    },
    notes: {
        type: String, 
    }, 
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Midi', Midi, 'midi'); 
