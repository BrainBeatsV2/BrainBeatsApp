import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
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
      loggedin:0
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
    e.preventDefault();
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
  componentDidMount(){
    if (this.state.username == "")
    {
        this.setState({ loggedin: 0 });
       
    }
    else 
    {
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
          <Sidebar active="discover" is_shown="true" logged_in={this.state.loggedin}></Sidebar>
          <div id="main_content">          
            <h2>MIDI Discover</h2>
            <div id="midi-tracks1" style={{marginTop:'10px'}}>
                <MidiTrack playfn={this.onStartPlaying} track_id="400" track_name="test" isowner={0} privacy={0} link="aefikjeaifi2j930r2r" song_key="C" scale="Minor" bpm="120" ></MidiTrack>
                <MidiTrack playfn={this.onStartPlaying} track_id="500" track_name="test" isowner={0}  privacy={1} link="eafke930i23903429kfqemfm" song_key="D" scale=" Pentatonic" bpm="60"></MidiTrack>
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