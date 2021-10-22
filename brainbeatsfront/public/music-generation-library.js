var MidiWriter = require('midi-writer-js')
const fs = require('fs');

const brainwaves = ['delta', 'theta', 'alpha', 'beta', 'gamma'];
const commonNoteGroupings = [1, 2, 3, 4, 6, 8]; // These are hardcoded values pls don't change
const commonNoteDurations = ['2', '4', '8', '8t', '16', '16t'];  // These are hardcoded values pls don't change

const DEBUG = false;

// TODO: Are sharps and flats being handled?
// TODO: Mean aggregate of the EEG data

function musicGenerationDriver(musicGenerationModel, scaleNoteArray, octaveArray, eegDataPoint, noteDurationsPerBeatPerSecond, secondsPerEEGSnapShot) {
    track = new MidiWriter.Track();

    if (musicGenerationModel == 1) {
        track = mapAggregateBandPowerToRandomProbability(track, scaleNoteArray, octaveArray, eegDataPoint, noteDurationsPerBeatPerSecond, secondsPerEEGSnapShot);
    } else {
        noteEvents = createNotes(secondsForThisSnapshot, scaleMap);
        track = addNotesToTrack(track, noteEvents);
    }

    return track;
}

// TODO: Should this handle loudness?
function mapAggregateBandPowerToRandomProbability(track, scaleNoteArray, octaveArray, eegDataPoint, noteDurationsPerBeatPerSecond, secondsPerEEGSnapShot) {

    // 1. Calculate percents and determine outcome ranges for each component of what makes a note!
    var durationRanges = getOutcomeRanges(eegDataPoint, commonNoteDurations);
    var groupingsRanges = getOutcomeRanges(eegDataPoint, commonNoteGroupings);
    var octaveRanges = getOutcomeRanges(eegDataPoint, octaveArray);
    var scaleNoteRanges = getOutcomeRanges(eegDataPoint, scaleNoteArray);


    // 2. Determine the randomly selected durations and groupings and calculate it based off of seconds noteDurationsPerBeatPerSecond, secondsForThisSnapshot
    var noteDurationsGroupings = getNoteDurationsGroupingsForEEGSnapshot(noteDurationsPerBeatPerSecond, secondsPerEEGSnapShot, durationRanges, groupingsRanges);

    // 3. Determine the octave and scale notes based off of the size of durations and groupings determined for this eeg snapshot (based on time):
    var finalNotes = getNoteOctaveScaleNotes(noteDurationsGroupings, octaveRanges, scaleNoteRanges);

    // Add to track 
    track = addNotesToTrack(track, finalNotes);
    return track;
}

// random number generate and build out the outcomes based off of time! yay :C
// 2. Determine the randomly selected durations and groupings and calculate it based off of seconds noteDurationsPerBeatPerSecond, secondsForThisSnapshot
function getNoteDurationsGroupingsForEEGSnapshot(noteDurationsPerBeatPerSecond, secondsPerEEGSnapShot, durationRanges, groupingsRanges) {
    return noteDurationsGroupings;
}

function getNoteOctaveScaleNotes(noteDurationsGroupings, octaveRanges, scaleNoteRanges) {
    return finalNotes;
}

function getMaxBrainwaveName(bandPowers) {
    var maxBrainwaveName = "";
    var max = 0;

    for (var brainwave in bandPowers) {
        if (bandPowers.hasOwnProperty(brainwave) && bandPowers[brainwave] > max) {
            max = bandPowers[brainwave];
            maxBrainwaveName = brainwave;
        }
    }
    return maxBrainwaveName;
}


function getOutcomeRanges(eegData, outcomesArray) {
    var totalOutcomes = outcomesArray.length;

    if (totalOutcomes == 1) {
        return getOutcomeRangesForOne(eegData, outcome);
    } else if (totalOutcomes > 1 && totalOutcomes < 5) {
        return getOutcomeRangesForMoreThanOneLessThanFive(eegData, outcome);
    }

    // Assumes data is either one for one for brainwave data or can be split by the greatest brainwave
    return getOutcomeRangesForFiveOutcomesOrGreater(eegData, outcomesArray);
}

function getOutcomeRangesForOne(eegData, outcome) {
    var brainwaveRangesToOutcomes = [];

    brainwaveRangesToOutcomes.push({
        lowerRange: 0,
        upperRange: 100,
        outcome: outcome,
    });

    return brainwaveRangesToOutcomes;
}

