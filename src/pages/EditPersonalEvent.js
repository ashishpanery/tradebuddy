import React, { useState, useEffect } from 'react'
import axios from 'axios'
import EventForm from './EventForm'
import { useParams } from 'react-router'
import { Header, PageLoader } from '../components'
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"
import { connect } from 'react-redux'



function EditPersonalEvent({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [eventToModify, setEventToModify] = useState([])
    const [loading, setLoading] = useState(true)

    let { eventID } = useParams()
    if (eventID === "new")
        eventID = null
    useEffect(() => {
        const getEventData = async () => {
            await axios.get(`${process.env.REACT_APP_GET_EVENT_BY_ID}/${eventID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(resp => {
                    setEventToModify(resp.data.model)
                    setLoading(false)

                })
                .catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
        if (eventID) {
            getEventData()
        }
        else
            setLoading(false)

    }, [])
    console.log(eventToModify)

    if (loading) return <PageLoader />
    return <>
        <Header />
        <div className="py-5 my-5 ">
            <HandleAuthorization>
                <EventForm preloadedValues={eventID ? eventToModify : null} eventID={eventID} />
            </HandleAuthorization>
        </div>
    </>
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(EditPersonalEvent)
