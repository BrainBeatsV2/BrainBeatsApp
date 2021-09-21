var MidiWriter = require('midi-writer-js')
const fs = require('fs');

const commonNoteGroupings = [1, 2, 3, 4, 6, 8];
const commonNoteDurations = ['4', '8', '8t', '16', '16t', '32'];
var track
var write

function startMIDITrack() {
    track = new MidiWriter.Track();
    console.log('Midi track created.');
}

function endMIDITrack() {
    track = null;
    console.log('Midi track nulled.')
}

function startMIDIWriter() {
    write = new MidiWriter.Writer(track);
    console.log('MidiWriter created')
}

function endMIDIWriter() {
    write = null;
    console.log('MidiWriter nullified.')
}

function setInstrument(instrument_num) {
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument_num }));
}

function getDataURI() {
    midiDataURI = write.dataUri()
    console.log(midiDataURI)
    console.log('Get data URI');
}

function writeMIDIfile() {
    filename = Date.now()
    const buffer = new Buffer.from(write.buildFile());
    fs.writeFile(filename + '.mid', buffer, function (err) {
        if (err) throw err;
    });
    console.log('MIDI file created')
}

function parseEEGData(eeg_data) {
    console.log("In generate Midi")
    // delta = incoming_data.delta
    // theta = incoming_data.theta
    // alpha = incoming_data.alpha
    // beta = incoming_data.beta
    // gamma = incoming_data.gamma
}

function createIntervalPitchMap(notesNum, notesArray) {
    var intervalPitchMap = new Map();
    for (let i = 0; i < notesNum; i++) {
        intervalPitchMap.set(i, notesArray[i]);
    }
    return intervalPitchMap;
}


let createNoteDistribution = (currentPitch) => {
    for (var j = 0; j < numberOfNotesToGenerate; j++) {
        distribution = [];
        // most common pitches will be one note up or one note down
        // Change current pitch by one
        for (var k = 0; k < 25; k++) {
            if (currentPitch > 1) {
                distribution.push(currentPitch - 1);
            } else {
                distribution.push(currentPitch + 1);
            }
        }

        for (var k = 0; k < 25; k++) {
            if (currentPitch < 5) {
                distribution.push(currentPitch + 1);
            } else {
                distribution.push(currentPitch - 1);
            }
        }
        // Change current pitch by 2
        for (var k = 0; k < 15; k++) {
            if (currentPitch < 4) {
                distribution.push(currentPitch + 2);
            } else {
                distribution.push(currentPitch - 2);
            }
        }

        for (var k = 0; k < 15; k++) {
            if (currentPitch > 2) {
                distribution.push(currentPitch - 2);
            } else {
                distribution.push(currentPitch + 2);
            }
        }

        // staying on the same note is also possible
        // Keep the same pitch
        for (var k = 0; k < 20; k++) {
            distribution.push(currentPitch);
        }
    }
    return distribution;
}


function addNotesToTrack(noteEvents) {
    track.addEvent(noteEvents, function (event, index) {
        return { sequential: true };
    });
}

function createNotes() {
    var noteEvents = [];
    var currentPitch = 3;
    for (var i = 0; i < duration; i++) {
        // pick a random note grouping and duration and generate that many notes
        var numberOfNotesToGenerate = commonNoteGroupings[Math.floor(Math.random() * commonNoteGroupings.length)];
        var duration = commonNoteDurations[Math.floor(Math.random() * commonNoteDurations.length)];
        var pitches = [];
        for (var j = 0; j < numberOfNotesToGenerate; j++) {
            var distribution = createNoteDistribution(currentPitch);
            var randomIndex = Math.floor(Math.random() * 100);
            var nextPitch = distribution[randomIndex];
            pitches.push(nextPitch);
            currentPitch = nextPitch;
        }

        var pitchesAsNotes = [];
        pitches.forEach(pitch => {
            // console.log(pitch);
            pitchesAsNotes.push(intervalPitchMap.get(pitch));
        });
        noteEvents.push(new MidiWriter.NoteEvent({ pitch: pitchesAsNotes, duration: duration.toString() }));
    }
    return noteEvents;
}

