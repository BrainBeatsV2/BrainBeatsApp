import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
// const { ipcRenderer } = window.require('electron');
// const { ipcRenderer } = window.require('electron');
import 'html-midi-player'
import recording_img from '../images/recording.gif'
import Sidebar from '../components/Sidebar/index'
import { Button, Checkbox, Grid, Modal, Header, Segment, Dimmer, Loader } from 'semantic-ui-react'
import { PlayerElement } from 'html-midi-player';
import axios from 'axios';
class MusicGeneration extends Component {

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
            scale: "pentatonic",
            timeSignature: "4/4",
            bpm: 120,
            minRange: 3,
            maxRange: 3,
            headsetMode: 'Synthetic',
            saveModalOpen: false,
            saveEEGOpen: false,
            saving: false,
            saved: false,
            downloadMIDI: false,
            privacySettings: "private",
            trackLink: "brainbeats.dev/play?id=",
            loggedin: 0,
            midiString: '',
            email: '',
            rawMidiString: '',
            username: '',
            password: '',
            trackName: '',
            midiID: '',
            canSave: false,
            eegMAC: '',
            eegSerial: '',
            recievedData: false,
            statusText: 'INITIALIZING',
            eegBoardID: '-1'
        };
      
        this.onStartRecording = this.onStartRecording.bind(this);
        this.onStopRecording = this.onStopRecording.bind(this);
        this.onShowMenu = this.onShowMenu.bind(this);
        this.onHideMenu = this.onHideMenu.bind(this);
        this.onStartPlaying = this.onStartPlaying.bind(this);
        this.onStopPlaying = this.onStopPlaying.bind(this);
        this.onReRecord = this.onReRecord.bind(this);
        this.onDecreaseMin = this.onDecreaseMin.bind(this);
        this.onDecreaseMax = this.onDecreaseMax.bind(this);
        this.onIncreaseMin = this.onIncreaseMin.bind(this);
        this.onIncreaseMax = this.onIncreaseMax.bind(this);
        this.updateRange = this.updateRange.bind(this);
        this.onSynthetic = this.onSynthetic.bind(this);
        this.onEEG = this.onEEG.bind(this);
        this.setOpen = this.setOpen.bind(this);
        this.onSaveRecording = this.onSaveRecording.bind(this);
        this.onChangeTrackSettings = this.onChangeTrackSettings.bind(this);
        this.onChangeEEGPorts = this.onChangeEEGPorts.bind(this);
        this.changeInstrument = this.changeInstrument.bind(this);
        this.changeModel = this.changeModel.bind(this);
        this.changeKey = this.changeKey.bind(this);
        this.changeScale = this.changeScale.bind(this);
        this.onDownloadMIDI = this.onDownloadMIDI.bind(this);
        this.onCancelEEGMode = this.onCancelEEGMode.bind(this);
        this.onOpenEEGMode = this.onOpenEEGMode.bind(this);
        this.changeTimeSignature = this.changeTimeSignature.bind(this);
        this.changeBPM = this.changeBPM.bind(this);
    }
    // Start MIDI Recording
    onStartRecording() {

        this.setState({
            recording: true,
            saveOptions: false,
            disabledFields: 'disabled'
        });

        // If not running the EEG Script, then run it!
        if (!this.state.isEEGScriptRunning) {
            console.log('Started recording!');

            console.log(this.state.headsetMode)
            console.log(this.state.eegBoardID)
            console.log(this.state.eegMAC)
            console.log(this.state.eegSerial)

            // Starts EEG script
            if (this.state.headsetMode == 'Synthetic') {
                window.ipcRenderer.send('start_eeg_script', {
                    data: "--board-id " + this.state.eegBoardID

                });
            } else if (this.state.headsetMode == 'EEG') {
                if (this.state.eegMAC != '') {
                    window.ipcRenderer.send('start_eeg_script', {
                        data: "--board-id " + this.state.eegBoardID + " --serial-port " + this.state.eegSerial + " --mac-address " + this.state.eegMAC
                    });
                } else {
                    window.ipcRenderer.send('start_eeg_script', {
                        data: "--board-id " + this.state.eegBoardID + " --serial-port " + this.state.eegSerial

                    });
                }
            }

            // Opens a channel between the EEG script & recieves the output from the EEG script as args
            window.ipcRenderer.on('start_eeg_script', (event, args) => {
                console.log(args)
                this.setState({
                    recievedData:true,
                    statusText: 'RECORDING...'
                })
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
    }

    // Stop MIDI Recording
    onStopRecording() {
        this.setState({
            recording: false,
            saveOptions: true,
            disabledFields: ''
        });

        // If EEG Script is running, stop it right now
        if (this.state.isEEGScriptRunning) {
            console.log('Ended recording!')
            // Parameters: key,scale
            console.log("BPM: " + this.state.bpm + " timeSignature: " + this.state.timeSignature)
            window.ipcRenderer.send('end_eeg_script', this.state.model, this.state.key, this.state.scale, this.state.minRange, this.state.maxRange, this.state.instrument, this.state.bpm, this.state.timeSignature);
            window.ipcRenderer.on('end_eeg_script', (event, args) => {
                console.log(args)
                this.setState({ midiString: 'data:audio/midi;base64,' + args });
                this.setState({ rawMidiString: args });
                this.setState({recievedData: false,
                    statusText: 'INITIALIZING'})
            })
        }
        this.setState({ isEEGScriptRunning: !this.state.isEEGScriptRunning })
    }


    // Start Playing MIDI
    onStartPlaying() {
        this.setState({
            playing: true
        });
        var player = document.querySelector("midi-player");
        player.start();
        // window.ipcRenderer.send('play_midi');

    }
    // Paused MIDI
    onStopPlaying() {
        this.setState({
            playing: false
        });
        var player = document.querySelector("midi-player");
        player.stop();
        //window.ipcRenderer.send('pause_midi');
    }
    // Re-record MIDI
    onReRecord() {
        this.setState({
            playing: false,
            saveOptions: false,
            recording: false,
            midiString: '',
            rawMidiString: ''
        });
    }
    // Show Account Menu
    onShowMenu() {
        this.setState({
            showMenu: true
        });
    }
    // Hide Account Menu
    onHideMenu() {
        this.setState({
            showMenu: false
        });
    }
    // Range : Decreased Min
    onDecreaseMin() {
        if (!this.state.recording) {
            if (this.state.minRange > 1) {
                this.setState({
                    minRange: (this.state.minRange - 1)
                });
            }
        }

    }
    // Range : Decreased Max
    onDecreaseMax() {
        // Decrease max as long as max >= min
        if (!this.state.recording) {
            if (this.state.maxRange > this.state.minRange) {
                this.setState({
                    maxRange: (this.state.maxRange - 1)
                });
            }
        }
    }
    // Range : Increase Min
    onIncreaseMin() {
        // Increase min as long as min <= max
        if (!this.state.recording) {
            if (this.state.minRange < this.state.maxRange) {
                this.setState({
                    minRange: (this.state.minRange + 1)
                });
            }
        }
    }
    // Range : Increase Max
    onIncreaseMax() {
        if (!this.state.recording) {
            if (this.state.maxRange < 7) {
                this.setState({
                    maxRange: (this.state.maxRange + 1)
                });
            }
        }
    }
    onLogout = (e) => {
        localStorage.clear();
        this.setState({
            username: '',
            password: '',
            email: '',
        });
    }


    updateRange() {
        console.log("updated")
    }
    // Clicking Synthetic
    onSynthetic() {
        if (this.state.headsetMode == "EEG") {
            this.setState({
                headsetMode: 'Synthetic',
                eegBoardID: '-1'
            })
        }

    }
    // Clicking EEG
    onEEG() {
        if (this.state.headsetMode == "Synthetic") {
            this.setState({
                headsetMode: 'EEG',
                eegBoardID: '1'
            })
        }
    }
    setOpen() {
        this.setState({
            saveModalOpen: !this.state.saveModalOpen
        })
    }
    onOpenEEGMode() {
        this.setState({
            saveEEGOpen: !this.state.saveEEGOpen,
            headsetMode: 'EEG'
        })
    }
    onCancelEEGMode() {
        this.setState({
            saveEEGOpen: !this.state.saveEEGOpen,
            headsetMode: 'Synthetic'
        })
    }
    // Clicking Save and Upload and show loading screen
    onSaveRecording = (e) => {
        e.preventDefault();
        this.setState({
            saving: true,
            saved: true
        })
        setTimeout(
            function () {
                this.setState({
                    saving: false,
                    saved: true
                })
            }
                .bind(this),
            3000
        );

        const options = {
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        };

        const midiObject = {
            email: this.state.email,
            password: this.state.password,
            midi_name: this.state.trackName,
            midi_data: this.state.rawMidiString,
            midi_privacy: this.state.privacySettings,
            midi_notes: this.state.username,
            midi_bpm: this.state.bpm,
            midi_scale: this.state.scale,
            midi_key: this.state.key,
            midi_time_signature: this.state.timeSignature,
        };

        axios.post('/api/midis/create', midiObject, options)
            .then((res) => {
                if (res.data.message === "MIDI uploaded successfully!") {
                    console.log("Successful MIDI creation");
                    this.setState({ trackLink: this.state.trackLink + res.data.id });
                    this.setState({ midiID: res.data.id });
                    console.log(this.state.midiID);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    // Radio Button privacy settings switch

    // Download midi file
    onDownloadMIDI() {
        //  window.ipcRenderer.send('download_midi_file', this.state.rawMidiString);
    }
    // Changing MAC/Serial Ports
    onChangeEEGPorts() {
        this.setState({
            saveEEGOpen: !this.state.saveEEGOpen,
            headsetMode: 'EEG'
        })
    }
    // Save Settings Button
    onChangeTrackSettings() {
        this.setState({
            privacySettings: this.state.privacySettings,
            saveModalOpen: !this.state.saveModalOpen
        })

        const options = {
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            }
        };

        const midiObject = {
            email: this.state.email,
            password: this.state.password,
            midi_name: this.state.trackName,
            midi_privacy: this.state.privacySettings,
            midi_notes: this.state.username,
        };

        axios.post(('/api/midis/' + this.state.midiID + '/update'), midiObject, options)
            .then((res) => {
                if (res.data.message === "MIDI updated successfully!") {
                    console.log("Successful MIDI updating");
                    this.setState({ trackLink: this.state.trackLink + res.data.id });
                    this.setState({ midiID: res.data.id });
                    console.log(this.state.midiID);
                }
            }).catch((error) => {
                console.log(error);
            });
    }
    handleTrackName = (e) => {
        this.setState({ trackName: e.target.value });
        if (e.target.value.length == 0) {

            this.setState({ canSave: false });
        }
        else {
            this.setState({ canSave: true });

        }
    };
    componentDidMount() {
        try {
            if (localStorage.getItem('username') !== null) {
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
            console.log(e);
        }
        var player = document.querySelector("midi-player");
        if (player != null) {

            // Player Stops
            player.addEventListener("stop", function () {
                if ((this.currentTime == this.duration))
                    console.log("song ended");

            });
            // Player isPlaying
            player.addEventListener("note", function () {


            });
        }
    }
    changeInstrument(event) { this.setState({ instrument: event.target.value }); }
    changeModel(event) { this.setState({ model: event.target.value }); }
    changeKey(event) { this.setState({ key: event.target.value }); }
    changeScale(event) { this.setState({ scale: event.target.value }); }
    changePrivacy = (e, { value }) => this.setState({ privacySettings: value });
    changeTimeSignature(event) { this.setState({ timeSignature: event.target.value }); }
    changeBPM = (e) => {
        this.setState({ bpm: e.target.value });
    };
    changeEEGMac = (e) => {
        this.setState({ eegMAC: e.target.value });
    };

    changeEEGSerial = (e) => {
        this.setState({ eegSerial: e.target.value });
    };


    render() {
        if (!isElectron()) {
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
        if (localStorage.getItem('loggedIn') == 'true' && this.state.loggedin == 0) {
            this.setState({ loggedin: 1 });
        }
        return (


            <div class="music-generation-bg" >
                <Sidebar
                    music_generation="true"
                    logout={this.onLogout}
                    is_shown={this.state.showMenu}
                    logged_in={this.state.loggedin}
                    username={this.state.username}
                    email={this.state.email}
                    password={this.state.password}
                ></Sidebar>
                <Dimmer.Dimmable dimmed={this.state.saving}>
                    <Dimmer active={this.state.saving} page>
                        <Loader>Uploading</Loader>
                    </Dimmer>


                </Dimmer.Dimmable>
                <div class="fade-bg" onMouseEnter={this.onHideMenu} style={{ display: (this.state.showMenu) ? "block" : "none" }}></div>
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <script src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.22.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.4.0"></script>

                <a id="back" style={{ display: ((this.state.recording || this.state.saveOptions) && (!this.state.saved && this.state.loggedin)) ? 'none' : 'inline-block' }} class="showmenu" href="#" onMouseEnter={this.onShowMenu}><i class="material-icons" >menu</i> <span>MENU</span></a>

                <div id="headset_selection" class="">
                    <p>{this.state.headsetMode} Mode</p>
                    <i class="material-icons" onClick={this.onSynthetic} style={{ color: (this.state.headsetMode == 'Synthetic') ? 'white' : 'rgba(48,50,54)' }}>memory</i>
                    <Modal
                        onClose={this.onOpenEEGMode}
                        onOpen={this.onOpenEEGMode}
                        open={this.state.saveEEGOpen}
                        trigger={<i class="material-icons" onClick={this.onEEG} style={{ color: (this.state.headsetMode == 'EEG') ? 'white' : 'rgba(48,50,54)' }}>headset</i>}
                        closeOnDimmerClick={false} >
                        <Modal.Header>EEG Settings</Modal.Header>
                        <Modal.Content text>
                            <Modal.Description>
                                <Header>Connected MAC Address</Header>
                                <input className="modal_input" defaultValue={this.state.eegMAC} type="text" onChange={this.changeEEGMac} />
                                <Header>Connected Serial Port</Header>
                                <input className="modal_input" defaultValue={this.state.eegSerial} type="text" onChange={this.changeEEGSerial} />
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color='black' onClick={this.onCancelEEGMode}>
                                Cancel
                            </Button>
                            <Button
                                content="Adjust EEG Settings"
                                labelPosition='right'
                                icon='checkmark'
                                onClick={this.onChangeEEGPorts}
                                positive
                            />
                        </Modal.Actions>
                    </Modal>
                </div>

                <div class="stream">
                    <img id="recording_gif" src={recording_img} class={this.state.recording ? 'fadeIn' : 'fadeOut'} alt='logo' />
                    <midi-player style={{ display: 'none' }}
                        src={this.state.midiString}
                    >

                    </midi-player>

                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div id="stream-bar" style={{ position: (this.state.showMenu) ? "absolute" : "fixed" }}>
                    <div class="column">
                        <div id="rerecord" style={{ display: this.state.saveOptions ? 'inline-block' : 'none', width: '100%' }}>

                            <table style={{ width: '100%' }}>
                                <tr>
                                    <td ><i style={{ display: this.state.saved ? 'none' : 'block' }} class="material-icons" onClick={this.onReRecord}>replay</i></td>

                                    <td><a href={'data:audio/midi;base64,' + this.state.rawMidiString} download={(this.state.loggedin && this.state.trackName != "") ? (this.state.trackName + ".mid") : "untitled.mid"}><i class="material-icons test">file_download</i></a></td>

                                </tr>
                                <tr>

                                    <th ><span style={{ display: this.state.saved ? 'none' : 'block' }}>Record Again</span></th>
                                    <th>Download MIDI </th> {/* TODO: This needs to be made a button, putting this here for now?   */}

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
                                        <select id="parameter_model" disabled={this.state.recording} value={this.state.model} onChange={this.changeModel}>
                                            <option value="1">Probabilistic Mapping</option>
                                            <option value="2">Blues Improvisation</option>
                                            <option value="3">Neumann's 1:1</option>
                                            <option value="4">Melody Improvisation</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_instrument" disabled={this.state.recording} value={this.state.instrument} onChange={this.changeInstrument}>
                                            <option value="1">Piano</option>
                                            <option value="13">Xylophone</option>
                                            <option value="19">Organ (Church)</option>
                                            <option value="24">Guitar (Acoustic)</option>
                                            <option value="27">Guitar (Electric)</option>
                                            <option value="40">Violin</option>
                                            <option value="41">Viola</option>
                                            <option value="42">Cello</option>
                                            <option value="48">Strings</option>
                                            <option value="56">Trumpet</option>
                                        </select>
                                    </td>
                                    <td><i class="material-icons changeOctave noselect" onClick={this.onDecreaseMin}>chevron_left</i> <input type="text" class="border-input range" onChange={this.updateRange} value={this.state.minRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMin}>chevron_right</i></td>
                                    <td><i class="material-icons changeOctave noselect " onClick={this.onDecreaseMax}>chevron_left</i> <input type="text" class="border-input range" onChange={this.updateRange} value={this.state.maxRange} disabled={this.state.recording} /> <i class="material-icons changeOctave noselect" onClick={this.onIncreaseMax}>chevron_right</i></td>

                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="column" style={{ width: '10%' }}>
                    <span style={{ fontSize: '10px', color: this.state.recievedData ? 'red' : 'white',display: this.state.recording ? 'inline': 'none'}} >{this.state.statusText}</span>
                        <div id="play_stream" style={{  display: this.state.saveOptions ? 'block' : 'none' }}>
                            
                            <i class="material-icons" onClick={this.onStartPlaying} style={{ display: this.state.playing ? 'none' : 'inline-block' }}>play_circle_filled</i>
                            <i class="material-icons" onClick={this.onStopPlaying} style={{ display: this.state.playing ? 'inline-block' : 'none' }}>pause</i>

                        </div>
                        <div id="start_stream" style={{ display: this.state.saveOptions ? 'none' : 'block', marginTop: '5px' }}>
                            <i class="material-icons" onClick={this.onStartRecording} style={{ display: this.state.recording ? 'none' : 'inline-block' }}>radio_button_unchecked</i>
                            <i class="material-icons" onClick={this.onStopRecording} style={{ color: 'red', display: this.state.recording ? 'inline-block' : 'none' }}>radio_button_checked</i>
                        </div>
                    </div>
                    <div class="column">
                        <div id="saveoptions" style={{ display: this.state.saveOptions ? 'block' : 'none' }}>
                            <table class="save_options">
                                <tr>
                                    <td ><input class="input100 midi_name" placeholder="Untitled" type="text" name="TrackName" style={{ border: this.state.saved ? 'none' : '1px solid gray', cursor: this.state.saved ? 'pointer' : 'cursor' }} value={this.state.trackName} onChange={this.handleTrackName} readOnly={this.state.saved ? 'readonly' : ''} required /></td>

                                    <td style={{ display: (this.state.saved || !this.state.loggedin || !this.state.canSave) ? 'none' : 'block' }}><i class="material-icons" onClick={this.onSaveRecording} >cloud_upload</i></td>
                                    <Modal
                                        onClose={this.setOpen}
                                        onOpen={this.setOpen}
                                        open={this.state.saveModalOpen}
                                        trigger={<td style={{ display: (this.state.saved) ? 'block' : 'none' }}><i class="material-icons" >ios_share</i></td>}
                                        closeOnDimmerClick={false} >
                                        <Modal.Header>Track Settings</Modal.Header>
                                        <Modal.Content text>
                                            <Modal.Description>
                                                <Header>Sharing and Privacy Settings</Header>
                                                <Checkbox input onChange={this.changePrivacy} value='public' checked={this.state.privacySettings == "public"} radio label='Track is visible on MIDI Discover section' />
                                                <br />
                                                <Checkbox onChange={this.changePrivacy} value='link' checked={this.state.privacySettings == "link"} radio label='Track is only visible to anyone with my link' />
                                                <br />
                                                <Checkbox onChange={this.changePrivacy} value='private' checked={this.state.privacySettings == "private"} radio label='Track is only visible to me' />
                                                <br />
                                                <br />
                                                <span className="black_text">MIDI Link:</span> <input className="modal_input" value={this.state.trackLink} type="text" readOnly={true} />
                                            </Modal.Description>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button color='black' onClick={this.setOpen}>
                                                Close
                                            </Button>
                                            <Button
                                                content="Save Settings"
                                                labelPosition='right'
                                                icon='checkmark'
                                                onClick={this.onChangeTrackSettings}
                                                positive
                                            />
                                        </Modal.Actions>
                                    </Modal>

                                </tr>
                                <tr>
                                    <th class="leftText"><span >Track Name</span></th>

                                    <th style={{ display: (this.state.saved || !this.state.loggedin || !this.state.canSave) ? 'none' : 'block' }}>Save and Upload</th>
                                    <th style={{ display: this.state.saved ? 'block' : 'none' }}>Share</th>

                                </tr>
                            </table>
                        </div>
                        <div id="parameters" style={{ display: this.state.saveOptions ? 'none' : 'block' }}>
                            <table>
                                <tr >
                                    <th >KEY</th>
                                    <th>SCALE</th>
                                    <th>TIMING</th>
                                    <th>BPM</th>

                                </tr>
                                <tr>
                                    <td>
                                        <select id="parameter_key" disabled={this.state.recording} value={this.state.key} onChange={this.changeKey}>
                                            <option value="C">C</option>
                                            <option value="Db">Db</option>
                                            <option value="D">D</option>
                                            <option value="Eb">Eb</option>
                                            <option value="E">E</option>
                                            <option value="F">F</option>
                                            <option value="Gb">Gb</option>
                                            <option value="G">G</option>
                                            <option value="Ab">Ab</option>
                                            <option value="A">A</option>
                                            <option value="Bb">Bb</option>
                                            <option value="B">B</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_scale" disabled={this.state.recording} value={this.state.scale} onChange={this.changeScale}>
                                            <option value="pentatonic">Pentatonic</option>
                                            <option value="major">Major</option>
                                            <option value="minor">Minor</option>
                                            <option value="chromatic">Chromatic</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select id="parameter_timing" disabled={this.state.recording} value={this.state.timeSignature} onChange={this.changeTimeSignature} >
                                            <option value="4/4">4/4</option>
                                            <option value="2/4">2/4</option>
                                            <option value="2/2">2/2</option>
                                            <option value="6/8">6/8</option>
                                        </select>
                                    </td>
                                    <td><input id="parameter_bpm" type="text" class="border-input bpm" defaultValue="120" disabled={this.state.recording} value={this.state.bpm} onChange={this.changeBPM} /></td>
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
