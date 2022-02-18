import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import Header from '../components/Header/Header'
import MenteeEducationTab from '../components/MenteeEducationTab/MenteeEducationTab';
import MenteeExperienceTab from '../components/MenteeExperiencetab/MenteeExperienceTab';
import MenteeProfileTab from '../components/MenteeProfileTab/MenteeProfileTab';
import MentorAboutMe from '../components/MentorAboutMe/MentorAboutMe';
import PageLoader from '../components/PageLoader/PageLoader';
import blueBackground from "../images/Group 537.png";

function MentorProfile({ currentUser }) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({})
    const [editable, setEditable] = useState(false)
    let { id } = useParams()
    useEffect(() => {
        const fetchData = async () => {
            const results = await axios.get(`${process.env.REACT_APP_GET_MENTOR_FOR_EVENTS}/${id}`, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
            console.log({ results })
            setData(results.data.model)
            id === currentUser.data.id ? setEditable(true) : setEditable(false)
            setLoading(false)
        }

        fetchData()
    }, [])

    console.log({ currentUser })
    if (loading) {
        return <PageLoader />
    } else {
        return (
            <>
                <div className='container pt-default'>
                    <Header />
                    <div className='menteeProfileTop'>
                        <img src={blueBackground} alt="" />
                    </div>
                    <div className=''>
                        <MenteeProfileTab info={data} edit={editable} />
                        <MentorAboutMe info={data.coverLine} edit={editable} />
                        <MenteeExperienceTab info={data} edit={editable} />
                        <MenteeEducationTab info={data} edit={editable} />
                    </div>
                </div>
                <Footer />
            </>
        )
    }
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MentorProfile)
