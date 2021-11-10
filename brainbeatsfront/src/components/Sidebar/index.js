import React, { useState } from 'react'
import logo from '../../images/logo_dev.png'
import isElectron from '../../library/isElectron';
const Index = (props) => {
    var active_page = props.active;
    var is_logged_in = props.logged_in;
    var is_shown = props.is_shown;
    var electron = isElectron();
return (<>
            <div  id="sidebar" class={props.music_generation ?  "hidden_sidebar": ""} style={{display: (is_shown ? "inline-block" : "none"), left: (is_shown ? "0" : "-1000px")}}>
            <img style={{height:'150px'}} src={logo} alt='logo' />
            <ul class="main_header">
                <li style={{display: (!electron && !is_logged_in) ? '' : 'none'}} class={(active_page == "home") ? "active" : ""}>
                  <i class="material-icons">home</i>
                  <a href="/" >Home</a>
                </li>
                 
                  <li style={{display: (electron && !is_logged_in) ? '' : 'none'}}>
                    <i class="material-icons">add</i>
                    <a href="/music-generation" >Create A Track</a>
                  </li>

                 <li style={{display: (is_logged_in) ? 'none' : ''}} class={(active_page == "login") ? "active" : ""}>
                  <i class="material-icons">login</i>
                  <a href="/login" >Log In</a></li>
                

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "dashboard") ? "active" : ""}>
                      <i class="material-icons">home</i>
                      <a href="/dashboard">Dashboard</a>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "play") ? "active" : ""}>
                      <i class="material-icons">play_arrow</i>
                      <a href="/play">Play</a>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "discover") ? "active" : ""}>
                    <i class="material-icons">travel_explore</i>
                    <a href="/discover">MIDI Discover</a>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "my-account") ? "active" : ""}>
                    <i class="material-icons">account_circle</i>
                    <a href="/my-account"> My Account</a>
                  </li>
                   
                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "settings") ? "active" : ""}>
                    <i class="material-icons">settings</i>
                    <a href="/settings"> Settings</a>
                  </li>
                  
                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "help") ? "active" : ""}>
                    <i class="material-icons">help</i>
                    <a href="/help" >Help</a>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}}>
                    <i class="material-icons">power_settings_new</i>
                    <a onClick={() => props.logout()} >Log Out</a>
                  </li>


              </ul>
              <div class="main_header2" style={{display: (!electron) ? '' : 'none'}}>
              <button class="download_btn"><i class="material-icons">download</i>Download</button>
              </div>
              
          </div>
        </>
        ); 
};

export default Index
