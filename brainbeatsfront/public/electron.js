const { setInstrument, getScaleNotes, createIntervalPitchMap, createNotes, addNotesToTrack, getMidiString, writeMIDIfile } = require('./music-generation-library');
var MidiWriter = require('midi-writer-js')
var MidiPlayer = require('midi-player-js');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { PythonShell } = require('python-shell');
var kill = require('tree-kill');
const { start } = require('repl');

let filePath = path.join(__dirname, 'eeg_stream.py');
let mainWindow;
let pyshell

var startTime = new Date();
let eegDataQueue = [];
track = new MidiWriter.Track();
write = new MidiWriter.Writer(track);
player = new MidiPlayer.Player();
midiString = "";
urlMIDI = "";


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1085, height: 680, minWidth: 1085,
    webPreferences:
      // { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true, preload: path.join(__dirname, 'preload.js'), }
      { nodeIntegration: true, contextIsolation: false, preload: path.join(__dirname, 'preload.js'), }
  });
  console.log(__dirname);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(isDev ? 'http://localhost:3000/music-generation/' : `file://${path.join(__dirname, '../build/index.html')}`);
  mainWindow.on('closed', () => mainWindow = null);
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
  return
}


ipcMain.on('set_instrument', (event, args) => {
  console.log("Set instrument to: " + args);
  track = setInstrument(track, args);
});

ipcMain.on('start_eeg_script', (event, arguments) => {
  clearMidiWriter();

  // Start recording time and python script with user arguments
  startTime = new Date();
  pyshell = new PythonShell(filePath, { pythonOptions: ['-u'], args: arguments.data });

  console.log('Python script started & track started');
  pyshell.on('message', function (message) {
    try {
      console.log('Received EEG data')
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }
      console.log(eeg_data);
      eegDataQueue.push(eeg_data);
      sendEEGDataToNode(eeg_data);
    } catch (error) {
      console.log(error)
    }
  })
});


ipcMain.on('end_eeg_script', (event, user_key, user_scale, user_minrange, user_maxrange) => {
  if (pyshell == null || pyshell == undefined) {
    return
  }

  var endTime = new Date();
  var secondsRecorded = Math.round((endTime - startTime) / 1000);
  console.log("Seconds Recorded: " + secondsRecorded);

  stopEEGScript();
  console.log('Terminated EEG Python script')

  // Calculate total eegdata points for how many seconds of recording?
  eegDataQueue.forEach(eegDataPoint => {
    scale = getScaleNotes(user_key, user_scale, user_minrange, user_maxrange);
    intervalPitchMap = createIntervalPitchMap(scale.length, scale);
    noteEvents = createNotes(secondsRecorded, scale, intervalPitchMap);
    track = addNotesToTrack(track, noteEvents);
  });

  write = new MidiWriter.Writer(track);
  urlMIDI = write.dataUri();
  player.loadDataUri(urlMIDI);
  midiString = getMidiString(write);
  event.sender.send('end_eeg_script', midiString);
  writeMIDIfile(write);
});

// TODO Handle download of midi files from dashboard
// ipcMain.on('download_midi', (event, args) => {
//   console.log('Downloading midi');
//   writeMIDIfile(write);
// });

ipcMain.on('gen_midi', (event, args) => {
  console.log('Loaded midi now')
  // player.loadDataUri(urlMIDI);
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