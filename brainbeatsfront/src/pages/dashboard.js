import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect, Link } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
import axios from 'axios';
class Dashboard extends Component {
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
      playing: false,
      loggedin: 0,
      myMidis: [],
    };
  }

  onStartPlaying = (id, name, key, scale, bpm) => {
    console.log("playing");
    console.log(id);
    console.log(name);
    this.setState({currentTrack: name, currentKey: key, currentScale: scale, currentBPM: bpm, playing: true})
  }
  onStopPlaying = () => {

    this.setState({playing:false})
  }
  onResumePlaying = () => {
    this.setState({playing:true})
  }
  onLogout = (e) => {
    //e.preventDefault();
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

  showMyMIDIS = (e) => {
    if (this.state.email && this.state.password) {
      const options = {
        headers: {
          'Content-type': 'application/json; charset=utf-8'
        }
      };

      const midiObject = {
        email: this.state.email,
			  password: this.state.password
      };

      axios.post('/api/midis/mine', midiObject, options)
        .then((res) => {
          if (res.status == 200) {
            console.log("Getting my MIDIS");
            console.log(res.data);
            this.setState({ myMidis: res.data });
            console.log(this.state.myMidis[0]);
            console.log(this.state.myMidis[1]);
          }
        }).catch((error) => {
          console.log(error);
        });
    }
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
      console.log(localStorage.getItem('loggedIn'));
      if (localStorage.getItem('loggedIn') == true) {
          this.setState({ loggedin: 0 });
        }
        else {
          this.setState({ loggedin: 1 });
        }
    } catch (e) {
      this.setState({ loggedin: 1 });
      console.log(e);
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
    if (this.state.myMidis.length == 0) 
      this.showMyMIDIS();
    return (



      <div class="music-generation-bg" style={{margin:'0'}}>
          <Sidebar 
            active="dashboard" 
            is_shown="true"
            logout={this.onLogout} 
            logged_in={this.state.loggedin} 
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
          ></Sidebar>
          <div id="main_content">          
            <h2>My MIDI</h2>
            <div class="midi-add" style={{ display: isElectron() ? 'inline-block' : 'none' }}><Link to={{pathname: "/music-generation", state: {username: this.state.username, email: this.state.email, password: this.state.password}}}><i class="material-icons">add</i> Add Track</Link></div>
          <div id="midi-tracks1" style={{ marginTop: '10px' }}>
            {this.state.myMidis.map(listitem => (
              <MidiTrack playfn={this.onStartPlaying} track_id={listitem._id} track_name={listitem.name} isowner={1} privacy={listitem.privacy} link={listitem.midiData} song_key={listitem.key} scale={listitem.scale} bpm={listitem.bpm}></MidiTrack>
            ))}
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
export default Dashboard