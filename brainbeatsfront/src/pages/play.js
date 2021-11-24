import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
import axios from 'axios';
import 'html-midi-player'
import { PlayerElement } from 'html-midi-player';

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
      noMidis: true,
    };

    this.startPlay = this.startPlay.bind(this);
    this.stopPlay = this.stopPlay.bind(this);
    this.resumePlay = this.resumePlay.bind(this);
  }

  onStartPlaying = (id, name, key, scale, bpm, midiData) => {
    console.log("playing");
    console.log(id);
    console.log(name);
    this.setState({ currentTrack: name, currentKey: key, currentScale: scale, currentBPM: bpm, playing: true , rawMidiString: 'data:audio/midi;base64,' + midiData });
    setTimeout(
      function () {
        this.startPlay();
      }.bind(this),500);
  }
  onStopPlaying = () => {

    this.setState({ playing: false })
    this.stopPlay();
  }
  onResumePlaying = () => {
    this.setState({ playing: true })
    this.resumePlay();
  }
  startPlay() {
    var player = document.querySelector("midi-player");
    player.start();
    console.log("STARTPLAY");
    console.log(player);
    console.log(document.querySelector("midi-player"));
  }
  stopPlay(){
    var player = document.querySelector("midi-player");
    player.stop();
    console.log("STOPPLAY");

  }
  resumePlay(){
    var player = document.querySelector("midi-player");
    player.start();
    console.log("RESUMEPLAY");

  }
  onLogout = (e) => {
    localStorage.clear();
    this.setState({
      username: '',
      password: '',
      email: '',
    });
    if (isElectron()) {
      this.setState({ redirect: "/music-generation" });
    } else {
      this.setState({ redirect: "/" });
    }
  }

  loadMidi = (e) => {
    const options = {
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    };

    const midiObject = {

    };

    axios.post(('/api/midis/' + e), midiObject, options)
      .then((res) => {
        if (res.status == 200) {
          if (res.data == [])
          {
            this.setState({ noMidis: true });
          }
          else
          {
            console.log(res.data);
            this.setState({ noMidis: false });
            this.setState({ midiPlayed: res.data });
            console.log(this.state.midiPlayed);
          }

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
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log(id);
    console.log(this.state.midiId);
    if ((this.state.midiId == null) && (id != null) && (id != "")) {
      this.setState({midiId: id});
      this.loadMidi(id);
    }
    else
    {
      // if play page not found -- take user to discover instead 
      if (isElectron()) {
        this.setState({ redirect: "/music-generation" });
      } else {
        this.setState({ redirect: "/discover" });
      }
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
            <script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.22.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.4.0"></script>

            <midi-player style={{ display: 'none' }} src={this.state.rawMidiString} ></midi-player>
               <div class="inner_text">
                 <table>
                  <tr>
                    <td><h2>{this.state.midiPlayed.name}</h2>
                        <p>{this.state.midiPlayed.notes}</p>
                    </td>
                    <td>{(!this.state.midiPlayed) ? '': (
                   <MidiTrack playonly={true} playfn={this.onStartPlaying} midiData={this.state.midiPlayed.midiData} track_id={this.state.midiPlayed._id} track_name={this.state.midiPlayed.name} isowner={0} privacy={'link'} link={"brainbeats.dev/play?id=" + this.state.midiPlayed._id} song_key={this.state.midiPlayed.key} scale={this.state.midiPlayed.scale} bpm={this.state.midiPlayed.bpm} ></MidiTrack>
                 )}</td>
                  </tr>
                  </table>
                
                 <br />
                 
                 

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
                <td><p>{this.state.midiPlayed.key}</p></td>
                <td><p>{this.state.midiPlayed.scale}</p></td>
                <td><p>{this.state.midiPlayed.bpm}</p></td>
                <td><p>{this.state.midiPlayed.timeSignature}</p></td>
              </tr>
            </table>
            <br />
              <h3>Info</h3>
              <table style={{ width: '50%', textAlign: 'left' }}>
                <tr>
                  <th><h4>Created On</h4></th>
                </tr>
                <tr>
                  <td><p>{this.state.midiPlayed.createdAt}</p></td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <div id="stream-bar">
          <div class="column" style={{ width: '10%' }}>
            <div id="play_stream" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
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
          <table style={{ textAlign: 'center', display: (this.state.rawMidiString == '') ? 'none' : 'inline-block' }}>
              <tr>
                <td><a href={this.state.rawMidiString} download={this.state.currentTrack == "" ? "" : (this.state.currentTrack + ".mid") }><i class="material-icons">file_download</i></a></td>
              </tr>
              <tr>
              <th>DOWNLOAD</th>
              
                
              </tr>
            </table>
          </div>


        </div>
      </div>



    );
  }
}
export default Play
