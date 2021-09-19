const { generateMidi } = require('./music-generation-library');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { PythonShell } = require('python-shell');
var kill = require('tree-kill');


// Todo handle import for checking if iselectron
// let scriptPath = path.join(__dirname, 'eeg_stream.py')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: { nodeIntegration: true, contextIsolation: false } });
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

function sendEEGData(eeg_data) {
  mainWindow.webContents.send('start_eeg_script', eeg_data)
  return
}

let filePath = path.join(__dirname, 'eeg_stream.py');
let pyshell;

ipcMain.on('start_eeg_script', (event) => {
  pyshell = new PythonShell(filePath);
  console.log('Script started, running now')

  pyshell.on('message', function (message) {
    try {
      console.log("Parsing json")
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }

      console.log(Date.now())
      sendEEGData(eeg_data)
      generateMidi(eeg_data, 4)

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
