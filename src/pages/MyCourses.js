import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import PageLoader from '../components/PageLoader/PageLoader'
import PersonalCourses from '../components/PersonalCourses/PersonalCourses'
import RegisteredCourses from '../components/RegisteredCourses/RegisteredCourses'
import './MyCourses.css'
import $ from "jquery"
import { Helmet } from 'react-helmet'

import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'



function MyCourses({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser && currentUser.token
    const [courses, setCourses] = useState([])
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [openRegisteredCourses, setOpenRegisteredCourses] = useState(true)
    $(function () {
        $("#nav_myCourses_item").addClass("nav_item_active");
    });

    const mentorId = currentUser && currentUser.data.id

    const openRegisteredEventsComponent = () => {
        setOpenRegisteredCourses(true)
    }
    const closeRegisteredEventsComponent = () => {
        setOpenRegisteredCourses(false)
    }
    useEffect(() => {
        const fetchData = async () => {
            await axios.get(`${process.env.REACT_APP_GET_ALL_COURSE_BY_MENTOR_ID}/${currentUser.data.id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
                .then((response) => {
                    console.log(response)
                    setCourses(response.data.model)
                }).catch((err) => {
                    if (err.response.status === 401) {
                        history.push('/login/my-courses')
                    }
                })
            setLoading(false)
        }
        currentUser && fetchData()
    }, [])
    return (
        loading ?
            <PageLoader />
            :
            <>
                <header>
                    <Header />
                    <Helmet>
                        <title>{openRegisteredCourses ? "Registered Courses" : "My Courses"} - TradeBuddy  </title>
                        <meta name='description' content='Online platform to connect and get crafted advice from experts. Fetures: Chat, Audio and Video Call using Sessions, Event Particiaption  ' charSet="utf-8" />
                    </Helmet>

                </header>
                <div className='container  boxShadow my_courses_container'>
                    {
                        <>
                            <div className='my_courses_navbar '>
                                <button className={`${openRegisteredCourses && 'activeButton'}`} onClick={openRegisteredEventsComponent}>Registered courses</button>
                                {currentUser.data.isMentor ? <button className={`${!openRegisteredCourses && 'activeButton'}`} onClick={closeRegisteredEventsComponent}>My courses</button> : null}
                            </div>

                            {
                                openRegisteredCourses ? <RegisteredCourses courses={courses} /> : <PersonalCourses mentorId={mentorId} token={token} />
                            }
                        </>
                    }
                </div>
                <Footer />
            </>
    )
}


const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MyCourses)
