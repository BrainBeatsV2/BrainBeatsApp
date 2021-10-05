import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "React",
          showMenu:false,
          username: '',
			    password: '',
			    email: '',
          redirect: null,
          electron: null,
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
  
      onLogout = (e) => {
        e.preventDefault();
        this.setState({
          username: '',
          password: '',
			    email: '',
        });
        if(isElectron())
        {
          this.setState({ redirect: "/music-generation"});
        }else{
          this.setState({ redirect: "/"});
        }

      }
    
      render() {
        if (this.state.redirect) 
		    {
		    	return <Redirect to={this.state.redirect} />
		    }
        if(this.state.electron == null)
        {
          if(isElectron())
          {
            this.setState({
              electron: true
            });
          }else{
            this.setState({
              electron: false
            });
        }
        }
        return (


            
            <div class="music-generation-bg">
              
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div className="nav__button" onClick={this.onShowMenu}  onMouseEnter={this.onShowMenu} onMouseLeave={this.onHideMenu}><i class="material-icons">account_circle</i>

            <ul className="nav__menu" style={{display: this.state.showMenu ? 'block' : 'none' }}>
                <li className="nav_menu-item"><a href="#">My Account</a></li>
                <li className="nav_menu-item"><a href="#">Settings</a></li>
                <li className="nav_menu-item"><a href="#" onClick={this.onLogout}>Log Out</a></li>
            </ul>
            </div>
            <h3>My Tracks </h3>
            
            <br />
            <br />
            <br />
            <br />
            <div id="top-bar"><div class="midi-add" style={{display: this.state.electron ? 'block' : 'none' }}><a href="/music-generation"><i class="material-icons" >add</i> Add Track</a></div></div>
                 <div id="midi-tracks">
                     
                   
                    <div class="midi-track">My very first midi demo<i class="material-icons midi-settings">settings</i></div>
                    <div class="midi-track">Playing random notes<i class="material-icons midi-settings">settings</i></div>
                    <div class="midi-track">I'm a music genius<i class="material-icons midi-settings">settings</i></div>
                 </div>
                 <br />
                 <br />
                 <br />
            <h3>MIDIs you might like</h3>
            <br />
            <div id="other-tracks">
                     
                   
                     <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> User239 - Track 1</div>
                     <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> User203 - Woo</div>
                     <div class="midi-track-play"><i class="material-icons midi-play">play_circle</i> User009 - Piano Jazz</div>
                  </div>
            </div>
           
    

        );
    }
}
export default Dashboard