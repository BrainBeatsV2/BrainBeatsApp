import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
import axios from 'axios';


class Play extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "React",
      showMenu: false,
      username: '',
      password: '',
      email: '',
      redirect: null,
      electron: null,
      currentTrack: '',
      currentKey: '',
      currentScale: '',
      currentBPM: '',
      rawMidiString: '',
      playing: false,
      loggedin: 0,
      midiId: null,
      midiPlayed: [],
    };

    this.onDownloadMIDI = this.onDownloadMIDI.bind(this);
  }

  onStartPlaying = (id, name, key, scale, bpm) => {
    console.log("playing");
    console.log(id);
    console.log(name);
    this.setState({ currentTrack: name, currentKey: key, currentScale: scale, currentBPM: bpm, playing: true })
  }
  onStopPlaying = () => {

    this.setState({ playing: false })
  }
  onResumePlaying = () => {
    this.setState({ playing: true })
  }

  onLogout = (e) => {
    localStorage.clear();
    this.setState({
      username: '',
      password: '',
      email: '',
    });
    if (isElectron()) {
      this.setState({ loggedin: 0 });
    } else {
      this.setState({ loggedin: 1 });
    }
    if (isElectron()) {
      this.setState({ redirect: "/music-generation" });
    } else {
      this.setState({ redirect: "/" });
    }
  }
    // Download midi file
  // TODO: Needs a button (onClick)
  // TODO: Need to contact the DB 
  onDownloadMIDI() {
    window.ipcRenderer.send('download_midi_file', this.state.rawMidiString);
  }

  loadMidi = (e) => {
    const options = {
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    };

    const midiObject = {

    };

    axios.post('/api/midis/:' + this.state.midiId, midiObject, options)
      .then((res) => {
        if (res.status == 200) {
          this.setState({ midiPlayed: res.data });
        }
      }).catch((error) => {
        console.log(error);
      });
  }

   componentDidMount(){
    try {
      if(localStorage.getItem('username') !== null) {
				this.setState({
				username: localStorage.getItem('username'),
				email: localStorage.getItem('email'),
				password: localStorage.getItem('password'),
				})
			}
      if (localStorage.getItem('loggedIn') == true) {
          this.setState({ loggedin: 1 });
        }
        else {
          this.setState({ loggedin: 0 });
        }
    } catch (e) {
      this.setState({ loggedin: 0 });
    }
  }
 

  render() {
    if (this.state.redirect) {
			return <Redirect to={{
			  pathname: this.state.redirect,
			  state: {
				username: this.state.username,
				email: this.state.email,
				password: this.state.password 
			  }
			}}
		  />
		  }
    if (this.state.electron == null) {
      if (isElectron()) {
        this.setState({
          electron: true
        });
      } else {
        this.setState({
          electron: false
        });
      }
    }
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log(id);
    if (this.state.midiId == null && id != null && id != "") {
      this.setState({midiId: id});
      this.loadMidi();
    }
    return (
      <div class="music-generation-bg" style={{margin:'0'}}>
          <Sidebar 
            active="play" 
            is_shown="true"
            logout={this.onLogout}
            logged_in={this.state.loggedin} 
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
          ></Sidebar>
          <div id="main_content">          
           
            <div id="midi-tracks1" style={{marginTop:'10px'}}>
               <div class="inner_text">
                 <h2>Track Name</h2> <p>by Author</p>
                 <br />
               
               <MidiTrack playfn={this.onStartPlaying} track_id={this.state.midiPlayed._id} track_name={this.state.midiPlayed.name} isowner={0} privacy={'link'} link={"brainbeats.dev/play/?id=" + this.state.midiPlayed._id} song_key={this.state.midiPlayed.key} scale={this.state.midiPlayed.scale} bpm={this.state.midiPlayed.bpm} ></MidiTrack>
               <br />
               <br />
               <br />
          
            <h3>Parameters</h3>
            <table style={{width: '50%', textAlign: 'left'}}>
              <tr>
                <th><h4>Base Note</h4></th>
                <th><h4>Scale</h4></th>
                <th><h4>BPM</h4></th>
                <th><h4>Timing</h4></th>
                
                
              </tr>
              <tr>
                <td><p>11/02/2021 </p></td>
                <td><p>Model 1</p></td>
                <td><p>120</p></td>
                <td><p>4/4</p></td>
              </tr>
            </table>
            <br />
              <h3>Info</h3>
              <table style={{ width: '50%', textAlign: 'left' }}>
                <tr>

                  <th><h4>Created On</h4></th>
                  <th><h4>Model Used</h4></th>
                  <th><h4>Instrument</h4></th>
                </tr>
                <tr>

                  <td><p>11/02/2021 </p></td>
                  <td><p>Model 1</p></td>
                  <td><p>Piano</p></td>

                </tr>
              </table>




            </div>


          </div>
        </div>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />





        <div id="stream-bar">
          <div class="column" style={{ width: '10%' }}>
            <   div id="play_stream" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
              <i class="material-icons" onClick={this.onResumePlaying} style={{ display: this.state.playing ? 'none' : 'inline-block', fontSize: '59px' }}>play_circle_filled</i>
              <i class="material-icons" onClick={this.onStopPlaying} style={{ display: this.state.playing ? 'inline-block' : 'none', fontSize: '59px' }}>pause</i>

            </div>

          </div>
          <div class="column" style={{ width: '80%' }}>
            <h3 style={{ marginBottom: '0px' }} >{this.state.currentTrack}</h3>



            <table style={{ textAlign: 'center', display: 'inline-block' }}>
              <tr>
                <th>KEY</th>
                <th>SCALE</th>
                <th>BPM</th>

              </tr>
              <tr>
                <td>{this.state.currentKey}</td>
                <td>{this.state.currentScale}</td>
                <td>{this.state.currentBPM}</td>
              </tr>
            </table>

          </div>
          <div class="column" style={{ width: '10%' }}>

          </div>


        </div>
      </div>



    );
  }
}
export default Play