import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
import Navbar from '../components/Navbar';
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
        if (this.props.loggedin == 1)
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
      
                </div>
      
              <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      
              
      
          
            </div>);
        }

        
    }
}
export default Home