function getOutcomeRangesForMoreThanOneLessThanFive(eegData, outcomesArray) {
    var bandPowerValues = eegData['band_values'];
    var numOutcomes = outcomesArray.length;
    var brainwavesToRemove = brainwaves.length - numOutcomes;

    // Map brainwave values to their brainwave names for easy retrieval later!
    var brainwaveDataMap = new Map();
    for (brainwave in bandPowerValues) {
        brainwaveDataMap.set(bandPowerValues[brainwave], brainwave);
    }

    // Sort the brainwave data from smallest to largest
    var brainwaveData = [bandPowerValues['delta'], bandPowerValues['theta'], bandPowerValues['alpha'], bandPowerValues['beta'], bandPowerValues['gamma']];
    brainwaveData.sort(function (a, b) {
        return a - b;
    });

    // Calculate the total: 
    var totalBandPower = 0;
    for (let i = brainwavesToRemove; i < brainwaveData.length; i++) {
        totalBandPower += brainwaveData[i];
    }
    totalBandPower = roundTwoDecimalPoints(totalBandPower);

    // Build the outcome map
    var brainwaveRangesToOutcomes = [];
    var curLowerRange = 0, outcomeIndex = 0;
    for (let i = brainwavesToRemove; i < brainwaveData.length; i++) {
        var curBrainwavePercent = roundTwoDecimalPoints(brainwaveData[i] / totalBandPower * 100);
        var curUpperRange = roundTwoDecimalPoints(curLowerRange + curBrainwavePercent);

        // If we are at the last option, just make sure it's upperRange is 100.
        if (i == brainwaveData.length - 1) curUpperRange = 100.00;


        brainwaveRangesToOutcomes.push({
            brainwave: brainwaveDataMap.get(brainwaveData[i]),
            lowerRange: curLowerRange,
            upperRange: curUpperRange,
            outcome: outcomesArray[outcomeIndex],
        });

        curLowerRange = curUpperRange + 0.001;
        outcomeIndex++;
    }

    return brainwaveRangesToOutcomes;
}

function getOutcomeRangesForFiveOutcomesOrGreater(eegData, outcomesArray) {
    var numOutcomes = outcomesArray.length;
    var bandPowerValues = eegData['band_values'];

    //  Determine the max, split the max brainwave into outcomes if needed
    var maxBrainwaveName = getMaxBrainwaveName(bandPowerValues);
    var howManyOctcomesMaxBrainwaveWillBeSplitInto = numOutcomes > brainwaves.length ? (numOutcomes - brainwaves.length - 1) : 1;
    var maxBrainwaveSplitValue = roundTwoDecimalPoints(bandPowerValues[maxBrainwaveName] / howManyOctcomesMaxBrainwaveWillBeSplitInto);

    // Get the totalBandPower to calculate percent later
    var totalBandPower = roundTwoDecimalPoints(bandPowerValues['delta'] + bandPowerValues['theta'] + bandPowerValues['alpha'] + bandPowerValues['beta'] + bandPowerValues['gamma']);
    var brainwaveData = [bandPowerValues['delta'], bandPowerValues['theta'], bandPowerValues['alpha'], bandPowerValues['beta'], bandPowerValues['gamma']];

    var brainwaveRangesToOutcomes = [];
    var curLowerRange = 0, brainwaveIndex = 0;
    for (let i = 0; i < numOutcomes; i++) {
        var curBrainwavePercent = 0;

        // Adjust percent values based on whether or not it needs be split 
        if (maxBrainwaveSplitValue > 0 && maxBrainwaveName == brainwaves[brainwaveIndex]) {
            curBrainwavePercent = roundTwoDecimalPoints(maxBrainwaveSplitValue / totalBandPower * 100);
        } else {
            curBrainwavePercent = roundTwoDecimalPoints(brainwaveData[brainwaveIndex] / totalBandPower * 100);
        }

        var curUpperRange = roundTwoDecimalPoints(curLowerRange + curBrainwavePercent);

        // If we are at the last option, just make sure it's upperRange is 100.
        if (i == numOutcomes - 2) curUpperRange = 100.00;

        brainwaveRangesToOutcomes.push({
            brainwave: brainwaves[brainwaveIndex],
            lowerRange: curLowerRange,
            upperRange: curUpperRange,
            outcome: outcomesArray[i],
        });

        curLowerRange = curUpperRange + 0.001;

        // Update indexes as needed
        if (maxBrainwaveName == brainwaves[brainwaveIndex] && maxBrainwaveSplitValue > 0) {
            maxBrainwaveSplitValue--;
        } else {
            brainwaveIndex++;
        }
    }

    return brainwaveRangesToOutcomes;
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

function getOctaveRangeArray(minRange, maxRange) {

    var octaveRangeArray = [];
    for (let octave = minRange; octave < maxRange + 1; octave++) {
        octaveRangeArray.push(octave);
    }

    debug_print('Octave Range Array:');
    debug_print(octaveRangeArray);
    return octaveRangeArray;
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

function createNotes(totalNoteGroupingsDurations, scaleMap) {
    var noteEvents = [];
    var currentPitch = 3;

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
    getOctaveRangeArray: getOctaveRangeArray,
    createNotes: createNotes,
    addNotesToTrack: addNotesToTrack,
    getMidiString: getMidiString,
    writeMIDIfile: writeMIDIfile,
    getNoteDurationsPerBeatPerSecond: getNoteDurationsPerBeatPerSecond,
    roundTwoDecimalPoints: roundTwoDecimalPoints,
}
