var MidiWriter = require('midi-writer-js')
const fs = require('fs');

const commonNoteGroupings = [1, 2, 3, 4, 6, 8];
const commonNoteDurations = ['4', '8', '8t', '16', '16t', '32'];

function setInstrument(track, instrument_num) {
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument_num }));
    console.log('Set instrument to track')
    return track;
}

function getMidiString(write) {
    console.log(write.base64());
    return write.base64()
}

function writeMIDIfile(write) {
    filename = Date.now()
    const buffer = new Buffer.from(write.buildFile());
    fs.writeFile(filename + '.mid', buffer, function (err) {
        if (err) {
            console.log(err)
            throw err;
        }
    });
    console.log('MIDI file created')
}

function createIntervalPitchMap(notesNum, notesArray) {
    var intervalPitchMap = new Map();
    for (let i = 0; i < notesNum; i++) {
        intervalPitchMap.set(i, notesArray[i]);
    }
    console.log('Interval Pitch Map');
    console.log(intervalPitchMap);
    return intervalPitchMap;
}

let createNoteDistribution = (numberOfNotesToGenerate, currentPitch) => {
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
    console.log('note distribution');
    console.log(distribution);
    return distribution;
}

function createNotes(totalNoteGroupingsDurations) {
    var noteEvents = [];
    var currentPitch = 3;
    for (var i = 0; i < totalNoteGroupingsDurations; i++) {
        // pick a random note grouping and duration and generate that many notes
        var numberOfNotesToGenerate = commonNoteGroupings[Math.floor(Math.random() * commonNoteGroupings.length)];
        var duration = commonNoteDurations[Math.floor(Math.random() * commonNoteDurations.length)];
        var pitches = [];
        for (var j = 0; j < numberOfNotesToGenerate; j++) {
            var distribution = createNoteDistribution(numberOfNotesToGenerate, currentPitch);
            var randomIndex = Math.floor(Math.random() * 100);
            var nextPitch = distribution[randomIndex];
            pitches.push(nextPitch);
            currentPitch = nextPitch;
        }

        var pitchesAsNotes = [];
        pitches.forEach(pitch => {
            pitchesAsNotes.push(intervalPitchMap.get(pitch));
        });
        noteEvents.push(new MidiWriter.NoteEvent({ pitch: pitchesAsNotes, duration: duration.toString() }));
    }
    console.log('note events');
    console.log(noteEvents);
    return noteEvents;
}

function addNotesToTrack(track, noteEvents) {
    track.addEvent(noteEvents, function (event, index) {
        return { sequential: true };
    });
    console.log('addnotes to track');
    console.log(track);
    return track;
}

// Ideally will have further Note options and scales with more features added
function getScaleNotes(selection) {
    pentatonic_notes = ['C4', 'D4', 'E4', 'G4', 'A4']
    return pentatonic_notes;
}

module.exports = {
    setInstrument: setInstrument,
    getScaleNotes: getScaleNotes,
    createIntervalPitchMap: createIntervalPitchMap,
    createNotes: createNotes,
    addNotesToTrack: addNotesToTrack,
    getMidiString: getMidiString,
    writeMIDIfile: writeMIDIfile,
}
