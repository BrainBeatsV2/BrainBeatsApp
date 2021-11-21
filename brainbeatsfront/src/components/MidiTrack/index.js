import React, { useState } from 'react'
import { Button, Checkbox, Grid, Modal, Header, Segment, Dimmer, Loader, Input } from 'semantic-ui-react'

const delete_track = (props2) => {
    console.log("Deleted Track:" + props2.track_id);
}
const updateSettings = (id,privacy,name) => {
    // Update settings to mongo based on this
    console.log(privacy);
    console.log(name);
    console.log(id);
}
const Index = (props) => {
    const [open , setOpen] = useState(false);
    const [privacy, setPrivacy] = useState(props.privacy);
    const [name, setName] = useState(props.track_name);
    const [hide, setHidden] = useState(false);
    var key = props.song_key;
    var scale = props.scale;
    var bpm = props.bpm;
    console.log(props);
    
return (<>
        <div class="midi-track" style={{display: hide? 'none':'block'}}>
                                                
            <i class="material-icons midi-play" onClick={() => props.playfn(props.track_id,name,key,scale,bpm)} >play_circle</i>{name}
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
                        defaultValue={'https://brainbeats.dev/track/'+props.link}
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
