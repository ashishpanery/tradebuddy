import { useState, useEffect } from "react"
import moment from "moment"
import Calendar from "react-calendar"
import axios from "axios";
import { PaginationLoader } from "../Spinner/Spinner";
import useHandleError from "../Handlers/ErrorHandler/ErrorHandler";

export default function SessionRescheduler({ currentUser, details, setSuccess, saving, setSaving }) {
    const tomorrow = moment().add(1, 'days');
    const [activeCalender, setActiveCalender] = useState(false)
    const [newTime, setNewTime] = useState('')
    const [currentDate, setCurrentDate] = useState(moment(tomorrow).format('YYYY-MM-DD'))
    const [newDate, setNewDate] = useState(currentDate)
    const [newTimeError, setNewTimeError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [mentorTimeslots, setMentorTimeslots] = useState([])
    const { handleError } = useHandleError(window.location.pathname)
    const [error, setError] = useState('')

    useEffect(() => {
        const getMentorTimeslot = async () => {
            setLoading(true)
            // Get time slot using post
            await axios.post(`${process.env.REACT_APP_GET_TIMESLOT_USING_POST}`, {
                mentorId: currentUser.data.id,
                date: `${currentDate}`
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
                .then(resp => {
                    // console.log(resp.data.model)
                    setMentorTimeslots(resp.data.model)
                    setLoading(false)
                })
                .catch(err => setError(handleError(err.response.status)))
        }
        getMentorTimeslot()
    }, [currentDate])

    const onChangeCalenderDate = (event) => {
        var formattedCalenderDate = moment(event).format('YYYY-MM-DD')
        setNewDate(formattedCalenderDate)
        setCurrentDate(formattedCalenderDate)
        setActiveCalender(false)
    }

    const rescheduleSession = async (data) => {
        // get the full session instance
        await axios.get(`${process.env.REACT_APP_GET_SESSION_BY_ID}/${details.id}`, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then(async (resp) => {
            if (newTime === '') {
                setNewTimeError(true)
                return
            }
            setSaving(true)
            let temp = resp.data.model
            temp.status = "ACCEPTED" ? "ACCEPTED" : "REQUEST_PENDING"
            temp.startDate = newDate
            temp.startTime = newTime
            console.log({ temp })
            await axios.post(`${process.env.REACT_APP_SAVE_SESSION}`,
                temp, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((resp) => {
                console.log(resp.data)
                if (resp.data.code === 200) {
                    setSaving(false)
                    setSuccess(true)
                }
                // window.location.reload();
            })
        })
    }

    return (
        error ? error :
            <>
                <div className='py-2 col-12'>
                    <h3>Choose your date:</h3>

                </div>
                <div className='col-12 col-md-6 '>
                    <button className="btn border" onClick={() => {
                        setActiveCalender(!activeCalender)
                    }}>{moment(currentDate).format('YYYY-MM-DD')}</button>

                </div>
                <div className={` col-12 mb-5 bg-white`}>
                    {activeCalender && <Calendar

                        onClickDay={() => setNewTimeError(false)}
                        onChange={onChangeCalenderDate}
                        defaultActiveStartDate={tomorrow._d}
                        className='calender w-100'
                        minDate={tomorrow._d} />}
                </div>

                <div className='row'>
                    {
                        loading ?
                            <PaginationLoader />
                            :
                            mentorTimeslots.length > 0 ? mentorTimeslots.map((timeslot, i) => {
                                return <div className={`text-center col-4 flex-wrap`} key={i}>
                                    <p
                                        onClick={(e) => {
                                            setNewTime(timeslot.slot)
                                            setNewTimeError(false)
                                        }
                                        }
                                        style={{ borderRadius: "1em" }}
                                        className={`${newTime === timeslot.slot ? "occupied" : "available"} border rescheduleTimeslotBtn cursor-pointer py-1 px-3`}>{timeslot.slot}</p>
                                </div>
                            })
                                :
                                <div className="col-12">
                                    <p className='text-center' >No timeslots available</p>

                                </div>
                    }
                </div>
                {newTimeError && <p className="text-danger">Please pick a timeslot.</p>}

                <div className="modal-footer mt-3">
                    <button type="submit" className="btn" onClick={() => rescheduleSession()}>{saving ? <PaginationLoader /> : 'Save changes'}</button>
                    <button type="button" className="btn " data-bs-dismiss="modal">Close</button>
                </div>
            </>
    )
}

