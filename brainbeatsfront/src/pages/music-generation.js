import React, { Component, useState } from 'react';
const { ipcRenderer } = window.require('electron');

class MusicGeneration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            recording: false,
            cancelButton: false,
            showMenu: false,
            saveOptions: false,
            playing: false,
            isEEGScriptRunning: false
        };
        this.onStartRecording = this.onStartRecording.bind(this);
        this.onStopRecording = this.onStopRecording.bind(this);
        this.onShowMenu = this.onShowMenu.bind(this);
        this.onHideMenu = this.onHideMenu.bind(this);
        this.onStartPlaying = this.onStartPlaying.bind(this);
        this.onStopPlaying = this.onStopPlaying.bind(this);
        this.onReRecord = this.onReRecord.bind(this);
    }
    onStartRecording() {
        this.setState({
            recording: true,
            saveOptions: false
        });

        // If not running the EEG Script, then run it!
        if (!this.state.isEEGScriptRunning) {
            console.log('Started recording!')
            ipcRenderer.send('start_eeg_script');
            ipcRenderer.on('start_eeg_script', (event, args) => {
                console.log(args)
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
    }

    onStopRecording() {
        this.setState({
            recording: false,
            saveOptions: true
        });

        // If EEG Script is running, stop it right now
        if (this.state.isEEGScriptRunning) {
            console.log('Ended recording!')
            ipcRenderer.send('end_eeg_script');
            ipcRenderer.on('end_eeg_script', (event, args) => {
                console.log(args)
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
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
    onReRecord() {
        this.setState({
            playing: false,
            saveOptions: false,
            recording: false
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
                                </tr>
                                <tr>
                                    <td>
                                        <select disabled={this.state.recording}>
                                            <option>Model 1</option>
                                        </select>
                                    </td>
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
                                        <select disabled={this.state.recording}>
                                            <option>C</option>
                                            <option>D</option>
                                            <option>E</option>
                                            <option>F</option>
                                            <option>G</option>
                                            <option>A</option>
                                            <option>B</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select disabled={this.state.recording}>
                                            <option>Chromatic</option>
                                            <option>Whole Tone</option>
                                            <option>Pentatonic</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select disabled={this.state.recording}>
                                            <option>4/4</option>
                                            <option>2/4</option>
                                            <option>2/2</option>
                                            <option>6/8</option>

                                        </select>
                                    </td>
                                    <td><input type="text" class="border-input bpm" value="120" disabled={this.state.recording} /></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default MusicGeneration