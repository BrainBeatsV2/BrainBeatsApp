import React, { Component, useState } from 'react';
const { ipcRenderer } = window.require('electron');


class Home extends Component {
    constructor() {
        super();
        this.state = {
            name: "React",
            runEEGScript: false
        };
        this.onClickRecord = this.onClickRecord.bind(this);
        this.onClickStream = this.onClickStream.bind(this);
    }

    onClickRecord() {
        if (!this.state.runEEGScript) {
            console.log('Started record mode!')
            ipcRenderer.send('start_eeg_script');

            ipcRenderer.on('start_eeg_script', (event, args) => {
                console.log(args)
            })
        } else {
            console.log('Ended record mode!')
            ipcRenderer.send('end_eeg_script');

            ipcRenderer.on('end_eeg_script', (event, args) => {
                console.log(args)
            })
        }
        this.setState({ runEEGScript: !this.state.runEEGScript })
    }

    onClickStream() {
        if (!this.state.runEEGScript) {
            console.log('Clicked start stream mode!')
            ipcRenderer.send('start_eeg_script');
            ipcRenderer.on('start_eeg_script', (event, args) => {
                console.log(args)
            })
        } else {
            console.log('Clicked end stream mode!')
            ipcRenderer.send('end_eeg_script');

            ipcRenderer.on('end_eeg_script', (event, args) => {
                console.log(args)
            })
        }
        this.setState({ runEEGScript: !this.state.runEEGScript })
    }

    render() {
        return (<div style={{ display: 'flex', height: '90vh' }}>

            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <div  >
                <h1>Music Generation</h1>
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
                    <button class="modes" onClick={this.onClickStream} ><i class="material-icons">wifi_tethering</i> Stream Mode</button>
                    <button class="modes modes_active" onClick={this.onClickRecord} ><i class="material-icons">fiber_manual_record</i> Record Mode</button>
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
                    Desired Time Signature: <input type="text" class="small_input" value="4/4" />
                    <br />
                    BPM: <input type="number" class="small_input" value="120" />
                    <br />
                    Enable Harmony: <input type="checkbox" /><br></br> Enable Aggregation: <input type="checkbox" />
                    <br />
                </div>


            </div>

        </div>);
    }
}

export default Home

/*const Home = () => {
    const [count, setCount] = useState(0);
    return  (
        <div style={{display:'flex', height:'90vh'}}>

        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <div  >
            <h1>Music Generation</h1>
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
            Desired Time Signature: <input type="text" class="small_input" value="4/4" />
            <br />
            BPM: <input type="number" class="small_input" value="120" />
            <br />
            Enable Harmony: <input type="checkbox" /><br></br> Enable Aggregation: <input type="checkbox" />
            <br />
            </div>


        </div>

    </div>

);
} */