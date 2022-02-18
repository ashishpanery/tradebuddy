import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import './Sessions.css'
import SessionMentorCard from "../components/SessionMentorCards/SessionMentorCard";
import axios from "axios";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import $ from "jquery"
import Helmet from "react-helmet"
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { Footer, Pagination } from "../components"
import { PaginationLoader } from "../components/Spinner/Spinner";
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler";

function Sessions({ currentUser }) {
  const history = useHistory()
  const location = useLocation().pathname
  const redirectWithLogin = useRedirect(location)
  if (!currentUser) redirectWithLogin()
  if (currentUser?.data.isMentor) history.push(`/mentor_sessions`)
  const [activeButton, setActiveButton] = useState('ACCEPTED')
  const [sessionCardDetails, setSessionCardDetails] = useState([])
  const [loading, setloading] = useState(false)
  const [updatingSession, setUpdatingSession] = useState(false)
  const [error, setError] = useState('')
  const { handleError } = useHandleError(location)

  const fetchData = async () => {
    setloading(true)
    await axios.post(`${process.env.REACT_APP_MENTEE_SESSION_URL}/${currentUser?.data.id}`,
      {
        pageNo: 1,
        pageSize: 10,
        sort: "experience"
      }, {
      headers: {
        Authorization: `Bearer ${currentUser?.token}`
      }
    })
      .then(response => {
        setSessionCardDetails(response.data.model)
        setloading(false)

        console.log(sessionCardDetails)
      }).catch((err) => {
        setError(handleError(err.response.status))
        setloading(false)

      })
  }


  $(function () {
    $("#nav_session_item").addClass("nav_item_active");
  });

  return <>
    <header>
      <Header />
      <Helmet>
        <title>Mentee Sessions | TradeBuddy  </title>
        {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Fetures: Chat, Audio and Video Call using Sessions, Event Particiaption  ' charSet="utf-8" /> */}
      </Helmet>
    </header>
    <div className="container mx-auto mt-5 pt-5" style={{ minHeight: "100vh" }}>
      <div className="d-flex align-items-start gap-3 justify-content-center">
        <h3 className="text-center mb-3 ">My Sessions</h3>
        <div style={{ visibility: `${updatingSession ? "visible" : "hidden"}` }}>
          <PaginationLoader />

        </div>
      </div>
      <div className="sessionContainer">
        <div className="sessionContainerMain">
          <div className='sessionContainerMainButtons'>
            <button className={activeButton === 'REQUEST_PENDING' ? 'activeSessionButtons' : 'inActiveSessionButtons'} onClick={() => {
              setActiveButton('REQUEST_PENDING')
            }}>Outgoing</button>
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
          <div className='sessionContainerMainLists'>
            {
              loading ?
                <PaginationLoader />
                :
                error ? error :
                  sessionCardDetails.length !== 0 ?
                    sessionCardDetails.map((details, i) => (
                      <SessionMentorCard key={i} details={details} fetchData={fetchData} setUpdatingSession={setUpdatingSession} />
                    )) :
                    <h3 className="text-center">No data available</h3>

            }
          </div>
        </div>
      </div>
    </div>
    <div className="w-80 mt-0 pt-0 mx-auto pb-3 bg-white" style={{ maxWidth: "1600px" }} >
      <Pagination
        url={`${process.env.REACT_APP_GET_MENTEE_SESSIONS}${currentUser?.data.id}/${activeButton}`}
        dataList={sessionCardDetails}
        setDataList={setSessionCardDetails}
        setLoading={setloading}
        activeButton={activeButton}
        sort="startDate"
      />
    </div>
    <Footer />
  </>
}
const mapStateToProps = state => ({
  currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(Sessions);
