import React, { Component, useState } from 'react';

class MusicGeneration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            recording: false,
            cancelButton: false
        };
        this.onStartRecording = this.onStartRecording.bind(this);
        this.onStopRecording = this.onStopRecording.bind(this);
    }
    onStartRecording() {
		this.setState({
			recording: true
		  });
	  }
    onStopRecording() {
		this.setState({
			recording: false,
            cancelButton: true
		  });
	  }

    render() {
        return (


            <div class="music-generation-bg">
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

                <a id="back" href="/dashboard"><i  class="material-icons" >chevron_left</i> <span>DASHBOARD</span></a>
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
                    <div id="model_selection">
                        <table>
                                <tr>
                                    <th>MODEL</th>
                                </tr>
                                <tr>
                                    <td>
                                    <select>
                                        <option>Model 1</option>
                                    </select>
                                    </td>
                                </tr>
                        </table>
                    </div>
                </div>
                <div class="column">
                    <div id="start_stream" >
                        <i class="material-icons" onClick={this.onStartRecording} style={{display: this.state.recording ? 'none' : 'block' }}>radio_button_unchecked</i>
                        <i class="material-icons" onClick={this.onStopRecording} style={{color: 'red', display: this.state.recording ? 'block' : 'none' }}>radio_button_checked</i>
                        </div>
                        </div>
                <div class="column">
                    
                    <div id="parameters">
                        <table>
                            <tr>
                                <th>KEY</th>
                                <th>SCALE</th>
                                <th>TIMING</th>
                                <th>BPM</th>
                            </tr>
                            <tr>
                                <td>
                                    <select>
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
                                    <select>
                                        <option>Chromatic</option>
                                        <option>Whole Tone</option>
                                        <option>Pentatonic</option>
                                    </select>
                                </td>
                                <td>
                                    <select>
                                        <option>4/4</option>
                                        <option>2/4</option>
                                        <option>2/2</option>
                                        <option>6/8</option>

                                    </select>
                                </td>
                                <td><input type="text" class="border-input bpm" value="120" /></td>
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