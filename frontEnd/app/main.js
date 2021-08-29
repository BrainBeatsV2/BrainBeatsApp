// TODO: Melanie needs to parse out what is needed for the python script to work with (music-generation.js)
// Note: File will be deprecated upon changes
/*
const PythonShell = require('python-shell').PythonShell;

const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

PythonShell.run('./scripts/eeg_stream.py', null, function (err) {
  if (err) throw err;
  console.log('finished');
});
*/