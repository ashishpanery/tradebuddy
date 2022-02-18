import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import PageLoader from '../components/PageLoader/PageLoader'
import PersonalEvents from '../components/PersonalEvents/PersonalEvents'
import RegisteredEvents from '../components/RegisteredEvents/RegisteredEvents'
import './MyEvents.css'
import $ from "jquery"
import Helmet from 'react-helmet'
import { ErrorBoundary } from 'react-error-boundary'
import Error from './Error'

import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'

function MyEvents({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const [events, setEvents] = useState([])
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [openRegisteredEvents, setOpenRegisteredEvents] = useState(true)
    const token = currentUser && currentUser.token
    const mentorId = currentUser && currentUser.data.id

    $(function () {
        $("#nav_myEvents_item").addClass("nav_item_active");
    });

    const openRegisteredEventsComponent = () => {
        setOpenRegisteredEvents(true)
    }
    const closeRegisteredEventsComponent = () => {
        setOpenRegisteredEvents(false)
    }
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`${process.env.REACT_APP_MENTEE_EVENTS}/${currentUser.data.id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
                .then((response) => {
                    console.log(response)
                    setEvents(response.data.model)
                }).catch((err) => {
                    if (err.response.status === 401) {
                        history.push('/login/my-event')
                    }
                })
            setLoading(false)
        }
        currentUser && fetchData()
    }, [])

    const errorHandler = (error, errorInfo) => {
        console.log(error, errorInfo)
    }

    return (
        loading ?
            <PageLoader />
            :
            <>
                <header>
                    <Header />
                    <Helmet>
                        <title>{openRegisteredEvents ? "Registered Events" : "My Events"} - TradeBuddy  </title>
                        <meta name='description' content='Participate in Events and Learn Various New Technologies. Compete in Challenges and Earn Rewards.' charSet="utf-8" />
                    </Helmet>
                </header>
                <div className='container boxShadow my_events_container' style={{ minHeight: "50vh" }}>
                    <div className='my_events_navbar '>
                        <button className={`${openRegisteredEvents && 'activeButton'}`} onClick={openRegisteredEventsComponent}>Registered Events</button>
                        {currentUser.data.isMentor ? <button className={`${!openRegisteredEvents && 'activeButton'}`} onClick={closeRegisteredEventsComponent}>My Events</button> : null}
                    </div>
                    {
                        openRegisteredEvents ?
                            <ErrorBoundary FallbackComponent={Error} onError={errorHandler}>
                                <RegisteredEvents events={events} />
                            </ErrorBoundary>
                            :
                            <PersonalEvents mentorId={mentorId} token={token} />
                    }
                </div>
                <Footer />
            </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MyEvents)
