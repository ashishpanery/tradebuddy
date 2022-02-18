import React, { useEffect, useState } from 'react'
import "./TimeSlot.css"
import axios from 'axios'
import { Header, PageLoader } from '../components'
import { connect } from "react-redux"
import Helmet from "react-helmet"
import $ from "jquery"
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'

function TimeSlot({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [isLoading, setIsLoading] = useState(true)
    const [defaultTimeslot, setDefaultTimeslot] = useState([])
    const [timeSlotUsingPost, setTimeSlotUsingPost] = useState([])
    const [updateTimeslot, setUpdateTimeslot] = useState('Update Timeslots')
    const [saveSuccessful, setSaveSuccessful] = useState(false)
    const { handleError } = useHandleError(location)
    const [timeslotError, setTimeslotError] = useState('')

    $(function () {
        $("#nav_timeslot_item").addClass("nav_item_active");
    });

    useEffect(() => {
        const fetchData = async () => {
            try {

                //get default time slots
                await axios.get(`${process.env.REACT_APP_GET_MENTOR_DEFAULT_TIMESLOT}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(resp => setDefaultTimeslot(resp.data.model.days))

                // Get time slot using post
                await axios.post(`${process.env.REACT_APP_GET_TIMESLOT_USING_POST}`,
                    {
                        mentorId: currentUser.data.id
                    }
                    ,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then(resp => {
                        setTimeSlotUsingPost(resp.data.model.days)
                        setIsLoading(false)

                    })

            } catch (error) {
                console.log(error)
                setTimeslotError(handleError(error))
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const showSaveSuccess = () => {
        setSaveSuccessful(true)
        setUpdateTimeslot("Update Timeslots")
        setTimeout(() => {
            setSaveSuccessful(false)
        }, 2500)

    }

    // use default and occupied time slots to filter the data
    let occupied = new Set()

    // add the occupied slots in the set
    timeSlotUsingPost.forEach(item => {
        for (let i = 0; i < item.timeslots.length; i++) {
            occupied.add(`${item.day}_${item.timeslots[i].slot}`)
        }

    })

    //switch between occupied and available timeslot on button click
    const toggleClick = (e) => {
        e.target.classList.toggle("occupied")
        let btn_class = e.target.classList
        if (btn_class.contains("occupied"))
            occupied.add(e.target.id)
        else
            occupied.delete(e.target.id)
    }

    // save the changes by sending data to the server
    const saveChanges = async () => {
        setUpdateTimeslot("Saving changes...")
        const all_slot_btns = document.getElementById("accordionTimeSlot")
        const all_btns = all_slot_btns.getElementsByTagName("button")

        let final = []
        const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for (let i = 0; i < 7; i++) {
            let days = {}
            days.day = weekDays[i]
            let timeslots = []

            for (let btn of all_btns) {
                if (btn.classList.contains("occupied")) {
                    let btnDay = btn.id.split('_')[0]
                    let btnSlot = btn.id.split('_')[1]
                    if (btnDay === weekDays[i]) {
                        timeslots.push({ slot: btnSlot, status: "Available" })
                    }
                }
            }
            days.timeslots = timeslots
            final.push(days)
        }
        const days = { days: final, mentorId: currentUser.data.id }

        //send the data to server
        try {
            await axios.post(`${process.env.REACT_APP_SAVE_MENTOR_TIMESLOT}`,
                days
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(resp => {
                    showSaveSuccess()
                    setTimeSlotUsingPost(resp.data.model.days)
                })

        } catch (error) {
            console.log(error);
        }


    }
    return (

        isLoading ?
            <div className="my-5">
                <PageLoader />
            </div>
            :
            <>
                <header>
                    <Helmet>
                        <meta charSet="utf-8" />
                        <title>Update Timeslot - TradeBuddy  </title>
                    </Helmet>
                    <Header />
                </header>
                <HandleAuthorization>
                    <div className="container pt-default">
                        <div className="my-5">
                            <h3 className="text-center">Your availability and time slots.</h3>
                            <h6 className="text-center">You will be spending 30 mins bi-weekly with each mentee. </h6>
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="blue-box border"></div><span>Available</span>
                                <div className="green-box"></div><span>Booked</span>
                            </div>
                            <div className="accordion mt-5" id="accordionTimeSlot">
                                {
                                    timeslotError ? timeslotError :
                                        defaultTimeslot.map(timeslot => {
                                            const id = defaultTimeslot.indexOf(timeslot)
                                            const dataTarget = `#timeslot_${id}`
                                            const dataTargeted = `timeslot_${id}`
                                            return <div className="accordion-item my-2" key={id}>
                                                <h2 className="accordion-header" id="headingOne">
                                                    <div className="accordion-button accordion-timeslot" data-bs-toggle="collapse" data-bs-target={dataTarget} aria-expanded="true" aria-controls="collapseOne">
                                                        <div className="d-flex mx-4 fw-bold fs-4">
                                                            {timeslot.day}
                                                        </div>
                                                    </div>
                                                </h2>
                                                <div id={dataTargeted} className="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionTimeSlot">
                                                    <div className="accordion-body">
                                                        <div className="row row-cols-3 row-cols-md-6 row-cols-lg-12 justify-content-center">
                                                            {timeslot.timeslots.map((time, index) => {
                                                                const btn_id = `${timeslot.day}_${time.slot}`
                                                                let btnclass = `col text-center available py-2 fs-5 timeslot-btn custom-w-timeslot  mx-1 my-1 border ${occupied.has(btn_id) ? 'occupied' : 'available-on-timeslot'} `

                                                                return <button key={index} onClick={(e) => toggleClick(e)} id={btn_id} className={btnclass}>{time.slot}</button>
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                            </div>
                            {
                                !timeslotError &&
                                <div className="d-flex align-items-center flex-column">
                                    <button onClick={() => saveChanges()} className="save_changes">{updateTimeslot}</button>
                                    {
                                        saveSuccessful ? <p className="ss">Changes have been saved</p> : <p className="ss"></p>
                                    }
                                </div>
                            }
                        </div>
                    </div>
                </HandleAuthorization>
            </>
    )
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(TimeSlot)