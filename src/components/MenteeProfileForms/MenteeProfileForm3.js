import React, { useEffect, useRef, useState } from 'react'
import './MenteeProfileForm.css'
import { FaWindowClose } from "react-icons/fa";
import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';

// Mentee Experience Form
function MenteeProfileForm3({ closeForm, menteeProfileData, updateData, currentUser, formMode, index, setFormMode }) {
    const [companyName, setCompanyName] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [currentlyWorking, setCurrentlyWorking] = useState()
    const [companyList, setCompanyList] = useState([])

    const saveExperienceDetails = async () => {
        // console.log(companyName)

        if (!formMode) {
            var data = []
            if (menteeProfileData.exprienceProfile !== null) {

                data = menteeProfileData.exprienceProfile;
            }

            var temp = {}
            temp.id = menteeProfileData.id;
            temp.company = companyName
            temp.jobTitle = jobTitle
            temp.startDate = startDate
            temp.endDate = endDate
            temp.currentlyWorkingHere = currentlyWorking
            data.push(temp)
            const reqObj = { ...menteeProfileData, exprienceProfile: data }
            await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                ...reqObj
            }, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((response => {
                // console.log("Adding Successful in FOrm 2", response)
                updateData(response.data.model)
                closeForm(false)
            }))
        } else {
            temp = menteeProfileData.exprienceProfile;
            temp[index].company = companyName
            temp[index].jobTitle = jobTitle
            temp[index].startDate = startDate
            temp[index].endDate = endDate
            temp[index].currentlyWorkingHere = currentlyWorking
            const reqObj = { ...menteeProfileData, exprienceProfile: temp }

            await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                ...reqObj
            }, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((response => {
                // console.log("Successfully updated menteeProfileExperience", response)
                updateData(response.data.model)
                closeForm(false)
                setFormMode(false)
            }))
        }

    }
    useEffect(() => {
        if (formMode) {
            //prefill data
            var data = menteeProfileData.exprienceProfile[index]
            if (document.getElementById(data.currentlyWorkingHere))
                document.getElementById(data.currentlyWorkingHere).checked = true
            setCompanyName(data.company)
            setJobTitle(data.jobTitle)
            setStartDate(data.startDate)
            setEndDate(data.endDate)
            setCurrentlyWorking(data.currentlyWorkingHere)
        }
        const getCompanyList = async () => {
            await axios.get(process.env.REACT_APP_GET_COMPANY)
                .then(resp => setCompanyList(resp.data))
                .catch(err => console.log(err))
        }
        getCompanyList()
    }, [])


    const options_company = companyList.map(item => {
        return { value: item.name, label: item.name }
    })
    let defaultValue = null
    if (index >= 0)
        defaultValue = { value: menteeProfileData.exprienceProfile[index].company, label: menteeProfileData.exprienceProfile[index].company }


    return (
        <div className='menteeProfileFormBackground container-fluid'>
            <div className='menteeProfileForm container'>
                <h1>Experience Details</h1>
                <div className='menteeProfileFormInput'>
                    <p>Company Name</p>
                    <CreatableSelect
                        defaultValue={defaultValue !== null ? defaultValue : null}
                        onChange={e => setCompanyName(e.value)}
                        options={options_company}
                        placeholder={defaultValue ? defaultValue.label : "Company Name"}
                        className="mb-2 fs-8"
                        classNamePrefix="react_select_companyList"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary25: 'rgba(46,175,180,.6)',
                                primary: `var(--mentor_theme)`,
                            },
                        })}
                    />
                </div>
                <div className='menteeProfileFormInput'>
                    <p>Job Title</p>
                    <input type='text' value={jobTitle} placeholder='Job Title' onChange={(e) => {
                        setJobTitle(e.target.value)
                    }} />
                </div>
                <div className='menteeProfileFormRow'>
                    <div className='menteeProfileFormInput'>
                        <p>Start Date</p>
                        <input type='date' value={startDate} placeholder='Start Date' onChange={(e) => {
                            var date = moment(e.target.value).format('YYYY-MM-DD')
                            setStartDate(date)
                        }} />
                    </div>
                    <div className='menteeProfileFormInput'>
                        <p>End Date</p>
                        <input type='date' value={endDate} placeholder='End Date' onChange={(e) => {
                            var date = moment(e.target.value).format('YYYY-MM-DD')
                            setEndDate(date)
                        }} />
                    </div>
                </div>
                <div className='menteeProfileFormButton'>
                    <p>Currently Working</p>
                    <div className='menteeProfileFormButtonList'>
                        <div className='menteeProfileFormButtonRow'>
                            <label forhtml="true">True</label>
                            <input id="true" type='radio' onChange={() => setCurrentlyWorking(true)} name='current' />
                        </div>
                        <div className='menteeProfileFormButtonRow'>
                            <label forhtml="false">False</label>
                            <input id="false" type='radio' onChange={() => setCurrentlyWorking(false)} name='current' />
                        </div>
                    </div>
                </div>
                <div className="text-center pt-2">
                    <button className="btn" onClick={saveExperienceDetails}>Save Details</button>

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
export default connect(mapStateToProps)(MenteeProfileForm3)