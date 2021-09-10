const electron = require('electron');
const { PythonShell } = require('python-shell')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');

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



// Event listeners for coordinating IPC between main and renderer threads
let pyshell

const endPyshell = _ => {
  if (pyshell == null || pyshell == undefined) {
    return
  }
  console.log('BACKGROUND DEBUG PRINT: Ending Script Child Process')
  pyshell.childProcess.kill(0)
  pyshell = null
}

const parsePyshellMessage = args => {
  try {
    const messageDetails = JSON.parse(args)
    if (messageDetails == undefined || messageDetails == null) {
      return
    }

    /// Handle sending emotion
    if (messageDetails.emotion != null && messageDetails.emotion != undefined) {
      console.log('BACKGROUND DEBUG PRINT: Emotion Predicted')
      mainWindow.webContents.send('HARDWARE_PROCESS_MESSAGE', messageDetails.emotion)
      return
    }

    /// Handle sending confirmation
    if (messageDetails.hasConfirmed != undefined && messageDetails.hasConfirmed != null) {
      console.log('BACKGROUND DEBUG PRINT: Connection Confirmed')
      return
    }
  } catch (error) {
    console.log(args)
  }
}

// Event to tell electron to create python script handler
ipcMain.on('HARDWARE_PROCESS_START', event => {
  endPyshell()
  let startScriptPath = path.join(__dirname, 'hardware/hardware_starter.py')
  pyshell = new PythonShell(startScriptPath, {
    pythonPath: 'python',
  })

  pyshell.on('message', function (results) {
    parsePyshellMessage(results)
  })

  pyshell.on('error', function (results) {
    console.log('BACKGROUND DEBUG PRINT: Script Error Exit')
    endPyshell()
  })

  pyshell.on('stderr', function (stderr) {
    endPyshell()
    console.log(stderr)
    mainWindow.webContents.send('HARDWARE_PROCESS_ERROR')
  })
})

// Event to shutdown python script handler
ipcMain.on('HARDWARE_PROCESS_SHUTDOWN', event => {
  endPyshell()
})