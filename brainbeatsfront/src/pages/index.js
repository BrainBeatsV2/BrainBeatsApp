import React, { Component, useState } from 'react';
class Home extends Component {
    constructor() {
        super();
        this.state = {
            name: "React"
        };
    }

    render() {
        return (<div style={{ display: 'flex', height: '90vh', width: '100%' }}>
            <a href="/music-generation"><i class="material-icons"></i> Music Generation</a>
        </div>);
    }
}
export default Home
