const axios = require('axios');

async function models(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.get('http://brainbeats.dev/api/models', options);

  let data = res.data;
  console.log(data);
}

async function modelsAll(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.get('http://brainbeats.dev/api/models/all', options);

  let data = res.data;
  console.log(data);
}

async function modelsName(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.get('http://brainbeats.dev/api/models/MODEL_NAME', options);

  let data = res.data;
  console.log(data);
}

async function midis(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.post('http://brainbeats.dev/api/midis', options, {
    //Needs to be filled in with session variables from front end
    email:,
    password:
  });

  let data = res.data;
  console.log(data);
}

async function midisCreate(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.post('http://brainbeats.dev/api/midis/create', options, {
    //Needs to be filled in with session variables from front end
    email:,
    password:,
    midi_name:,
    midi_data:,
    midi_privacy:,
    midi_notes:
  });

  let data = res.data;
  console.log(data);
}

async function midisId(){
  const options = {
    headers: {
      'Content-type': 'application/json; charset=utf-8'
    }
  }

  let res = await axios.post('http://brainbeats.dev/api/midis/:midi_id', options, {
    //Needs to be filled in with session variables from front end
    email:,
    password:
  });

  let data = res.data;
  console.log(data);
}
