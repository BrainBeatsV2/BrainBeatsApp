import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import Account from '../components/Account/index'
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
      playing: false
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

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
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



      <div class="music-generation-bg">

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <div className="nav__button" onClick={this.onShowMenu} onMouseEnter={this.onShowMenu} onMouseLeave={this.onHideMenu}><i class="material-icons">account_circle</i>
          <ul className="nav__menu_loggedin" style={{ display: (this.state.showMenu && !this.state.loggedout) ? 'inline-block' : 'none' }}>
            <li className="nav_menu-item"><a href="#">My Account</a></li>
            <li className="nav_menu-item"><a href="#">Settings</a></li>
            <li className="nav_menu-item"><a href="#" onClick={this.onLogout} >Log Out</a></li>
          </ul>
          <ul className="nav__menu_loggedout" style={{ display: (this.state.showMenu && this.state.loggedout) ? 'inline-block' : 'none' }}>
            <li className="nav_menu-item"><a href="/login">Login</a></li>
            <li className="nav_menu-item"><a href="#">Help</a></li>
          </ul>
        </div>
        <h1 style={{ color: 'white' }}>Dashboard </h1 >


        <div class="list">
          <div class="column-track"><h2>My MIDI</h2>
            <div class="midi-add" style={{ display: isElectron() ? 'inline-block' : 'none' }}><a href="/music-generation"><i class="material-icons">add</i> Add Track</a></div>
          </div>
          <div class="column-track"><h2> Discover</h2></div>
        </div>
        <div class="list">
          <div id="midi-tracks">
            <MidiTrack playfn={this.onStartPlaying} track_id="400" track_name="test" isowner={1} privacy={0} link="aefikjeaifi2j930r2r"></MidiTrack>
            <MidiTrack playfn={this.onStartPlaying} track_id="500" track_name="test" isowner={1}  privacy={1} link="eafke930i23903429kfqemfm" ></MidiTrack>
          </div>
          <div id="other-tracks">
           
            <MidiTrack playfn={this.onStartPlaying} track_id="300" track_name="Woo" isowner={0} link="qi3jroqirj3iornf"></MidiTrack>
            <MidiTrack playfn={this.onStartPlaying} track_id="300" track_name="Track 3" isowner={0} link="frmi0293r0jqfefe"></MidiTrack>
            
          </div>
        </div>
        <br />
        <br />
        <br />
        <h3>MIDIs you might like</h3>
        <br />

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