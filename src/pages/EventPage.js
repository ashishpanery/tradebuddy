import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams, useLocation } from 'react-router-dom'
import { Footer, Header, PageLoader, RegistrationForm, UpcomingEventCard } from '../components'
import Lectures from "./Lectures"
import './EventPage.css'
import useRedirect from '../components/Redirect/Redirect'
import { Helmet } from 'react-helmet'
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'

function EventPage({ currentUser }) {
    const [eventDetails, setEventDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [showRegistrationPopup, setShowRegistrationPopup] = useState(false)
    let { id } = useParams()
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    const { handleError } = useHandleError(window.location.pathname)
    const [error, setError] = useState('')

    useEffect(() => {
        const getEventDetails = async () => {
            setLoading(true)
            await axios.get(`${process.env.REACT_APP_GET_EVENT_BY_ID}/${id}`)
                .then((response => {
                    if (response.data.code === 200)
                        setEventDetails(response.data.model)
                    else if (response.data.code === 404) {
                        setError(handleError(404, "event"))
                    }
                })).catch((err) => {
                    setError(handleError(err.response.status))
                })
            setLoading(false)
        }
        getEventDetails()
    }, [])


    const showPopup = () => {
        if (currentUser === null) {
            redirectWithLogin()
        } else {
            setShowRegistrationPopup(true);
            document.body.style.overflow = 'hidden'
        }
    }

    const hidePopup = () => {
        setShowRegistrationPopup(false)
        document.body.style.overflow = 'auto'
    }

    return (
        loading ? <PageLoader />
            :
            error ?
                <>
                    <Header />
                    <div className='d-flex flex-column justify-content-between mt-5 pt-5' style={{ minHeight: "100vh" }}>
                        <Helmet>
                            <title>Event Not Found - TradeBuddy  </title>
                            <meta name='description' content='Paricipate in Online Events Organized by Industry Experts.' charSet="utf-8" />
                        </Helmet>
                        {error}
                        <Footer />

                    </div>
                </>
                :
                <>
                    <header>
                        <Header />
                        <Helmet>
                            <title>{`${eventDetails?.eventTitle} | Events`} - TradeBuddy  </title>
                            <meta name='description' content='Paricipate in Online Events Organized by Industry Experts.' charSet="utf-8" />
                        </Helmet>
                    </header>
                    <main className='container mb-5' style={{ paddingTop: "7em" }}>
                        <div className='row mx-0 mx-sm-0'>
                            <UpcomingEventCard eventDetails={eventDetails} disabled={false} single_col={true} />
                        </div>
                        {
                            eventDetails.status === "EXPIRED" ? null :
                                <div className="row px-md-0 px-lg-2 mb-lg-0 mb-5">
                                    <div className="col-7 col-md-8 col-lg-8">
                                        <div className='eventPageRegisterTopLeft'>
                                            <h1>For experiencing such interesting and career oriented event</h1>
                                        </div>
                                    </div>
                                    <div className="col-5 col-md-4 col-lg-4 px-2">

                                        <div className='eventPageRegisterTopRight text-end'>
                                            {
                                                eventDetails.userRegistered ?
                                                    <button style={{ cursor: 'not-allowed' }} disabled>Already Registered</button> :
                                                    <button onClick={showPopup}>Register now</button>
                                            }
                                        </div>
                                        <div className='eventPageRegisterBottom'>
                                            <p>{eventDetails.bookedSeat ? eventDetails.bookedSeat : 0} people registered</p>
                                        </div>
                                    </div>
                                </div>
                        }
                        <div className={`row ${eventDetails.status === "EXPIRED" ? 'mt-2' : null}`} >
                            <div className="col-9 col-sm-12 eventPageAbout mx-auto mb-3">
                                <h1>About the event</h1>
                            </div>
                        </div>
                        <div className="row border rounded custom_box_shadow px-lg-3 container mx-auto py-5">
                            <div className="col-9 col-lg-12 mx-lg-0 w-100">
                                <div className='eventPageAbout'>
                                    <div className="mt-1" style={{ wordWrap: "break-word" }}
                                        dangerouslySetInnerHTML={{
                                            __html: eventDetails.description
                                        }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <Lectures id={id} eventDetails={eventDetails} />

                            </div>
                        </div>
                        {showRegistrationPopup &&
                            <RegistrationForm
                                hidePopup={hidePopup}
                                eventDetails={eventDetails}
                            />
                        }
                    </main>
                    <Footer />
                </>
    )
}


const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(EventPage)
