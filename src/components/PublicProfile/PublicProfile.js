import React, { useEffect, useState } from 'react'
import '../../pages/MenteeProfile.css'
import blueBackground from "../../images/Group 537.png";
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import {
    MenteeProfileTab, MenteeExperienceTab,
    MenteeEducationTab,
    MentorAboutMe,
    MenteeProfileForm1,
    MenteeProfileForm2,
    MenteeProfileForm3,
    Header,
    Footer,
    PageLoader

} from "../../components"
// import MenteeInterests from '../MenteeInterests/MenteeInterests';

export default function PublicProfile() {
    const [menteeProfileData, setMenteeProfileData] = useState({})
    const [showPersonalDetails, setShowPersonalDetails] = useState(false)
    const [showEducationDetails, setShowEducationalDetails] = useState(false)
    const [showExperienceDetails, setShowExperienceDetails] = useState(false)
    const [experienceDetailsMode, setExperienceDetailsMode] = useState(false)
    const [educationDetailsMode, setShowEdicationDetailMode] = useState(false)
    const [experienceKey, setExperienceKey] = useState()
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    const { id } = useParams()

    useEffect(() => {
        const fetchMenteeProfile = async () => {
            await axios.get(`https://1rgco4uv03.execute-api.us-east-2.amazonaws.com/uat/profile/${id}`).then(menteeData => {
                console.log(menteeData)
                if (menteeData.data.code === 200) {
                    setMenteeProfileData(menteeData.data.model)
                } else {
                    alert(menteeData.data.message)
                }

            }).catch(err => {
                if (err.response) {
                    console.log(err.response)
                    if (err.response.status === 403) {
                        history.push('/login/profile')
                    }
                }
            })
            setLoading(false)
        }
        fetchMenteeProfile()
    }, [])

    const setKey = (index) => {
        console.log(index)
        setExperienceKey(index)
    }
    console.log(menteeProfileData)
    if (loading) {
        return <PageLoader />
    } else {
        return (
            <>
                <Header />
                <div className='menteeProfile'>
                    <div className='menteeProfileTop'>
                        <img src={blueBackground} alt="" />
                    </div>
                    <div className='menteeProfileContainer'>
                        <MenteeProfileTab info={menteeProfileData} showForm={setShowPersonalDetails} updateData={setMenteeProfileData} setMenteeProfileData={setMenteeProfileData} edit={false} />
                        <MentorAboutMe
                            info={menteeProfileData.coverLine}
                            edit={true}
                        />
                        <MenteeExperienceTab info={menteeProfileData} showForm={setShowExperienceDetails} formMode={setExperienceDetailsMode} setKey={setKey} edit={false} />
                        <MenteeEducationTab info={menteeProfileData} showForm={setShowEducationalDetails} formMode={setShowEdicationDetailMode} setKey={setKey} edit={false} />
                        {
                            showPersonalDetails && <MenteeProfileForm1 closeForm={setShowPersonalDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} edit={false} />
                        }
                        {
                            showEducationDetails &&
                            <MenteeProfileForm2 closeForm={setShowEducationalDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} formMode={educationDetailsMode} index={experienceKey} setFormMode={setShowEdicationDetailMode} edit={false} />
                        }
                        {
                            showExperienceDetails && <MenteeProfileForm3 closeForm={setShowExperienceDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} formMode={experienceDetailsMode} index={experienceKey} setFormMode={setExperienceDetailsMode} edit={false} />
                        }
                    </div>
                </div>
                <Footer />
            </>
        )
    }

}

