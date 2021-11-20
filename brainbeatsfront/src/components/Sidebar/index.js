import React, { useState } from 'react'
import logo from '../../images/logo_dev.png'
import isElectron from '../../library/isElectron';
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
const Index = (props) => {
    var active_page = props.active;
    var is_logged_in = props.logged_in;
    var is_shown = props.is_shown;
    var electron = isElectron();
    var username = props.username;
    var email = props.email;
    var password = props.password;
return (<>
            <div  id="sidebar" class={props.music_generation ?  "hidden_sidebar": ""} style={{display: (is_shown ? "inline-block" : "none"), left: (is_shown ? "0" : "-1000px")}}>
            <img style={{height:'150px'}} src={logo} alt='logo' />
            <ul class="main_header">
                <li style={{display: (!electron && !is_logged_in) ? '' : 'none'}} class={(active_page == "home") ? "active" : ""}>
                  <i class="material-icons">home</i>
                  <Link to={{pathname: "/", state: {username: username, email: email, password: password}}}>Home</Link>
                </li>
                 
                  <li style={{display: (electron && !is_logged_in) ? '' : 'none'}}>
                    <i class="material-icons">add</i>
                    <Link to={{pathname: "/music-generation", state: {username: username, email: email, password: password}}}>Create A Track</Link>
                  </li>

                 <li style={{display: (is_logged_in) ? 'none' : ''}} class={(active_page == "login") ? "active" : ""}>
                    <i class="material-icons">login</i>
                    <Link to={{pathname: "/login", state: {username: username, email: email, password: password}}}>Log In</Link>
                 </li>
                

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "dashboard") ? "active" : ""}>
                      <i class="material-icons">home</i>
                      <Link to={{pathname: "/dashboard", state: {username: username, email: email, password: password}}}>Dashboard</Link>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "play") ? "active" : ""}>
                      <i class="material-icons">play_arrow</i>
                      <Link to={{pathname: "/play", state: {username: username, email: email, password: password}}}>Play</Link>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "discover") ? "active" : ""}>
                    <i class="material-icons">travel_explore</i>
                    <Link to={{pathname: "/discover", state: {username: username, email: email, password: password}}}>MIDI Discover</Link>
                  </li>

                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "my-account") ? "active" : ""}>
                    <i class="material-icons">account_circle</i>
                    <Link to={{pathname: "/my-account", state: {username: username, email: email, password: password}}}>My Account</Link>
                  </li>
                   
                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "settings") ? "active" : ""}>
                    <i class="material-icons">settings</i>
                    <Link to={{pathname: "/settings", state: {username: username, email: email, password: password}}}>Settings</Link>
                  </li>
                  
                  <li style={{display: (!is_logged_in) ? 'none' : ''}} class={(active_page == "help") ? "active" : ""}>
                    <i class="material-icons">help</i>
                    <Link to={{pathname: "/help", state: {username: username, email: email, password: password}}}>Help</Link>
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
