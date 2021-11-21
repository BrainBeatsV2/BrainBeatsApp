import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
import axios from 'axios';
class Discover extends Component {
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
      loggedin:0,
      publicMidis: [],
    };
    this.onShowMenu = this.onShowMenu.bind(this);
    this.onHideMenu = this.onHideMenu.bind(this);

  }
  onShowMenu() {
    this.setState({
      showMenu: true
    });
  }
  onHideMenu() {
    this.setState({
      showMenu: false
    });
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

  showPublicMIDIS = (e) => {

    const options = {
      headers: {
        'Content-type': 'application/json; charset=utf-8'
      }
    };

    const midiObject = {
    };

    axios.get('/api/midis/public', midiObject, options)
      .then((res) => {
        if (res.status == 200) {
          console.log("Getting public MIDIS");
          console.log(res.data);
          this.setState({ publicMidis: res.data });
          console.log(this.state.publicMidis[0]);
          console.log(this.state.publicMidis[1]);
        }
      }).catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    try {
      if (localStorage.getItem('username') !== null) {
        this.setState({
          username: localStorage.getItem('username'),
          email: localStorage.getItem('email'),
          password: localStorage.getItem('password'),
        })
      }
      if (localStorage.getItem('loggedIn') == true) {
        this.setState({ loggedin: 0 });
      }
      else {
        this.setState({ loggedin: 1 });
      }
    } catch (e) {
      this.setState({ loggedin: 1 });
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
    if (this.state.publicMidis.length == 0) 
      this.showPublicMIDIS();
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
            active="discover" 
            is_shown="true"
            logout={this.onLogout} 
            logged_in={this.state.loggedin}
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
          ></Sidebar>
          <div id="main_content">          
            <h2>MIDI Discover</h2>
            <div id="midi-tracks1" style={{marginTop:'10px'}}>
              {this.state.publicMidis.map(listitem => (
                <MidiTrack playfn={this.onStartPlaying} track_id={listitem._id} track_name={listitem.name} isowner={0} privacy={'public'} link={listitem.midiData} song_key={listitem.key} scale={listitem.scale} bpm={listitem.bpm}></MidiTrack>
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
export default Discover