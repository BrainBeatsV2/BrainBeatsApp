var MidiWriter = require('midi-writer-js')
const fs = require('fs');

const commonNoteGroupings = [1, 2, 3, 4, 6, 8];
const commonNoteDurations = ['2', '4', '8', '8t', '16', '16t'];

const DEBUG = false;

// TODO: Are sharps and flats being handled?
// TODO: Mean aggregate of the EEG data

// Note (Scale) = Letter
// Duration (commonNoteDurations)
// Repetition (commonNoteGroupings)
// Pitch (Jumps within octave ranges)
// Loudness 

function musicGenerationDriver(musicGenerationModel, scaleMap, pitchMap, secondsForThisSnapshot) {
    if (musicGenerationModel == 1) {

    }
    // if this model: go through this pipeline: 
    // all pipelines have the build note events from the scale and pitch maps and other things we said in the powerpoint thingie
    // noteEvents -> createNotes
    // addNotesToTrack(track, noteEvents);
}

function setInstrument(track, instrument_num) {
    track.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: instrument_num }));
    debug_print('Set instrument to track')
    return track;
}

function getBeatsPerSec(bpm) {
    return bpm / 60;
}

function getNoteDurationsPerBeatPerSecond(bpm, time_signature) {
    beatsPerSecond = getBeatsPerSec(bpm);
    beatValue = time_signature.split('/')[1];

    var noteDurationsPerBeatPerSecond = [];
    for (var i = 0; i < commonNoteDurations.length; i++) {
        var note = commonNoteDurations[i];
        var beatPerNoteDuration = roundTwoDecimalPoints(beatValue / note);

        // Update these values for triplets:
        if (note == '8t' || note == '16t') {
            note = note.substring(0, note.length - 1);
            beatPerNoteDuration = roundTwoDecimalPoints(beatValue / note * 3);
        }
        var numBeatPerNotePerSecond = roundTwoDecimalPoints(beatPerNoteDuration / beatsPerSecond);
        noteDurationsPerBeatPerSecond.push({
            duration: commonNoteDurations[i],
            beats: beatPerNoteDuration,
            seconds: numBeatPerNotePerSecond,
        });
    }
    return noteDurationsPerBeatPerSecond;
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
    return finalnotes;
}

function getScaleMap(key, scale, minRange, maxRange) {
    var scaleNotes = getScaleNotes(key, scale, minRange, maxRange);

    var scaleMap = new Map();
    for (let i = 0; i < scaleNotes.length; i++) {
        scaleMap.set(i, scaleNotes[i]);
    }
    debug_print('Scale Map');
    debug_print(scaleMap);
    return scaleMap;
}

function getOctaveRangeMap(minRange, maxRange) {
    var octaveRangeMap = new Map();
    let index = 0;
    for (let octave = minRange; octave <= maxRange; octave++) {
        octaveRangeMap.set(index, octave);
        index++;
    }
    debug_print('Octave Range Map');
    debug_print(octaveRangeMap);
    return octaveRangeMap;
}

// TODO: Reorganize this!
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

// TODO: Reorganize this!
function createNotes(totalNoteGroupingsDurations, scaleMap) {
    // totalNoteGroupingsDurations = time;

    var noteEvents = [];
    var currentPitch = 3;
    // Want: scaleMap length amount

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
            debug_print("Scale Map Length :: " + (scaleMap.size - 1));

            currentPitch = getRandomInt(0, (scaleMap.size - 1));
        }

        var pitchesAsNotes = [];
        pitches.forEach(pitch => {

            pitchesAsNotes.push(scaleMap.get(pitch));

            debug_print("Interval Pitch Map:: Pitch[" + pitch + "] :: scaleMap[" + scaleMap.get(pitch) + "]");

        });
        noteEvents.push(new MidiWriter.NoteEvent({ pitch: pitchesAsNotes, duration: duration.toString() }));
    }
    debug_print('note events');
    debug_print(noteEvents);
    return noteEvents;
}

function addNotesToTrack(track, noteEvents) {
    debug_print('Add Notes to track');
    track.addEvent(noteEvents, function (event, index) {
        return { sequential: true };
    });
    debug_print(track);
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

function debug_print(string) {
    if (DEBUG == true) {
        console.log(string);
    }
    return;
}

function roundTwoDecimalPoints(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

module.exports = {
    musicGenerationDriver: musicGenerationDriver,
    setInstrument: setInstrument,
    getScaleNotes: getScaleNotes,
    getScaleMap: getScaleMap,
    getOctaveRangeMap: getOctaveRangeMap,
    createNotes: createNotes,
    addNotesToTrack: addNotesToTrack,
    getMidiString: getMidiString,
    writeMIDIfile: writeMIDIfile,
    getNoteDurationsPerBeatPerSecond: getNoteDurationsPerBeatPerSecond,
    roundTwoDecimalPoints: roundTwoDecimalPoints,
}
