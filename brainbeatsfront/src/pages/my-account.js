import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import MidiTrack from '../components/MidiTrack/index'
import logo from '../images/logo_dev.png'
import Sidebar from '../components/Sidebar/index'
class Account extends Component {
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
            active="my-account" 
            is_shown="true"
            logout={this.onLogout}
            logged_in={this.state.loggedin}
            username={this.state.username}
            email={this.state.email}
            password={this.state.password}
          ></Sidebar>
          <div id="main_content" class="help_screen">          
            <h2>My Account</h2>

          </div>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

        

    
      </div>



    );
  }
}
export default Account