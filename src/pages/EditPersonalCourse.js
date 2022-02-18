import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CourseForm from './CourseForm'
import { useParams } from 'react-router'
import { Header, PageLoader } from '../components'
import { connect } from 'react-redux'
import { useLocation } from "react-router-dom"
import useRedirect from '../components/Redirect/Redirect'
import { HandleAuthorization } from "../pages"


function EditPersonalCourse({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    if (!currentUser) redirectWithLogin()
    const token = currentUser?.token
    const [courseToModify, setCourseToModify] = useState([])
    const [loading, setLoading] = useState(true)

    let { courseID } = useParams()
    if (courseID === "new")
        courseID = null
    useEffect(() => {
        const getCourseData = async () => {
            await axios.get(`${process.env.REACT_APP_GET_COURSE_BY_ID}/${courseID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(resp => {
                    let obj = resp.data.model
                    obj.paymentType = obj.fee !== "0" ? "Paid" : "Free"
                    setCourseToModify(obj)
                    setLoading(false)

                })
                .catch(err => {
                    console.log(err);
                    setLoading(false)
                })
        }
        if (courseID) {
            getCourseData()
        }
        else
            setLoading(false)

    }, [])
    console.log({ courseToModify })

    if (loading) return <PageLoader />
    return <>
        <Header />
        <div className="py-5 my-5">
            <HandleAuthorization>
                <CourseForm preloadedValues={courseID ? courseToModify : null} courseID={courseID} />
            </HandleAuthorization>
        </div>
    </>
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(EditPersonalCourse)