function generateMidi(eeg_data, duration) {


    startMIDITrack();
    setInstrument(1);

    pentatonic_notes = ['C4', 'D4', 'E4', 'G4', 'A4']
    intervalPitchMap = createIntervalPitchMap(5, pentatonic_notes)

    noteEvents = createNotes();
    addNotesToTrack(noteEvents);

    startMIDIWriter();
    getDataURI();
    writeMIDIfile();
    endMIDIWriter();
    endMIDITrack();
}

module.exports = {
    generateMidi: generateMidi,
    startMIDITrack: startMIDITrack,
    endMIDITrack: endMIDITrack
}



// function generateMidi(eeg_data, duration) {
//     console.log("In generate Midi")
//     // delta = incoming_data.delta
//     // theta = incoming_data.theta
//     // alpha = incoming_data.alpha
//     // beta = incoming_data.beta
//     // gamma = incoming_data.gamma

//     // Start with a new track
//     var track = new MidiWriter.Track();

//     // Define an instrument (optional):
//     track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));

//     var intervalPitchMap = new Map();
//     intervalPitchMap.set(1, 'C4');
//     intervalPitchMap.set(2, 'D4');
//     intervalPitchMap.set(3, 'E4');
//     intervalPitchMap.set(4, 'G4');
//     intervalPitchMap.set(5, 'A4');

//     var noteGroupings = [1, 2, 3, 4, 6, 8];
//     var durations = ['4', '8', '8t', '16', '16t', '32'];

//     let buildDistribution = (currentPitch) => {
//         for (var j = 0; j < numberOfNotesToGenerate; j++) {
//             distribution = [];
//             // most common pitches will be one note up or one note down
//             for (var k = 0; k < 25; k++) {
//                 if (currentPitch > 1) {
//                     distribution.push(currentPitch - 1);
//                 } else {
//                     distribution.push(currentPitch + 1);
//                 }
//             }

//             for (var k = 0; k < 25; k++) {
//                 if (currentPitch < 5) {
//                     distribution.push(currentPitch + 1);
//                 } else {
//                     distribution.push(currentPitch - 1);
//                 }
//             }
//             // skips will be slightly less common
//             for (var k = 0; k < 15; k++) {
//                 if (currentPitch < 4) {
//                     distribution.push(currentPitch + 2);
//                 } else {
//                     distribution.push(currentPitch - 2);
//                 }
//             }

//             for (var k = 0; k < 15; k++) {
//                 if (currentPitch > 2) {
//                     distribution.push(currentPitch - 2);
//                 } else {
//                     distribution.push(currentPitch + 2);
//                 }
//             }

//             // staying on the same note is also possible
//             for (var k = 0; k < 20; k++) {
//                 distribution.push(currentPitch);
//             }
//         }
//         return distribution;
//     }

//     var noteEvents = [];

//     var currentPitch = 3;
//     for (var i = 0; i < duration; i++) {
//         // pick a random note grouping and duration and generate that many notes
//         var numberOfNotesToGenerate = noteGroupings[Math.floor(Math.random() * noteGroupings.length)];
//         var duration = durations[Math.floor(Math.random() * durations.length)];
//         // console.log(duration.toString());
//         var pitches = [];
//         for (var j = 0; j < numberOfNotesToGenerate; j++) {
//             var distribution = buildDistribution(currentPitch);
//             var randomIndex = Math.floor(Math.random() * 100);
//             var nextPitch = distribution[randomIndex];
//             pitches.push(nextPitch);
//             currentPitch = nextPitch;
//         }

//         var pitchesAsNotes = [];
//         pitches.forEach(pitch => {
//             // console.log(pitch);
//             pitchesAsNotes.push(intervalPitchMap.get(pitch));
//         });
//         noteEvents.push(new MidiWriter.NoteEvent({ pitch: pitchesAsNotes, duration: duration.toString() }));
//     }

//     // Add some notes:
//     track.addEvent(noteEvents, function (event, index) {
//         return { sequential: true };
//     });

//     // Generate a data URI
//     var write = new MidiWriter.Writer(track);
//     console.log(write.dataUri());

//     filename = Date.now()
//     const buffer = new Buffer.from(write.buildFile());
//     fs.writeFile(filename + '.mid', buffer, function (err) {
//         if (err) throw err;
//     });

// }

// module.exports = {
//     generateMidi: generateMidi,
// }