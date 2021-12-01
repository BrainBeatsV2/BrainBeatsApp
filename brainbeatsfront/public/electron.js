const { musicGenerationDriver, lstmDriver, getOctaveRangeArray, getScaleNotes, getScaleMap, createNotes, addNotesToTrack, getMidiString, writeMIDIfileFromWriteObject, writeMIDIfileFromBase64String, getNoteDurationsPerBeatPerSecond, roundTwoDecimalPoints } = require('./music-generation-library');
var MidiWriter = require('midi-writer-js')
var MidiPlayer = require('midi-player-js');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { PythonShell } = require('python-shell');
var kill = require('tree-kill');
const { start } = require('repl');

// Electron App Data:
let mainWindow;
let devPort = 3000;
let prodPort = 8001;
let electronAppPath = String('http://localhost:' + devPort + '/music-generation/');

// EEG Python script data:
let pyshell;
let filePath = path.join(__dirname, 'eeg_stream.py');

// MIDI data;
var startTime = new Date();
let eegDataQueue = [];
track = new MidiWriter.Track();
write = new MidiWriter.Writer(track);
player = new MidiPlayer.Player();
midiString = "";
urlMIDI = "";

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1085,
    height: 680,
    minWidth: 1085,
    title: "Brain Beats",
    webPreferences:
      // { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true, preload: path.join(__dirname, 'preload.js'), }
      { nodeIntegration: true, contextIsolation: false, preload: path.join(__dirname, 'preload.js'), }
  });
  console.log(__dirname);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(isDev ? electronAppPath : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
  mainWindow.on('page-title-updated', function (e) {
    e.preventDefault()
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function sendEEGDataToNode(eeg_data) {
  mainWindow.webContents.send('start_eeg_script', eeg_data)
  return
}

function clearMidiWriter() {
  eegDataQueue = [];
  track = new MidiWriter.Track();
  write = new MidiWriter.Writer(track);
  midiString = "";
  urlMIDI = "";
  console.log("Cleared MIDI track");
  return
}

function stopEEGScript() {
  kill(pyshell.childProcess.pid);
  console.log('Terminated EEG Python script');
  return;
}

ipcMain.on('start_eeg_script', (event, arguments) => {
  clearMidiWriter();
  const args = arguments.data.split(" ");
  console.log(args)
  // Start recording time and python script with user arguments
  startTime = new Date();
  pyshell = new PythonShell(filePath, { pythonOptions: ['-u'], args: args });

  console.log('Python script started & track started');
  pyshell.on('message', function (message) {
    try {
      console.log('Received EEG data')
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }
      eegDataQueue.push(eeg_data);
      sendEEGDataToNode(eeg_data);
    } catch (error) {
      console.log(error)
    }
  })
});


ipcMain.on('end_eeg_script', (event, musicGenerationModel, key, scale, minRange, maxRange, instrument_num, bpm, timeSignature) => {
  if (pyshell == null || pyshell == undefined) return;
  stopEEGScript();

  console.log("bpm: " + bpm + " , timeSignature " + timeSignature);
  timeSignature = String(timeSignature);
  bpm = Number(bpm);

  // Time Tracking: 
  var totalSeconds = getMaxTimeRecorded(new Date());
  var secondsPerEEGSnapShot = eegDataQueue.length > 0 ? roundTwoDecimalPoints(totalSeconds / eegDataQueue.length) : 0;
  console.log("totalSeconds: " + totalSeconds + " , secondsPerEEGSnapShot " + secondsPerEEGSnapShot);
  console.log("bpm: " + bpm + " , timeSignature " + timeSignature);

  var noteDurationsPerBeatPerSecond = getNoteDurationsPerBeatPerSecond(bpm, timeSignature);
  var scaleArray = getScaleNotes(key, scale, minRange, maxRange);
  var scaleMap = getScaleMap(key, scale, minRange, maxRange);
  var octaveRangeArray = getOctaveRangeArray(minRange, maxRange);

  console.log(noteDurationsPerBeatPerSecond)

  if (musicGenerationModel == 4) {
    // Handles the async nature of the LSTM predictions
    let tempPromise = lstmDriver(track, eegDataQueue, scaleArray, octaveRangeArray, secondsPerEEGSnapShot, totalSeconds, noteDurationsPerBeatPerSecond, instrument_num, bpm, timeSignature)
      .then((tempTrack) => {
        track = tempTrack;
        midiString = parseMIDIStringFromTrack(track);
        event.sender.send('end_eeg_script', midiString);
      });
  } else {
    // Rest of the music generation functions that aren't async:
    track = musicGenerationDriver(eegDataQueue, musicGenerationModel, scaleArray, scaleMap, octaveRangeArray, totalSeconds, secondsPerEEGSnapShot, noteDurationsPerBeatPerSecond, instrument_num, bpm, timeSignature);
    midiString = parseMIDIStringFromTrack(track);
    event.sender.send('end_eeg_script', midiString);
  }
});


function parseMIDIStringFromTrack(track) {
  try {
    write = new MidiWriter.Writer(track);
    urlMIDI = write.dataUri();
    player.loadDataUri(urlMIDI);
    midiString = getMidiString(write);
    return midiString;
  } catch (e) {
    console.log(e)
  }
}

function getMaxTimeRecorded(endTime) {
  // Compares recording time rounded by whole number & by two decimal points
  totalTime = (endTime - startTime) / 1000;
  return Math.max(Math.round(totalTime), roundTwoDecimalPoints(totalTime));
}


function sendEEGDataToNode(eeg_data) {
  mainWindow.webContents.send('start_eeg_script', eeg_data)
  return
}


ipcMain.on('download_midi_file', (event, midiString) => {
  console.log("ipcMain.on('download_midi_file' midiString");
  console.log(midiString);
  writeMIDIfileFromBase64String(midiString);
});

ipcMain.on('play_midi', (event, args) => {
  console.log('Playing midi now')
  player.play();
  player.on('playing', function (currentTick) {
    console.log(currentTick);
  });

});
ipcMain.on('pause_midi', (event, args) => {
  console.log('Paused midi now')
  player.pause();
});
