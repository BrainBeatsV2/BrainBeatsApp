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
    return (



      <div class="music-generation-bg" style={{margin:'0'}}>
          <Sidebar 
            active="help" 
            is_shown="true"
            logout={this.onLogout}
            logged_in={this.state.loggedin}
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
          ></Sidebar>
          <div id="main_content" class="help_screen">          
            <h2>Help</h2>
            <br />
            <h3>Desktop Application</h3>
            <br />
            <h4>System Requirements</h4>
            <p>Suported Operating Systems: Windows, Mac OS, Linux</p>
            <p>Minimum RAM: 8GB</p>
            <h4>Where Do I Create A New MIDI track?</h4>
            <p>To create a new midi track, you must first be on the desktop version of Brain Beats. On the <a href="/dashboard">dashboard</a> screen, click on the Add Track button.</p>
            <p>For a direct link click <a href="/music-generation">here</a></p>
            <br />
            <h3>Music Generation</h3>
            <br />
            <h4>What Parameters Can I Control?</h4>
            <p>The key, scale, timing, bpm and instrument and able to be customized.</p>
            <h4>How Is My MIDI Generated?</h4>
            <p>MIDI is generated through two separate modes: Synthetic and EEG. Using the Synthetic Mode, the application will render midi notes based on the selected base note and scale using algorithmic approaches. The EEG mode will allow you to use a compatible EEG headset as the input alongside a corresponding model.</p>
            <h4>How long should I wait to record a track?</h4>
            <p>We recommend at least 20 seconds to get enough input from the EEG headset data stream. This also allows you to get a larger selection of MIDI notes that you can later manipulate externally through a DAW</p>
            <h4>Is my headset supported?</h4>
            <p>Brain Beats supports BrainFlow supported headsets, a link can be found <a href="https://brainflow.readthedocs.io/en/stable/SupportedBoards.html" target="_blank">here</a>. You can also enter your mac and serial address manually for further compatibility.</p>
            <h4>How does this even work?</h4>
            <p>Depending on the selected model, your data from the EEG headset gets passed through some algorithmic and machine learning techniques that translates the brain wave data into musical notes. You can then export this data and use it in a music composition</p>
            <br />
            <h3>Helpful Resources</h3>
            <br />
            <h4>What is MIDI Discover?</h4>
            <p>MIDI Discover is our sharing network, where you're able to listen to ,share and download other users' midi</p>
            <br />
            <h4>How Does the Play Page work?</h4>
            <p>The play page is where we are able to listen to MIDIs created by other users on Brain Beats. Each link is unique and gives you access to download it and use it in your DAW</p> <br />
            <br />
            <h4>How Does the Play Page work?</h4>
            <p>The play page is where we are able to listen to MIDIs created by other users on Brain Beats. Each link is unique and gives you access to download it and use it in your DAW</p> <br />
           
            </div>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        

    
      </div>



    );
  }
}
export default Help