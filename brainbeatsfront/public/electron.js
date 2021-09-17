const { app, BrowserWindow, ipcMain } = require('electron');
const { PythonShell } = require('python-shell');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

// Todo handle import for checking if iselectron
let scriptPath = path.join(__dirname, 'eeg_stream.py')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
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


let pyshell = new PythonShell(scriptPath);

// sends a message to the Python script via stdin
pyshell.send('hello');
pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});
// end the input stream and allow the process to exit
pyshell.end(function (err, code, signal) {
  if (err) throw err;
  console.log('The exit code was: ' + code);
  console.log('The exit signal was: ' + signal);
  console.log('finished');
});

// Running all the time right off of the bat 
// PythonShell.run(scriptPath, null, function (err, results) {
//   console.log(scriptPath)
//   if (err) {d
//     console.log(err)
//     throw err
//   }
//   console.log(results)
//   console.log('Python.run finished');
// });


//  Brain Beats V1 Code: 
// // Event listeners for coordinating IPC between main and renderer threads
// let pyshell

// const endPyshell = _ => {
//   if (pyshell == null || pyshell == undefined) {
//     return
//   }
//   console.log('BACKGROUND DEBUG PRINT: Ending Script Child Process')
//   pyshell.childProcess.kill(0)
//   pyshell = null
// }

// const parsePyshellMessage = args => {
//   try {
//     const messageDetails = JSON.parse(args)
//     if (messageDetails == undefined || messageDetails == null) {
//       return
//     }

//     /// Handle sending emotion
//     if (messageDetails.data != null && messageDetails.data != undefined) {
//       console.log('BACKGROUND DEBUG PRINT: Emotion Predicted')
//       mainWindow.webContents.send('HARDWARE_PROCESS_MESSAGE', messageDetails.emotion)
//       return
//     }

//     /// Handle sending confirmation
//     if (messageDetails.hasConfirmed != undefined && messageDetails.hasConfirmed != null) {
//       console.log('BACKGROUND DEBUG PRINT: Connection Confirmed')
//       return
//     }
//   } catch (error) {
//     console.log(args)
//   }
// }

// // Event to tell electron to create python script handler
// ipcMain.on('HARDWARE_PROCESS_START', event => {
//   endPyshell()
//   pyshell = new PythonShell(scriptPath, {
//     pythonPath: 'python',
//   })

//   console.log("ipcMain.on('HARDWARE_PROCESS_START')");

//   pyshell.on('message', function (results) {
//     parsePyshellMessage(results)
//   })

//   pyshell.on('error', function (results) {
//     console.log('BACKGROUND DEBUG PRINT: Script Error Exit')
//     endPyshell()
//   })

//   pyshell.on('stderr', function (stderr) {
//     endPyshell()
//     console.log(stderr)
//     mainWindow.webContents.send('HARDWARE_PROCESS_ERROR')
//   })
// })

// // Event to shutdown python script handler
// ipcMain.on('HARDWARE_PROCESS_SHUTDOWN', event => {
//   console.log("ipcMain.on('HARDWARE_PROCESS_SHUTDOWN')");
//   endPyshell()
// })
