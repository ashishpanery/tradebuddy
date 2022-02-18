import React, { useEffect, useRef, useState } from 'react'
import './MenteeProfileForm.css'
import { FaWindowClose } from "react-icons/fa";
import { connect } from 'react-redux';
import axios from 'axios';
import moment from 'moment';

// Mentee Education form
function MenteeProfileForm2({ closeForm, menteeProfileData, updateData, currentUser, formMode, index, setFormMode }) {
    const [schoolName, setSchoolName] = useState('')
    const [degree, setDegree] = useState('')
    const [startYear, setStartYear] = useState('')
    const [endYear, setEndYear] = useState('')
    const [study, setStudy] = useState('')
    const [grade, setGrade] = useState('')
    // const currentlyStudying = useRef()
    const [description, setDescription] = useState('')


    const saveEducationalDetails = async () => {
        console.log(schoolName, degree, startYear, endYear, study, grade)
        if (!formMode) {
            var data = []
            if (menteeProfileData.educationProfile !== null) {

                data = menteeProfileData.educationProfile;
            }
            var temp = {}
            temp.id = menteeProfileData.id;
            temp.school = schoolName
            temp.degree = degree
            temp.startYear = startYear
            temp.endDate = endYear
            temp.grade = grade
            temp.fieldOfStudy = study
            temp.description = description

            data.push(temp)
            console.log(data)
            const reqObj = { ...menteeProfileData, educationProfile: data }
            await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                ...reqObj
            }, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((response => {
                console.log("Adding Successful in FOrm 2", response)
                updateData(response.data.model)
                closeForm(false)
            }))

        } else {
            temp = menteeProfileData.educationProfile;
            temp[index].school = schoolName
            temp[index].degree = degree
            temp[index].startYear = startYear
            temp[index].endDate = endYear
            temp[index].description = description
            temp[index].grade = grade
            temp[index].fieldOfStudy = study
            const reqObj = { ...menteeProfileData, educationProfile: temp }

            await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                ...reqObj
            }, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((response => {
                console.log("Adding Successful in FOrm 2", response)
                updateData(response.data.model)
                closeForm(false)
                setFormMode(false)
            }))
        }

    }
    useEffect(() => {
        if (formMode) {
            var data = menteeProfileData.educationProfile[index]
            setSchoolName(data.school)
            setDegree(data.degree)
            setStartYear(data.startYear)
            setEndYear(data.endDate)
            setGrade(data.grade)
            setStudy(data.fieldOfStudy)
            setDescription(data.description)

        }
    }, [])

    return (
        <div className='menteeProfileFormBackground container-fluid'>
            <div className='menteeProfileForm container'>
                <h1>Educational Details</h1>
                <div className='menteeProfileFormInput'>
                    <p>School Name</p>
                    <input type='text' value={schoolName} placeholder='School Name' onChange={(e) => {
                        setSchoolName(e.target.value)
                    }} />
                </div>
                <div className='menteeProfileFormInput'>
                    <p>Degree</p>
                    <input type='text' value={degree} placeholder='Degree' onChange={(e) => {
                        setDegree(e.target.value)
                    }} />
                </div>
                <div className='menteeProfileFormRow'>
                    <div className='menteeProfileFormInput'>
                        <p>Start Year</p>
                        <input type='date' value={startYear} placeholder='Start Year' onChange={(e) => {
                            var date = moment(e.target.value).format('YYYY-MM-DD')
                            setStartYear(date)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput'>
                        <p>End Year</p>
                        <input type='date' value={endYear} placeholder='End Year' onChange={(e) => {
                            var date = moment(e.target.value).format('YYYY-MM-DD')
                            setEndYear(date)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormRow'>
                    <div className='menteeProfileFormInput'>
                        <p>Field of Study</p>
                        <input type='text' value={study} placeholder='Field' onChange={(e) => {
                            setStudy(e.target.value)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput'>
                        <p>Grade</p>
                        <input type='text' value={grade} placeholder='Grade' onChange={(e) => {
                            setGrade(e.target.value)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormInput'>
                    <p>Description</p>
                    <textarea value={description} rows="8" placeholder="Main subects, achievements etc." onChange={(e) => {
                        setDescription(e.target.value)
                    }} />
                </div>
                <div className="text-center pt-2">
                    <button className="btn" onClick={saveEducationalDetails}>Save Details</button>
                </div>
                <FaWindowClose className='menteeProfileFormCloseIcon' onClick={() => {
                    closeForm(false)
                    setFormMode(false)
                }} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})

export default connect(mapStateToProps)(MenteeProfileForm2)
