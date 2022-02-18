import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import './TimeSlot.css'
import { connect } from 'react-redux'

function TimeSlot({ time, date, currentUser }) {
    const history = useHistory()
    let { id } = useParams()

    const getTimeSlot = () => {
        console.log(time.slot)
        history.push(`/confirm-pay/${id}/${date}/${time.slot}`)
    }

    return (
        <div className={`col-3 col-sm-2 ${time.status === 'Available' ? 'timeSlotActive' : 'timeSlotInactive'}`} onClick={getTimeSlot}>
            <p>{time.slot}</p>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUserr
})

export default connect(mapStateToProps)(TimeSlot)