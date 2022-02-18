import React, { useEffect, useState } from 'react'
import './MenteeProfileForm.css'
import { FaWindowClose } from "react-icons/fa";
// import moment from 'moment';
import axios from 'axios';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';


function MenteeProfileForm4({ closeForm, menteeProfileData, updateData, currentUser, formMode }) {
    const [industryList, setIndustryList] = useState([])
    const [servicesList, setServicesList] = useState([])
    const [skillsList, setSkillsList] = useState([])
    const [industry, setIndustry] = useState([])
    const [services, setServices] = useState([])
    const [skills, setSkills] = useState([])

    let existingIndustryList = []
    let existingServicesList = []
    let existingSkillsList = []

    //To show as default value for creatableSelect
    if (menteeProfileData.industry) {
        if (menteeProfileData.industry.length > 0) {
            existingIndustryList = menteeProfileData.industry.map(item => {
                return { value: item, label: item }
            })
        }
    }
    if (menteeProfileData.services) {
        if (menteeProfileData.services.length > 0) {
            existingServicesList = menteeProfileData.services.map(item => {
                return { value: item, label: item }
            })
        }
    }
    if (menteeProfileData.skills) {
        if (menteeProfileData.skills.length > 0) {
            existingSkillsList = menteeProfileData.skills.map(item => {
                return { value: item, label: item }
            })
        }
    }

    const saveIndustriesAndServicesDetails = async (industry, services, skills) => {
        // console.log({ industry })
        // console.log({ services })

        if (!formMode) {
            const reqObj = {
                ...menteeProfileData,
                industry: industry,
                services: services,
                skills: skills
            }
            await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                ...reqObj
            }, {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }).then((response => {
                console.log("Adding Successful in Form 4", response)
                updateData(response.data.model)
                closeForm(false)
            }))
        } else {
            const reqObj = {
                ...menteeProfileData,
                industry: industry,
                services: services,
                skills: skills
            }
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
        }

    }
    useEffect(() => {
        const getStaticIndustryList = axios.get(process.env.REACT_APP_GET_INDUSTRY);
        const getStaticServicesList = axios.get(`${process.env.REACT_APP_COMMON_BEAN}/services`);
        const getStaticSkillsList = axios.get(`${process.env.REACT_APP_COMMON_BEAN}/skills`);

        const getStaticList = async () => {
            await axios.all([getStaticIndustryList, getStaticServicesList, getStaticSkillsList]).then(axios.spread((...responses) => {
                const staticIndustryList = responses[0].data.map(item => {
                    return { value: item.name, label: item.name }
                })
                const staticServicesList = responses[1].data.model.map(item => {
                    return { value: item, label: item }
                })
                const staticSkillsList = responses[2].data.model.map(item => {
                    return { value: item, label: item }
                })
                setIndustryList(staticIndustryList)
                setServicesList(staticServicesList)
                setSkillsList(staticSkillsList)

            })).catch(errors => {
                console.log(errors)

            })
        }
        getStaticList()
    }, [])

    useEffect(() => {
        //to prefill the state with exisiting values if any
        if (menteeProfileData.industry)
            if (menteeProfileData.industry.length > 0) {
                let existingIndustryList = menteeProfileData.industry.map(item => {
                    return { value: item, label: item }
                })
                setIndustry(existingIndustryList)

            }

        if (menteeProfileData.services)
            if (menteeProfileData.services.length > 0) {
                let existingServicesList = menteeProfileData.services.map(item => {
                    return { value: item, label: item }
                })
                setServices(existingServicesList)
            }
        if (menteeProfileData.skills)
            if (menteeProfileData.skills.length > 0) {
                let existingSkillsList = menteeProfileData.skills.map(item => {
                    return { value: item, label: item }
                })
                setSkills(existingSkillsList)
            }

    }, [])

    const onSubmit = () => {
        console.log({ industry })
        const industry_list = industry.map(item => {
            return item.value
        })
        const services_list = services.map(item => {
            return item.value
        })
        const skills_list = skills.map(item => {
            return item.value
        })
        console.log({ industryList }, { services_list })
        saveIndustriesAndServicesDetails(industry_list, services_list, skills_list)

    }


    // const defaultValue = 
    return (
        <div className='menteeProfileFormBackground container-fluid'>
            <div className='menteeProfileForm container'>
                <h1>Industries and services details</h1>
                <div className='menteeProfileFormInput'>
                    <p>Industries:</p>
                    <CreatableSelect
                        isMulti
                        defaultValue={existingIndustryList}
                        onChange={setIndustry}
                        options={industryList}
                        placeholder={"Industry Name"}
                        className="fs-8"
                    />
                    <p>Services:</p>
                    <CreatableSelect
                        isMulti
                        defaultValue={existingServicesList}
                        onChange={setServices}
                        options={servicesList}
                        placeholder={"Service Name"}
                        className="fs-8"
                    />
                    <p>Skills:</p>
                    <CreatableSelect
                        isMulti
                        defaultValue={existingSkillsList}
                        onChange={setSkills}
                        options={skillsList}
                        placeholder={"Skill Name"}
                        className="fs-8"
                    />
                </div>

                <div className="text-center pt-2">
                    <button className="btn " onClick={onSubmit}>Save Details</button>

                </div>
                <FaWindowClose className='menteeProfileFormCloseIcon' onClick={() => {
                    closeForm(false)
                    // setFormMode(false)
                }} />
            </div>
        </div>
    )
}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
})
export default connect(mapStateToProps)(MenteeProfileForm4)