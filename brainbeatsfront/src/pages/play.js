import React, { Component, useState } from 'react';


class Play extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            recording: false,
            disabledFields: '',
            cancelButton: false,
            showMenu: false,
            saveOptions: false,
            playing: false,
            isEEGScriptRunning: false,
            model: 1,
            instrument: 1,
            key: "C",
            scale: "Pentatonic",
            timing: "4/4",
            bpm: 120,
            minRange: 3,
            maxRange: 3,
            headsetMode: 'Synthetic'
        };
       
        this.onShowMenu = this.onShowMenu.bind(this);
        this.onHideMenu = this.onHideMenu.bind(this);
        this.onStartPlaying = this.onStartPlaying.bind(this);
        this.onStopPlaying = this.onStopPlaying.bind(this);

    }
  
    onStartPlaying() {
        this.setState({
            playing: true
        });
       
    }
    onStopPlaying() {
        this.setState({
            playing: false
        });
        
    }
   
    onShowMenu() {
        this.setState({
            showMenu: true
        });
    }
    onHideMenu() {
        this.setState({
            showMenu: false
        });
    }

    render() {
        return (


            <div class="music-generation-bg">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <div className="nav__button" onClick={this.onShowMenu} onMouseEnter={this.onShowMenu} onMouseLeave={this.onHideMenu}><i class="material-icons">account_circle</i>

                    <ul className="nav__menu" style={{ display: this.state.showMenu ? 'block' : 'none' }}>
                        <li className="nav_menu-item"><a href="#">My Account</a></li>
                        <li className="nav_menu-item"><a href="#">Settings</a></li>
                        <li className="nav_menu-item"><a href="#">Log Out</a></li>
                    </ul>
                </div>
                <a id="back" href="/dashboard"><i class="material-icons" >chevron_left</i> <span>DASHBOARD</span></a>
                <div id="headset_selection" class="">
                    <p>{this.state.headsetMode} Mode</p>
                    <i class="material-icons" onClick={this.onSynthetic} style={{ color: (this.state.headsetMode == 'Synthetic') ? '#4d90fe' : '#000000' }}>memory</i>
                    <i class="material-icons" onClick={this.onGanglion} style={{ color: (this.state.headsetMode == 'Ganglion') ? '#4d90fe' : '#000000' }}>headset</i>
                </div>
                <div class="stream">
                    Insert Brain Wave Visualizer Concept Here
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="stream-bar">
                    <div class="column">
                        <div id="rerecord" style={{ display: this.state.saveOptions ? 'block' : 'none', float: 'right' }}>

                            <table >
                                <tr>

                                    <td><i class="material-icons" onClick={this.onReRecord}>backspace</i></td>

                                </tr>
                                <tr>

                                    <th>Record Again</th>
                                </tr>
                            </table>
                        </div>
                        <div id="model_selection" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <table>
                                <tr>
                                    <th>MODEL</th>
                                    <th>INSTRUMENT</th>
                                    
                                    <th>MIN</th>
                                    <th>MAX</th>
                                </tr>
                                <tr>
                                    <td>
                                        <select id="parameter_model" disabled={this.state.recording}>
                                            <option>Model 1</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_instrument" disabled={this.state.recording}>
                                            <option value="1">Piano</option>
                                        </select>
                                    </td>
                                    <td><i class="material-icons changeOctave noselect" onClick={this.onDecreaseMin}>chevron_left</i> <input  type="text" class="border-input range"  onChange={this.updateRange} value={this.state.minRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMin}>chevron_right</i></td>
                                    <td><i class="material-icons changeOctave noselect " onClick={this.onDecreaseMax}>chevron_left</i> <input type="text" class="border-input range"  onChange={this.updateRange} value={this.state.maxRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMax}>chevron_right</i></td>
                             
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="column">
                        <div id="play_stream" style={{ display: this.state.saveOptions ? 'block' : 'none' }}>
                            <i class="material-icons" onClick={this.onStartPlaying} style={{ display: this.state.playing ? 'none' : 'inline-block' }}>play_circle_filled</i>
                            <i class="material-icons" onClick={this.onStopPlaying} style={{ display: this.state.playing ? 'inline-block' : 'none' }}>pause</i>

                        </div>
                        <div id="start_stream" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <i class="material-icons" onClick={this.onStartRecording} style={{ display: this.state.recording ? 'none' : 'inline-block' }}>radio_button_unchecked</i>
                            <i class="material-icons" onClick={this.onStopRecording} style={{ color: 'red', display: this.state.recording ? 'inline-block' : 'none' }}>radio_button_checked</i>
                        </div>
                    </div>
                    <div class="column">
                        <div id="saveoptions" style={{ display: this.state.saveOptions ? 'block' : 'none' }}>
                            <table class="save_options">
                                <tr>

                                    <td><i class="material-icons">file_download</i></td>
                                    <td><i class="material-icons">cloud_upload</i></td>
                                    <td><i class="material-icons">ios_share</i></td>

                                </tr>
                                <tr>

                                    <th>Download MIDI</th>
                                    <th>Save and Upload</th>
                                    <th>Share</th>
                                </tr>
                            </table>
                        </div>
                        <div id="parameters" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <table>
                                <tr>
                                    <th>KEY</th>
                                    <th>SCALE</th>
                                    <th>TIMING</th>
                                    <th>BPM</th>
                                 
                                </tr>
                                <tr>
                                    <td>
                                        <select id="parameter_key" disabled={this.state.recording}>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="E">E</option>
                                            <option value="F">F</option>
                                            <option value="G">G</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_scale" disabled={this.state.recording}>
                                            <option value="pentatonic">Pentatonic</option>
                                            <option value="chromatic">Chromatic</option>
                                            <option value="whole_tone">Whole Tone</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_timing" disabled={this.state.recording}>
                                            <option>4/4</option>
                                            <option>2/4</option>
                                            <option>2/2</option>
                                            <option>6/8</option>

                                        </select>
                                    </td>
                                    <td><input id="parameter_bpm" type="text" class="border-input bpm" defaultValue="120" disabled={this.state.recording} /></td>
                                       </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Play