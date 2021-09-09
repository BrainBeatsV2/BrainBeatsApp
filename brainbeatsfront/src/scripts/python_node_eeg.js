// TODO: Melanie needs to parse out what is needed for the python script to work with (music-generation.js)
// Note: File will be deprecated upon changes

const PythonShell = require('python-shell').PythonShell;


PythonShell.run('./scripts/eeg_stream.py', null, function (err) {
  if (err) throw err;
  console.log('finished');
});
