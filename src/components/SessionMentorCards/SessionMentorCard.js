import { useState } from 'react'
import './SessionMentorCard.css'
import moment from 'moment'
import axios from 'axios'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { joinCallDetails } from '../../react-redux/reducers/allActions'
import { SessionRescheduler } from '..'

function SessionMentorCard({ details, currentUser, fetchData, joinCallDetails, sessionType, setUpdatingSession }) {
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState(false)
    const history = useHistory()

    const updateSession = (status) => {
        setUpdatingSession(true)
        axios.put(`${process.env.REACT_APP_UPDATE_MENTEE_SESSION}${details.id}/${status}`, {}, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then((resp) => {
            if (resp.data.code === 200) {
                fetchData()
                setUpdatingSession(false)
            }
        })
    }

    const joinCall = async () => {
        await axios.get(`${process.env.REACT_APP_GET_CALL_OBJECT}${details.id}`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then((getCallObject) => {
            console.log(getCallObject.data.model)
            joinCallDetails(getCallObject.data.model)
            history.push(`/join-call/${details.mentorId}`)
        })
    }

    return (
        <div className='sessionMentorCard'>
            <div className='sessionMentorCardLeft my-4 my-md-0'>
                <img src={sessionType === 'mentor' ? details.mentee.photoUrl : details.mentor.photoUrl} alt='' />
            </div>
            <div className='sessionMentorCardMiddle mb-3 mb-md-0'>
                <h2 onClick={() => history.push(`/profile/${sessionType === 'mentor' ? details.mentee.id : details.mentor.id}`)} className="text-center text-md-start">{sessionType === 'mentor' ? details.mentee.name : details.mentor.name}</h2>
                <p>Session Id: <span>{details.id}</span></p>
                <p>Status: <span>{details.status}</span></p>
                <p>Date: <span>{moment(details.startDate).format('D MMM YYYY')}</span></p>
                <p>Time: <span>{details.startTime}</span></p>
            </div>
            <div className='sessionMentorCardRight'>
                {
                    details.status === 'REQUEST_PENDING' && (
                        <>
                            {/* Accept button */}
                            {sessionType === "mentor" && <button className='sessionAccept' onClick={() => updateSession('ACCEPTED')}>Accept</button>}
                            {
                                // Reschedule button
                                <div className="position-relative sessionRescheduleContainer">
                                    {sessionType === "mentor" && <button className='sessionReschedule' data-bs-toggle="modal" data-bs-target="#reScheduleModal1">Reschedule</button>}
                                    {<div className="modal fade" id="reScheduleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="exampleModalLabel1">Reschedule Session</h5>
                                                    <button onClick={() => setTimeout(() => setSuccess(false), 500)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    {
                                                        success ?
                                                            <h4 className='text-success'>Session has been rescheduled.</h4>
                                                            :
                                                            <SessionRescheduler
                                                                currentUser={currentUser}
                                                                details={details}
                                                                setSuccess={setSuccess}
                                                                saving={saving}
                                                                setSaving={setSaving}
                                                            />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }
                                </div>
                            }

                            {/* cancel button */}
                            <button className='sessionCancel' onClick={() => updateSession('CANCELLED')}>Cancel</button>
                        </>
                    )}
                {
                    details.status === 'ACCEPTED' && (
                        <>
                            <div className="position-relative sessionRescheduleContainer">
                                {sessionType === "mentor" && <button className='sessionReschedule' data-bs-toggle="modal" data-bs-target="#reScheduleModal2">Reschedule</button>}
                                <div className="modal fade" id="reScheduleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel2">Reschedule Session</h5>
                                                <button onClick={() => setTimeout(() => setSuccess(false), 500)} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                {
                                                    success ?
                                                        <h4 className='text-success'>Session has been rescheduled.</h4>
                                                        :
                                                        <SessionRescheduler
                                                            currentUser={currentUser}
                                                            details={details}
                                                            setSuccess={setSuccess}
                                                            saving={saving}
                                                            setSaving={setSaving}
                                                        />

                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className='sessionCancel' onClick={() => updateSession('CANCELLED')}>Cancel</button>
                        </>
                    )}
                {
                    details.status === 'COMPLETED' && (
                        <>
                            <div className='sessionCompletedBox'>
                                <p className='sessionCompleted'>Completed</p>
                            </div>
                        </>
                    )}
                {
                    details.status === 'STARTED' && (
                        <>
                            <button className='sessionReschedule' onClick={() => joinCall()}>Join</button>
                        </>
                    )}
            </div >
        </div >
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
    joinCallDetails: (details) => dispatch(joinCallDetails(details)),
})
export default connect(mapStateToProps, mapDispatchToProps)(SessionMentorCard)