/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/jsx-no-duplicate-props */
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import avatar from '../../images/avatar.png'
import './Navbar.css'
// import logo from '../../images/new header logo.png'
import logo from '../../images/mentortalk.png'
import { connect } from 'react-redux'
import { removeUser } from '../../react-redux/reducers/allActions'
import { auth } from '../../firebase'
import down_chevron from "../../images/down-chevron.png"
import axios from 'axios'

function Navbar({ currentUser, removeUser }) {
    const [navBarActive, setNavBarActive] = useState(false)
    const [bootcampNames, setBootcampNames] = useState([])
    const [currentWindowSize, setCurrentWindowSize] = useState(window.screen.width)
    let userName = currentUser ? currentUser.data.name.split(" ") : ''


    useEffect(() => {
        const getBootcampNames = async () => {
            await axios.get(process.env.REACT_APP_GET_BOOTCAMP_DATA)
                .then(resp => setBootcampNames(resp.data.model))
                .catch(err => console.log(err))
        }
        getBootcampNames()
    }, [])

    useEffect(() => {
        window.addEventListener("resize", () => {
            setCurrentWindowSize(window.screen.width)

        })
    })
    let isAdmin = false
    const isMentor = currentUser ? currentUser.data.isMentor : false

    const history = useHistory()

    const signOut = () => {
        auth.signOut()
        removeUser()
    }

    const logoClick = () => {
        if (window.location.pathname === "/") window.scrollTo(0, 0)
        else
            history.push('/')
    }

    // is user is a mentor
    if (currentUser && currentUser.data.role !== null) {
        for (let i = 0; i < currentUser.data.role.length; i++) {
            if (currentUser.data.role[i].name === "admin") {
                isAdmin = true
                break
            }
        }
    }
    const changeHeaderOnScroll = () => {
        if (window.scrollY >= 2) {
            setNavBarActive(true)
        } else {
            setNavBarActive(false)
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', changeHeaderOnScroll)
        // to prevent mount/unmount/memory leak issue 
        // return window.removeEventListener('scroll', changeHeaderOnScroll)

    }, [])
    return (
        <>
            <div className={`container-fluid navbar_container ${navBarActive > 0 ? 'bg-white boxShadow' : null} `} >
                <nav className={`navbar navbar-expand-lg navbar-light nav-w mx-md-auto container`} style={{ minHeight: "60px" }}>
                    <div className="container-fluid ">
                        {/* <img className="navbar-brand" src={logo} alt='logo' onClick={logoClick} /> */}
                        <h3>TradeBuddy</h3>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav align-items-lg-center ms-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a id="nav_home_item" className="nav-link active hover-underline-animation" aria-current="page" href="/">Home</a>
                                </li>
                                <li className="nav-item dropdown drop_down_menu"> {/* services dropdown menu */}
                                    <a id="nav_services_item" className="nav-link active hover-underline-animation d-flex justify-content-center align-items-center gap-1" href="#" id="navbarDropdown_services" role="button" data-bs-toggle="dropdown" aria-expanded="false"> Services <img className="nav_down_arrow" style={{ height: "8px", width: "8px" }} src={down_chevron} alt="" /></a>
                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown_services">
                                        <li><a className="dropdown-item" href="/mentor-list">1-O-1 Sessions</a></li>
                                        <li className="dropdown_bootcamp">
                                            {
                                                currentWindowSize > 991 ?
                                                    <a className="dropdown-item  d-flex align-items-center gap-2" href="/services/bootcamp">Bootcamp <img className="d-flex" style={{ height: "8px", width: "8px", transform: "rotateZ(-90deg)" }} src={down_chevron} alt="" /> </a> :
                                                    <a className="dropdown-item cursor-pointer  d-flex align-items-center gap-2">Bootcamp <img className="d-flex" style={{ height: "8px", width: "8px", transform: "rotateZ(-90deg)" }} src={down_chevron} alt="" /> </a>
                                            }
                                            <ul className="dropdown-menu_bootcamp border bg-white dropdown-submenu p-0 m-0">
                                                {
                                                    bootcampNames.map((item, index) => {
                                                        const { name } = item
                                                        return <li key={index}>
                                                            <a className="dropdown-item " href={`/services/bootcamp/${name}`}>{item.title}</a>
                                                        </li>
                                                    })
                                                }
                                            </ul>
                                        </li>

                                        <li><a id="nav_services_mockInterviews_item" className="dropdown-item" href="/mock-interviews">Mock Interviews</a></li>
                                        <li><a id="nav_services_resumeReview_item" className="dropdown-item" href="/resume-review">Resume Review</a></li>
                                        <li><a id="nav_services_meetUps_item" className="dropdown-item" href="/meet-ups">Meet Ups</a></li>

                                    </ul>
                                </li>
                                <li className="nav-item">
                                    <a id="nav_courses_item" className="nav-link active hover-underline-animation" href="/courses">Courses</a>
                                </li>
                                <li className="nav-item">
                                    <a id="nav_events_item" className="nav-link active hover-underline-animation" href="/events">Events</a>
                                </li>
                                <li className="nav-item ">
                                    <a className="nav-link active hover-underline-animation" href="/mentor-list">Experts</a>
                                </li>
                                {
                                    !isMentor && <li className="nav-item">
                                        <a id="nav_become-mentor_item" className="nav-link active hover-underline-animation" href="/become-mentor">Become Mentor</a>
                                    </li>
                                }
                                {/* profile */}
                                <li className="nav-item  dropdown profileImage ">
                                    {
                                        currentUser !== null ?
                                            currentUser.data.photoUrl === null ?
                                                <img src={avatar} alt='' className="nav-link active" id="navbarDropdown_profile" role="button" data-bs-toggle="dropdown" aria-expanded="false" />
                                                :
                                                <img src={currentUser.data.photoUrl} alt='' className="nav-link active" id="navbarDropdown_profile" role="button" data-bs-toggle="dropdown" aria-expanded="false" />
                                            :
                                            <button onClick={() => history.push('/login')} className="my-2 mx-3 btn btn_get_started">Login</button>
                                    }

                                    {
                                        currentUser && <ul className="dropdown-menu" aria-labelledby="navbarDropdown_profile">
                                            <li >
                                                {isAdmin && <a className="dropdown-item " href='/portal'>Admin Portal</a>}
                                            </li>
                                            {
                                                isMentor && <>
                                                    <li><a className="dropdown-item" href='/dashboard'>Mentor Dashboard</a></li>
                                                    <li><a className="dropdown-item" href='/timeslot'>Time Slot</a></li>
                                                    <li><a className="dropdown-item" href='/mentor_sessions'>Sessions</a></li>

                                                </>
                                            }
                                            {
                                                !isMentor &&
                                                <li><a className="dropdown-item" href='/sessions'>Sessions</a></li>
                                            }
                                            <li><a className="dropdown-item" href={`/profile/${currentUser.data.id}/${userName.join("-")}`}>My Profile</a></li>
                                            <li><a className="dropdown-item" href='/my-events'>My Events</a></li>
                                            {<li><a className="dropdown-item" href='/my-courses'>My Courses</a></li>}
                                            <li><a className="dropdown-item" href='/orders'>Order History</a></li>
                                            <li><a className="dropdown-item" href='/' onClick={signOut}>Log Out</a></li>

                                        </ul>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>

        </>
    )
}
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})
const mapDispatchToProps = (dispatch) => ({
    removeUser: () => dispatch(removeUser())
})
export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
