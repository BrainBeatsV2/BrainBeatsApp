var MidiWriter = require('midi-writer-js')
const fs = require('fs');

const commonNoteGroupings = [1, 2, 3, 4, 6, 8];
const commonNoteDurations = ['4', '8', '8t', '16', '16t', '32'];

function setInstrument(track, instrument_num) {
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument_num }));
    debug_print('Set instrument to track')
    return track;
}

function getMidiString(write) {
    debug_print(write.base64());
    return write.base64()
}

function writeMIDIfile(write) {
    filename = Date.now()
    const buffer = new Buffer.from(write.buildFile());
    debug_print(write.buildFile());
    debug_print(buffer);
    fs.writeFile(filename + '.mid', buffer, function (err) {
        if (err) {
            console.log(err)
            debug_print(err)
            throw err;
        }
    });
    debug_print('MIDI file created')
}

function createIntervalPitchMap(notesNum, notesArray) {
    var intervalPitchMap = new Map();
    for (let i = 0; i < notesNum; i++) {
        intervalPitchMap.set(i, notesArray[i]);
    }
    debug_print('Interval Pitch Map');
    debug_print(intervalPitchMap);
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
    debug_print('note distribution');
    debug_print(distribution);
    return distribution;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createNotes(totalNoteGroupingsDurations, scale, intervalPitchMap) {
    var noteEvents = [];
    var currentPitch = 3;
    // Want: IntervalPitchMap length amount

    for (var i = 0; i < totalNoteGroupingsDurations; i++) {
        // pick a random note grouping and duration and generate that many notes
        var numberOfNotesToGenerate = commonNoteGroupings[Math.floor(Math.random() * commonNoteGroupings.length)];
        debug_print("CommonNoteGroupingsLength :: " + commonNoteGroupings.length);
        var duration = commonNoteDurations[Math.floor(Math.random() * commonNoteDurations.length)];
        debug_print("CommongNoteDurationsLength :: " + commonNoteDurations.length);
        debug_print("numberOfNotesToGenerate :: " + numberOfNotesToGenerate);
        var pitches = [];
        for (var j = 0; j < numberOfNotesToGenerate; j++) {
            var distribution = createNoteDistribution(numberOfNotesToGenerate, currentPitch);
            var randomIndex = Math.floor(Math.random() * 100);
            var nextPitch = distribution[randomIndex];
            pitches.push(nextPitch);
            // currentPitch needs to select from internvalpitchmap 
            // currentPitch = nextPitch;
            debug_print("Interval Pitch Length :: " + (intervalPitchMap.size - 1));
            currentPitch = getRandomInt(0, (intervalPitchMap.size - 1));
        }

        var pitchesAsNotes = [];
        pitches.forEach(pitch => {
            pitchesAsNotes.push(intervalPitchMap.get(pitch));
            debug_print("Interval Pitch Map:: Pitch[" + pitch + "] :: IntervalPitchMap[" + intervalPitchMap.get(pitch) + "]");

        });
        noteEvents.push(new MidiWriter.NoteEvent({ pitch: pitchesAsNotes, duration: duration.toString() }));
    }
    debug_print('note events');
    debug_print(noteEvents);
    return noteEvents;
}

function addNotesToTrack(track, noteEvents) {
    track.addEvent(noteEvents, function (event, index) {
        return { sequential: true };
    });
    debug_print('addnotes to track');
    debug_print(track);
    return track;
}

// Ideally will have further Note options and scales with more features added

function getScaleNotes(selection, scale, minRange, maxRange) {
    var notes = { C: 1, Db: 1.5, D: 2, Eb: 2.5, E: 3, F: 3.5, Gb: 4, G: 4.5, Ab: 5, A: 5.5, Bb: 6, B: 6.5 };
    var major = [1, 1, 0.5, 1, 1, 1, 0.5];
    var minor = [1, 0.5, 1, 1, 0.5, 1, 1];
    var chromatic = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
    var pentatonic = [1, 1, 1.5, 1];
    var singular = [1, 1];
    var scale_to_use = [];
    var usable_notes = [];
    var finalnotes = [];
    var i = 0;
    var j = notes[selection];
    var max_steps = 0;
    switch (scale) {
        case "major":
            scale_to_use = major;
            max_steps = 7;
            break;
        case "minor":
            scale_to_use = minor;
            max_steps = 7;
            break;
        case "chromatic":
            scale_to_use = chromatic;
            max_steps = 12;
            break;
        case "pentatonic":
            scale_to_use = pentatonic;
            max_steps = 5;
            break;
        case "singular":
            scale_to_use = singular;
            max_steps = 1;
            break;
    }

    // Get usable notes within scale
    for (i = 0; i < max_steps; i++) {
        // Ensures that once a note reaches the end of octave it wraps around  
        if (j > 6.5) {
            j = (j - 6);
        }
        usable_notes.push(getKeyByValue(notes, j));
        j = j + scale_to_use[i];
    }
    // Set all available notes within range
    for (i = minRange; i <= maxRange; i++) {
        for (j = 0; j < usable_notes.length; j++) {
            debug_print(usable_notes[j] + i);
            finalnotes.push(usable_notes[j] + i);
        }

    }


    debug_print(finalnotes);
    //pentatonic_notes = ['C4', 'D4', 'E4', 'G4', 'A4']
    return finalnotes;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function debug_print(string) {
    if (DEBUG == true) {
        console.log(string);
    }
    return;
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
