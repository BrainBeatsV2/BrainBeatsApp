const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const { PythonShell } = require('python-shell');

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
  console.log('sent')
  return
}

let filePath = path.join(__dirname, 'eeg_stream.py');
let pyshell;

ipcMain.on('start_eeg_script', (event) => {
  console.log('Starting eeg script')
  pyshell = new PythonShell(filePath);

  pyshell.on('message', function (message) {
    try {
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }
      console.log(eeg_data)
      sendEEGData(eeg_data)
    } catch (error) {
      console.log(error)
    }
  })
});


ipcMain.on('end_eeg_script', (event) => {
  pyshell.end(function (err, code, signal) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
  });
});
