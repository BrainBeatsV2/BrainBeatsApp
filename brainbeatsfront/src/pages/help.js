import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
class Help extends Component {
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
      loggedin: 0
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



      <div class="music-generation-bg" style={{margin:'0'}}>
          <Sidebar active="help" is_shown="true" logged_in={this.state.loggedin}></Sidebar>
          <div id="main_content" class="help_screen">          
            <h2>Help</h2>
            <br />
            <h3>Desktop Application</h3>
            <h4>System Requirements</h4>
            <p>Suported Operating Systems: Windows, Mac OS, Linux</p>
            <p>Minimum RAM: 8GB</p>
            <h4>Where Do I Create A New MIDI track?</h4>
            <p>To create a new midi track, you must first be on the desktop version of Brain Beats. On the <a href="/dashboard">dashboard</a> screen, click on the Add Track button.</p>
            <p>For a direct link click <a href="/music-generation">here</a></p>

            <h3>Music Generation</h3>
            <h4>What Parameters Can I Control?</h4>
            <p>The key, scale, timing, bpm and instrument and able to be customized.</p>
            <h4>How Is My MIDI Generated?</h4>
            <p>MIDI is generated through two separate modes: Synthetic and EEG. Using the Synthetic Mode, the application will render midi notes based on the selected base note and scale using algorithmic approaches. The EEG mode will allow you to use a compatible EEG headset as the input alongside a corresponding model.</p>
          </div>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        

    
      </div>



    );
  }
}
export default Help