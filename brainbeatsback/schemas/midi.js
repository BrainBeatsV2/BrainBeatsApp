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
    bpm: {
<<<<<<< HEAD
        type: String,
    },
    timeSignature: {
        type: String,
    },
    scale: {
        type: String,
    },
    key: {
        type: String,
    },
=======
        type: String, 
    }, 
    timeSignature: {
        type: String, 
    }, 
    scale: {
        type: String, 
    }, 
    key: {
        type: String, 
    }, 
>>>>>>> Update MIDI schema and allow fetch public MIDIs
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Midi', Midi, 'midi');
