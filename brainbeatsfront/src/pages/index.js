import React, { Component, useState } from 'react';
import isElectron from '../library/isElectron';
import { Redirect } from "react-router-dom";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "React",
            redirect: null,
        };
    }

    render() {
        if(isElectron())
        {
            return <Redirect to="music-generation" />
        }
        return (<div style={{ display: 'flex', height: '90vh', width: '100%' }}>
            <a href="/music-generation"><i class="material-icons"></i> Music Generation</a>
        </div>);
    }
}
export default Home
