import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import Sidebar from '../components/Sidebar/index'
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            redirect: null,
            username: '',
            loggedin: 0,
            email: '',
            password: '',
        };
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
        console.log(localStorage.getItem('loggedIn'));
        if (localStorage.getItem('loggedIn') == true) {
          this.setState({ loggedin: 1 });
        }
        else {
          this.setState({ loggedin: 0 });
        }
      } catch (e) {
        this.setState({ loggedin: 0 });
        console.log(e);
      }
    }

    render() {
        if(isElectron())
        {
            return <Redirect to={{
                pathname: "/music-generation",
                state: {
                  username: this.state.username,
                  email: this.state.email,
                  password: this.state.password 
                }
              }}
            />
        }
        if (this.state.loggedin == 1)
        {
            return <Redirect to={{
                pathname: "/dashboard",
                state: {
                  username: this.state.username,
                  email: this.state.email,
                  password: this.state.password 
                }
              }}
            />
        }else{
            return (
        
                <div class="music-generation-bg" style={{margin:'0'}}>
                <Sidebar 
                  active="home" 
                  is_shown="true" 
                  logged_in={this.state.loggedin}
                  username={this.state.username}
                  email={this.state.email}
                  password={this.state.password}
                ></Sidebar>
                <div id="main_content" class="help_screen">          
                <h2>Brain Beats</h2>
                <br />
                <h3>About</h3>
                <p>Brain Beats was created to map properties of electroencephalographically (EEG) recorded
                    brain waves to properties of music. Brain Beats provides a music composition platform to users of all music 
                    experience levels and has the capability to generate, share, and view brain-generated music.</p>
                    <br />
                <h3>How To Get Started</h3>
                <br />
                <ul>
                  <li>1. Download our Brain Beats Desktop application</li>
                  <p>Compatible with Windows, Mac OS and Linux</p>
                  <li>2. Plug-In a <a href="https://brainflow.readthedocs.io/en/stable/SupportedBoards.html" target="_blank">compatible EEG headset</a> to get started</li>
                  <p>We have a synthetic mode that provides similar functionality if you don't have an EEG headset available.</p>
                  <li>3. Customize your music by setting parameters</li><p>Select a model, key, scale, octave range, instrument, tempo and time signature</p>
                  <li>4. Begin recording</li><p>You'll see a visualizer to show that you're in record mode</p>
                  <li>5. Download, Save and Upload your MIDI</li><p>Save and Upload your MIDI to your account and share on MIDI Discover</p>
                  </ul>
                <br />
                </div>
              
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      
              
      
          
            </div>);
        }

        
    }
}
export default Home
