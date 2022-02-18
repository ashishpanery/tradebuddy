import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import './JoinCall.css'

function JoinCall({ details }) {
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    let { mentorId } = useParams()
    document.title = "Live Session"
    const handleClose = () => {
        // alert("Video Call Closed")
        //Make A Api Call to Save it as completed
        history.push(`/review-page/${mentorId}`)
    }
    function startConference() {
        try {
            console.log("Starting Conferenece")
            var room = details.room
            const domain = details.serverUrl;
            const options = {
                roomName: room,
                parentNode: document.getElementById('jitsi-container'),
                interfaceConfigOverwrite: {
                    filmStripOnly: false,
                    SHOW_JITSI_WATERMARK: false,
                },
                configOverwrite: {
                    disableSimulcast: false,
                },
            };

            const api = new window.JitsiMeetExternalAPI(domain, options);
            api.addEventListeners({
                readyToClose: handleClose
            })
            setLoading(false)
        } catch (error) {
            console.error('Failed to load Jitsi API', error);
        }
    }
    useEffect(() => {
        // verify the JitsiMeetExternalAPI constructor is added to the global..
        if (window.JitsiMeetExternalAPI) startConference();
        else alert('Jitsi Meet API script not loaded');
    }, []);

    return (
        <div className='joinCall'>
            {loading && <p>Loading...</p>}
            <div id="jitsi-container" className='joinCallContainer'></div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    details: state.joinCall.details
})
export default connect(mapStateToProps)(JoinCall)
