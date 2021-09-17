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

// How to not have this continually run?
// let pyshell = new PythonShell(scriptPath);

// pyshell.on('message', function (message) {
//   try {
//     eeg_data = JSON.parse(message)
//     if (eeg_data == undefined || eeg_data == null) {
//       return
//     }

//     console.log(eeg_data)
//     console.log('test')

//     // mainWindow.webContents.send()

//     // if (messageDetails.data != null && messageDetails.data != undefined) {
//     //   console.log('BACKGROUND DEBUG PRINT: Emotion Predicted')
//     //   mainWindow.webContents.send('HARDWARE_PROCESS_MESSAGE', messageDetails.emotion)
//     //   return
//     // }
//     // if (messageDetails.hasConfirmed != undefined && messageDetails.hasConfirmed != null) {
//     //   console.log('BACKGROUND DEBUG PRINT: Connection Confirmed')
//     //   return
//     // }
//   } catch (error) {
//     console.log(error)
//   }
// });

// end the input stream and allow the process to exit
// pyshell.end(function (err, code, signal) {
//   if (err) throw err;
//   console.log('The exit code was: ' + code);
//   console.log('The exit signal was: ' + signal);
//   console.log('finished');
// });