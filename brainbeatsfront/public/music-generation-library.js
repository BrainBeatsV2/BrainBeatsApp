// // class GenerateMIDI {
// //     constructor(incoming_data, duration) {
// //         this.incoming_data = this.incoming_data
// //         this.duration = this.duration

// //         this.state = {
// //             name: "React"
// //         };
// //     }
// // }

// // create midi file
// // add notes to midi file
// // determine pitch?
// // select instrument 
// // write and save the file 

// async function generateMidi(incoming_data, time) {
//     // TODO Step one: Grab the incoming data!

//     console.log("In generate Midi")
//     console.log(time)
//     console.log(incoming_data)
//     // delta = incoming_data.delta
//     // theta = incoming_data.theta
//     // alpha = incoming_data.alpha
//     // beta = incoming_data.beta
//     // gamma = incoming_data.gamma

//     // TODO: Verify midi import is done correctly
//     var MidiWriter = require('midi-writer-js')

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
//     for (var i = 0; i < time; i++) {
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
//     // console.log(write.dataUri());
//     write.saveMIDI('file');
// }

// // generateMidi(csv_file_path, 100);
