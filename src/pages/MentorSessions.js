import React, { useEffect, useState } from "react";
import { Header, SessionMentorCards, Pagination } from "../components";
import './Sessions.css'
import axios from "axios";
import { connect } from "react-redux";
import "./MentorSessions.css"
import $ from "jquery"
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom"
import { HandleAuthorization } from "../pages"
import useRedirect from '../components/Redirect/Redirect'
import { PaginationLoader } from "../components/Spinner/Spinner";
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler";

function MentorSessions({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser && currentUser.token
    const [activeButton, setActiveButton] = useState('REQUEST_PENDING')
    const [sessionCardDetails, setSessionCardDetails] = useState([])
    const [sessionType, setSessionType] = useState('')
    const [loading, setloading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const [pages, setPages] = useState([1])
    const mentor_session_url = `${process.env.REACT_APP_MENTOR_SESSION_URL}/${currentUser?.data.id}`
    const mentee_session_url = `${process.env.REACT_APP_MENTEE_SESSION_URL}/${currentUser?.data.id}`
    const [sessionUrl, setSessionUrl] = useState(mentee_session_url)
    const [updatingSession, setUpdatingSession] = useState(false)
    const { handleError } = useHandleError(location)
    const [error, setError] = useState('')

    $(function () {
        $("#nav_session_item").addClass("nav_item_active");
    });

    const fetchData = async () => {
        setloading(true)
        if (sessionUrl === mentor_session_url) {
            console.log("calling mentor api")
            await axios.post(`${mentor_session_url}/${activeButton}`,
                {
                    pageNo: 1,
                    pageSize: 5,
                    sort: "experience"
                }
                , {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(response => {
                    setSessionType("mentor")
                    setSessionCardDetails(response.data.model)
                    setloading(false)
                }).catch((err) => {
                    setError(handleError(err.response.status))
                })
        }
        else if (sessionUrl === mentee_session_url) {
            console.log("calling mentee api")
            await axios.post(`${mentee_session_url}/${activeButton}`,
                {
                    pageNo: 1,
                    pageSize: 5,
                    sort: "experience"
                }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    setSessionType("mentee")
                    setSessionCardDetails(response.data.model)
                    setloading(false)
                }).catch((err) => {
                    setError(handleError(err.response.status))
                })
        }
    }
    useEffect(() => {
        currentUser && fetchData()
    }, [activeButton, sessionUrl, mentor_session_url, mentee_session_url])

    const handleClick = (url, e) => {
        e.target.classList.toggle("active")
        console.log(url)
        setSessionUrl(url)
    }
    return (
        <>
            <header>
                <Helmet>
                    <title>Mentor Sessions - TradeBuddy  </title>
                    {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Fetures: Chat, Audio and Video Call using Sessions, Event Particiaption  ' charSet="utf-8" /> */}
                </Helmet>
                <Header />
            </header>
            <HandleAuthorization>
                <div className="d-flex flex-column justify-content-between mt-5 pt-default" style={{ minHeight: "100vh" }}>
                    <div className="container">
                        <div className="d-flex align-items-start gap-3 justify-content-center">
                            <h3 className="text-center mb-3 ">My Sessions</h3>
                            <div style={{ visibility: `${updatingSession ? "visible" : "hidden"}` }}>
                                <PaginationLoader />

                            </div>
                        </div>
                        <div className="sessionContainer">
                            <div className="sessionContainerMain">
                                <div className='sessionContainerMainButtons'>
                                    <div className="sessionContainerMainButtons">
                                        <button className={activeButton === 'REQUEST_PENDING' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
                                            setActiveButton('REQUEST_PENDING')
                                        }}>Pending</button>
                                        <button className={activeButton === 'ACCEPTED' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
                                            setActiveButton('ACCEPTED')
                                        }}>Accepted</button>
                                        <button className={activeButton === 'CANCELLED' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
                                            setActiveButton('CANCELLED')
                                        }}>Cancelled</button>
                                        <button className={activeButton === 'COMPLETED' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
                                            setActiveButton('COMPLETED')
                                        }}>Completed</button>
                                        <button className={activeButton === 'STARTED' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
                                            setActiveButton('STARTED')
                                        }}>Started</button>
                                    </div>
                                    <div className="me-auto ms-xl-auto d-flex justify-content-between align-items-center view_sesions_as">
                                        <h5>View As</h5>
                                        <div className="ms-3 dropdown">
                                            <div className="btn session_button dropdown-toggle" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">{sessionType}</div>
                                            <ul id="drop_down_session_menu" className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                <li><button onClick={(e) => handleClick(mentee_session_url, e)} className={sessionUrl === mentee_session_url ? "dropdown_item dropdown_active" : "dropdown_item"} >Mentee</button></li>
                                                <li><button onClick={(e) => handleClick(mentor_session_url, e)} className={sessionUrl === mentor_session_url ? "dropdown_item border-bottom dropdown_active" : "dropdown_item border-bottom"} >Mentor</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    {
                                        loading ?
                                            <PaginationLoader />
                                            :
                                            error ? error :
                                                sessionCardDetails && sessionCardDetails.length !== 0 ?
                                                    sessionCardDetails.map((details, i) => (
                                                        <div className="col-xxl-6 col-12" key={i}>
                                                            <SessionMentorCards key={i} details={details} fetchData={fetchData} sessionType={sessionType} setUpdatingSession={setUpdatingSession} />
                                                        </div>
                                                    )) :
                                                    <h3 className="text-center text-dark">No data available</h3>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
                    <Pagination
                        url={`${process.env.REACT_APP_GET_MENTEE_SESSIONS}${currentUser?.data.id}/${activeButton}`}
                        dataList={sessionCardDetails}
                        setDataList={setSessionCardDetails}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pages={pages}
                        setPages={setPages}
                        setLoading={setloading}
                        activeButton={activeButton}
                    />
                </div>
            </HandleAuthorization>
        </>
    );
}
const mapStateToProps = state => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MentorSessions);