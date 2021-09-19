const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
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
  const start = Date.now();

  console.log('Starting eeg script')
  pyshell = new PythonShell(filePath);
  console.log("Script ready to run, starting now")

  pyshell.on('message', function (message) {
    try {
      console.log("Parsing json")
      eeg_data = JSON.parse(message)
      if (eeg_data == undefined || eeg_data == null) {
        return
      }

      console.log("Sent from on pyshell")
      const millis = Date.now() - start;
      console.log(`seconds elapsed = ${(millis / 1000)}`);
      cur = Date.now()
      console.log(cur)

      sendEEGData(eeg_data)

    } catch (error) {
      console.log(error)
    }
  })
});


ipcMain.on('end_eeg_script', (event) => {
  if (pyshell == null || pyshell == undefined) {
    return
  }
  console.log(pyshell.childProcess.pid)
  console.log('Terminating python script')
  kill(pyshell.childProcess.pid)
});
