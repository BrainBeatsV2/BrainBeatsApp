import React, { useState } from 'react'
import { Button, Checkbox, Grid, Modal, Header, Segment, Dimmer, Loader, Input } from 'semantic-ui-react'
import axios from 'axios';
const delete_track = (props2) => {
    console.log("Deleted Track:" + props2.track_id);
}
const updateSettings = (id,privacy,name) => {
    // Update settings to mongo based on this
    console.log(privacy);
    console.log(name);
    console.log(id);
    var user_email = "";
    var user_password = "";
    const options = {
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        }
    };
    try {
        if (localStorage.getItem('username') !== null) {
            user_email       =  localStorage.getItem('email');
            user_password    =  localStorage.getItem('password');
        }

      } catch (e) {
    }

    const midiObject = {
        email: user_email,
        password: user_password,
        midi_name: name,
        midi_privacy: privacy
    };

    axios.post(('/api/midis/' + id + '/update'), midiObject, options)
    .then((res) => {
        if (res.data.message === "MIDI updated successfully!") {
            console.log("Successful MIDI updating");
        }
    }).catch((error) => {
        console.log(error);
    });
}
const Index = (props) => {
    const [open , setOpen] = useState(false);
    const [privacy, setPrivacy] = useState(props.privacy);
    const [name, setName] = useState(props.track_name);
    const [hide, setHidden] = useState(false);
    var key = props.song_key;
    var scale = props.scale;
    var bpm = props.bpm;
    var midiData = props.midiData;
    var playonly = props.playonly ? true : false ;
    console.log(props);
    
return (<>
        <div class="midi-track" style={{display: hide? 'none':'block', background: playonly? 'none': ''}}>
                                                
            <i class="material-icons midi-play" onClick={() => props.playfn(props.track_id,name,key,scale,bpm,midiData)}  style={{fontSize: playonly? '37px':'24px',marginTop: playonly? '-12px':'0px'}}>play_circle</i>{name}
            <i class="material-icons midi-delete" onClick={function() {delete_track(props); setHidden(true);}} style={{display: props.isowner == "1" ? 'inline-block' : 'none'}}>delete</i>
            
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open} 
                trigger={<i class="material-icons midi-settings" style={{display: props.isowner == "1" ? 'inline-block' : 'none'}}>settings</i>}
                closeOnDimmerClick={false}
              >
                <Modal.Header>Track Settings</Modal.Header>
                <Modal.Content text>
                    <Modal.Description>
                        <Header>Info</Header>
                        Track Name <br />
                        <Input 
                        defaultValue={name} onChange={(e) => setName(e.target.value)}
                        />     
                        <br /><br />
                        MIDI Link<br />
                        <Input readOnly={true} action={{
                                            color: 'teal',
                                            labelPosition: 'right',
                                            icon: 'copy',
                                            content: 'Copy',
                                        }}
                        defaultValue={'https://brainbeats.dev/play?id=' + props.link}
                        />      
                        <Header>Sharing and Privacy Settings</Header>
                        <Checkbox input  value='public' onClick={() => setPrivacy('public')} checked={privacy == 'public'} radio label='Track is visible on MIDI Discover section' />
                        <br />
                        <Checkbox value='link' onClick={() => setPrivacy('link')} checked={privacy == 'link'} radio label='Track is only visible to anyone with my link' />
                        <br />
                        <Checkbox value='private' onClick={() => setPrivacy('private')} checked={privacy == 'private'} radio label='Track is only visible to me' />
                        <br />
                        <br />
                                 
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        content="Save and Close"
                        labelPosition='right'
                        icon='checkmark'
                        onClick={function() {setOpen(false); updateSettings(props.track_id,privacy,name);}}
                        positive
                    />
                </Modal.Actions>
            </Modal>
        </div>
        </>
        ); 
};

export default Index
