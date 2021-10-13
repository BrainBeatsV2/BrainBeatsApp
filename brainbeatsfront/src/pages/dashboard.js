import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "React",
          showMenu:false
        };
        this.onShowMenu = this.onShowMenu.bind(this);
        this.onHideMenu = this.onHideMenu.bind(this);
      }
      onShowMenu(){
        this.setState({
			showMenu: true
		  });
      }
      onHideMenu(){
        this.setState({
			showMenu: false
		  });
      }
      render() {
        return (


            
            <div class="music-generation-bg">
              
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div className="nav__button" onClick={this.onShowMenu}  onMouseEnter={this.onShowMenu} onMouseLeave={this.onHideMenu}><i class="material-icons">account_circle</i>

            <ul className="nav__menu_loggedin" style={{ display: (this.state.showMenu && !this.state.loggedout) ? 'inline-block' : 'none' }}>
                        <li className="nav_menu-item"><a href="#">My Account</a></li>
                        <li className="nav_menu-item"><a href="#">Settings</a></li>
                        <li className="nav_menu-item"><a href="#">Log Out</a></li>
                    </ul>
                    <ul className="nav__menu_loggedout" style={{ display: (this.state.showMenu && this.state.loggedout) ? 'inline-block' : 'none' }}>
                        <li className="nav_menu-item"><a href="/login">Login</a></li>
                        <li className="nav_menu-item"><a href="#">Help</a></li>
                    </ul>
</div>
            <h1 style={{color: 'white'}}>Dashboard </h1 >
            

              <div class="list">
              <div class="column-track"><h2>My MIDI</h2>
              <div class="midi-add" style={{display: isElectron() ? 'inline-block': 'none'}}><a href="/music-generation"><i class="material-icons">add</i> Add Track</a></div>
          </div>
            <div class="column-track"><h2> Discover</h2></div>
            </div>
            <div class="list">
              <div id="midi-tracks">
                    
                  
                    <div class="midi-track">My very first midi demo<i class="material-icons midi-settings">settings</i></div>
                    <div class="midi-track">Playing random notes<i class="material-icons midi-settings">settings</i></div>
                    <div class="midi-track">I'm a music genius<i class="material-icons midi-settings">settings</i></div>
              </div>
              <div id="other-tracks">
                    
                      <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> Track 1 </div>
                      <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> Woo</div>
                      <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> Piano Jazz</div>
              </div>
            </div>
            
                 <br />
                 <br />
                 <br />
            <h3>MIDIs you might like</h3>
            <br />

            <div id="stream-bar">
            <div class="column" style={{width: '10%'}}>
            <   div id="play_stream" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <i class="material-icons" onClick={this.onStartPlaying} style={{ display: this.state.playing ? 'none' : 'inline-block' , fontSize: '59px'}}>play_circle_filled</i>
                            <i class="material-icons" onClick={this.onStopPlaying} style={{ display: this.state.playing ? 'inline-block' : 'none', fontSize: '59px' }}>pause</i>

                </div>

            </div>
            <div class="column" style={{width: '80%'}}>
                  <h3 style={{marginBottom: '0px'}} >Track Name</h3>
                  
                 
                    
                    <table style={{textAlign: 'center',display: 'inline-block'}}>
                      <tr>
                          <th>KEY</th>
                          <th>SCALE</th>
                          <th>BPM</th>
                          
                      </tr>
                      <tr>
                          <td>C</td>
                          <td>Major</td>
                          <td>120</td>
                      </tr>
                    </table>
                   
            </div>
                    <div class="column" style={{width: '10%'}}>

                    </div>


            </div>
            </div>
           
    

        );
    }
}
export default Dashboard