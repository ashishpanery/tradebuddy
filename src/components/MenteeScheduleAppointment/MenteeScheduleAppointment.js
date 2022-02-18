import React, { useState, useEffect } from 'react'
import { TimeSlot, ComponentLoader } from "../"
import './MenteeScheduleAppointment.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { connect } from 'react-redux'
import { useHistory, useParams, useLocation, Redirect } from 'react-router-dom';
import axios from 'axios';
import useRedirect from '../Redirect/Redirect';

function MenteeScheduleAppointment({ currentUser, userProfile, timeslots }) {
    const [activeCalender, setActiveCalender] = useState(false)
    const [componentLoading, setComponentLoading] = useState(false)
    const [mentorTimeSlot, setMentorTimeSlot] = useState([])
    const tomorrow = moment().add(1, 'days');
    const [currentDate, setCurrentDate] = useState(moment(tomorrow).format('YYYY-MM-DD'))
    const history = useHistory()
    const isMentor = userProfile.status
    const url = useParams()
    console.log({ url })
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)

    const onChangeCalenderDate = (event) => {
        // console.log("calendar change")
        // console.log({ timeslots })
        var formattedCalenderDate = moment(event).format('YYYY-MM-DD')
        setCurrentDate(formattedCalenderDate)
        setActiveCalender(false)
    }


    useEffect(() => {
        // if (!currentUser) return
        const fetchData = async () => {
            console.log({ currentDate })
            setComponentLoading(true)
            // {
            //     mentorId: userProfile.id,
            //     date: `${currentDate}`
            // }
            await axios.get(`${process.env.REACT_APP_GET_MENTOR_TIMESLOT}/${userProfile.id}?date=${currentDate}`,).then((response) => {
                // const data = response.data.model
                // console.log({ data })
                setMentorTimeSlot(response.data.model);
            }).catch((err) => {
                console.log(err);
            });
            setComponentLoading(false)
        }
        // only load timeslot if user is mentor
        isMentor === "APPROVED" && fetchData()
    }, [currentDate])

    return (
        <div className=''>
            <div className='row'>
                <div className="col-12 col-md-6">
                    <h3 className="">Schedule Appointment</h3>
                </div>
                {
                    currentUser && <div className='col-12 col-md-6 menteeScheduleAppointmentDate'>
                        <button className="btn border" onClick={() => {
                            setActiveCalender(!activeCalender)
                        }}>{moment(currentDate).format('YYYY-MM-DD')}</button>

                    </div>
                }
                <div>
                    {
                        activeCalender && <div className=''>

                            <Calendar
                                onChange={onChangeCalenderDate}
                                defaultActiveStartDate={tomorrow._d}
                                className='calender w-100'
                                minDate={tomorrow._d} />
                        </div>
                    }
                </div>
            </div>
            {
                componentLoading ? (
                    <ComponentLoader />
                ) : (
                    <div className='p-3 row gap-2'>
                        {

                            mentorTimeSlot.length !== 0 ? (mentorTimeSlot.map((time, i) => (
                                <TimeSlot key={i} time={time} date={currentDate} />
                            ))) : <h3>No slots available</h3>
                        }
                    </div>
                )
            }
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});

export default connect(mapStateToProps)(MenteeScheduleAppointment)