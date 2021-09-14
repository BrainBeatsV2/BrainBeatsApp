import React, { Component, useState } from 'react';
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
          name: "React"
        };
      }
      render() {
        return (


            
            <div class="music-generation-bg">
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <h3>My Tracks </h3>
            
            <br />
            <div id="top-bar"><div class="midi-add"><i class="material-icons">add</i> Add Track</div></div>
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