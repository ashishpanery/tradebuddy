import React, { useEffect, useState } from 'react'
import './MenteeProfileForm.css'
import { FaWindowClose } from "react-icons/fa";
import axios from 'axios';
import { connect } from 'react-redux';

function MenteeProfileForm1({ closeForm, menteeProfileData, updateData, currentUser }) {
    const [name, setName] = useState('')
    const [linkedInProfile, setLinkedInProfile] = useState('')
    const [email, setEmail] = useState('')
    const [contactNumber, setContactNumber] = useState('')
    const [headLine, setHeadLine] = useState('')
    const [currentCompany, setCurrentCompany] = useState('')
    const [designation, setDesignation] = useState('')
    const [totalExperienceYear, setTotalExperienceYear] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pinCode, setPinCode] = useState('')
    const [country, setCountry] = useState('')

    useEffect(() => {
        const assignDefaultValues = () => {
            if (menteeProfileData.name) {
                setName(menteeProfileData.name)
            }
            if (menteeProfileData.linkedinProfile) {
                setLinkedInProfile(menteeProfileData.linkedinProfile)
            }
            if (menteeProfileData.emailAddress) {
                setEmail(menteeProfileData.emailAddress)
            }
            if (menteeProfileData.phoneNumber) {
                setContactNumber(menteeProfileData.phoneNumber)
            }
            if (menteeProfileData.coverLine) {
                setHeadLine(menteeProfileData.coverLine)
            }
            if (menteeProfileData.currentCompany) {
                setCurrentCompany(menteeProfileData.currentCompany)
            }
            if (menteeProfileData.designation) {
                setDesignation(menteeProfileData.designation)
            }
            if (menteeProfileData.totalExperienceYears) {
                setTotalExperienceYear(menteeProfileData.totalExperienceYears)
            }
            if (menteeProfileData.city) {
                setCity(menteeProfileData.city)
            }
            if (menteeProfileData.state) {
                setState(menteeProfileData.state)
            }
            if (menteeProfileData.pinCode) {
                setPinCode(menteeProfileData.pinCode)
            }
            if (menteeProfileData.country) {
                setCountry(menteeProfileData.country)
            }
        }
        assignDefaultValues()
    }, [])

    const saveMenteeDetails = async () => {
        const reqObj = {
            ...menteeProfileData,
            name: name,
            currentCompany: currentCompany,
            designation: designation,
            phoneNumber: contactNumber,
            pinCode: pinCode,
            city: city,
            state: state,
            country: country,
            // emailAddress: email,
            totalExperienceYears: parseInt(totalExperienceYear),
            coverLine: headLine,
            linkedinProfile: linkedInProfile
        }
        await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, { ...reqObj }, {
            headers: {
                'Authorization': `Bearer ${currentUser.token}`
            }
        }).then((response => {
            // console.log(response)
            updateData(response.data.model)
            closeForm(false)
        }))
    }


    return (
        <div className='menteeProfileFormBackground container-fluid'>
            <div className='menteeProfileForm container'>
                <h1>Personal Details</h1>

                <div className='menteeProfileFormInput'>
                    <p>Full Name</p>
                    <input type='text' placeholder='Full Name' value={name} onChange={(e) => { setName(e.target.value) }} />
                </div>
                <div className='menteeProfileFormRow flex-column flex-md-row ms-2 ms-md-0'>
                    <div className='menteeProfileFormInput'>
                        <p>Email Address</p>
                        <input readOnly disabled type='email' value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
                    </div>
                    <div className='menteeProfileFormInput mt-3 mt-md-0'>
                        <p>Contact Number</p>
                        <input type='text' placeholder='Contact Number' value={contactNumber} onChange={(e) => { setContactNumber(e.target.value) }} />
                    </div>
                </div>

                <div className='menteeProfileFormRow flex-column flex-md-row ms-2 ms-md-0'>
                    <div className='menteeProfileFormInput'>
                        <p>Current Company</p>
                        <input type='text' placeholder='Current Company' value={currentCompany} onChange={(e) => { setCurrentCompany(e.target.value) }} />
                    </div>
                    <div className='menteeProfileFormInput mt-3 mt-md-0'>
                        <p>Designation</p>
                        <input type='text' placeholder='Designation' value={designation} onChange={(e) => { setDesignation(e.target.value) }} />
                    </div>
                </div>
                <div className='menteeProfileFormRow flex-column flex-md-row ms-2 ms-md-0'>
                    <div className='menteeProfileFormInput'>
                        <p>LinkedIn Profile</p>
                        <input type='text' placeholder='LinkedIn Profile' value={linkedInProfile} onChange={(e) => {
                            setLinkedInProfile(e.target.value)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput mt-3 mt-md-0'>
                        <p>Total Experience Year</p>
                        <input type='text' placeholder='Total Experience Years' value={totalExperienceYear} onChange={(e) => {
                            setTotalExperienceYear(e.target.value)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormRow'>
                    <div className='menteeProfileFormInput'>
                        <p>City</p>
                        <input type='text' placeholder='City' value={city} onChange={(e) => {
                            setCity(e.target.value)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput'>
                        <p>State</p>
                        <input type='text' placeholder='State' value={state} onChange={(e) => {
                            setState(e.target.value)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormRow'>
                    <div className='menteeProfileFormInput'>
                        <p>Pin Code</p>
                        <input type='text' placeholder='Pin Code' value={pinCode} onChange={(e) => {
                            setPinCode(e.target.value)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput'>
                        <p>Country</p>
                        <input type='text' placeholder='Country' value={country} onChange={(e) => {
                            setCountry(e.target.value)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormInput'>
                    <p>Describe Yourself</p>
                    <input type='text' placeholder='Describe your uniqueness' value={headLine} onChange={(e) => { setHeadLine(e.target.value) }} />
                </div>
                <div className="text-center pt-2">
                    <button className="btn" onClick={saveMenteeDetails}>Save Details</button>

                </div>
                <FaWindowClose className='menteeProfileFormCloseIcon' onClick={() => {
                    closeForm(false)
                }} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})
export default connect(mapStateToProps)(MenteeProfileForm1)
