import React, { Component, useState } from 'react';

class MusicGeneration extends Component {
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
                <h3>Music Generation</h3>
                <br />
                <br />
                <div class="left">
                    Active Model:
                    <select>
                        <option>Model 1</option>
                    </select>
                    <br />
                    <a href="#"><i class="material-icons">system_update_alt</i> Download Other Models</a>
                </div>
                <br />
                <div class="middle">
                    <button class="modes"><i class="material-icons">wifi_tethering</i> Stream Mode</button>
                    <button class="modes modes_active"><i class="material-icons">fiber_manual_record</i> Record Mode</button>
                </div>
                <div class="stream">
                    Insert Brain Wave Visualizer Concept Here
                </div>
                <br />
                <div class="parameters">
                    <h4>Adjustable Parameters</h4>
                    <br />
                    Key: <select><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option><option>A</option><option>B</option></select>
                    Triad: <select><option>Major</option><option>Minor</option><option>Augmented</option><option>Diminished</option></select>
                    <br />
                    Pre-Set Scale: <select><option>Chromatic</option><option>Whole Tone</option><option>Pentatonic</option></select>
                    <br />
                    Desired Time Signature: <input type="text" class="border-input" value="4/4" />
                    <br />
                    BPM: <input type="number" class="border-input" value="120" />
                    <br />
                    Enable Harmony: <input type="checkbox" /> Enable Aggregation: <input type="checkbox" />
                    <br />
                </div>


            </div>


        );
    }
}
export default MusicGeneration