const { setInstrument, getScaleNotes, createIntervalPitchMap, createNotes, addNotesToTrack, getMidiString, writeMIDIfile } = require('./music-generation-library');
var MidiWriter = require('midi-writer-js')
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { PythonShell } = require('python-shell');
var kill = require('tree-kill');


let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true, contextIsolation: false } });
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
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

let filePath = path.join(__dirname, 'eeg_stream.py');
let pyshell;

const eegDataQueueSizeCap = 10;
let eegDataQueue = [];

ipcMain.on('start_eeg_script', (event) => {
  pyshell = new PythonShell(filePath);
  track = new MidiWriter.Track();
  console.log('Python script started & track started');

  // Currently default setting the instrument as piano, can later change instruments
  track = setInstrument(track, 1);

  pyshell.on('message', function (message) {
    try {
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }
      eegDataQueue.push(eeg_data);

      sendEEGDataToNode(eeg_data);
      scale = getScaleNotes('pentatonicC');
      intervalPitchMap = createIntervalPitchMap(scale.length, scale);
      // TODO: Fix hardcoding and allow for it to be something that's modified by time in the script or time it
      noteEvents = createNotes(20);
      track = addNotesToTrack(track, noteEvents);

      if (eegDataQueue.length === eegDataQueueSizeCap) {
        write = new MidiWriter.Writer(track);
        midiString = getMidiString(write);
        writeMIDIfile(write);
        eegDataQueue = [];
      }
    } catch (error) {
      console.log(error)
    }
  })
});


ipcMain.on('end_eeg_script', (event) => {
  if (pyshell == null || pyshell == undefined) {
    return
  }
  console.log('Terminating python script')
  kill(pyshell.childProcess.pid)
});
