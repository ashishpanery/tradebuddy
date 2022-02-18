import React, { useState, useEffect } from 'react'
import axios from "axios"
import "./MentorApplicationForm.css"
import "../css/style.css"
import { useForm } from "react-hook-form"
import mentorImg from "../images/mentor.png"
import Footer from '../components/Footer/Footer'
import Header from "../components/Header/Header"
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet';
import img_success from "../images/registration success.png"
import img_failure from "../images/registration failure.png"
import CreatableSelect from "react-select/creatable"
import { PaginationLoader } from '../components/Spinner/Spinner';
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler';


function MentorApplicationForm({ currentUser }) {
    currentUser.data.isMentor && window.location.assign("/")
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [companyList, setCompanyList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const currentYear = new Date().getFullYear()
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [company, setCompany] = useState('')
    const [companyDataError, setCompanyDataError] = useState(false)
    const [companyError, setCompanyError] = useState('')
    const { handleError } = useHandleError(window.location.pathname)

    useEffect(() => {
        const getCompanyData = async () => {
            await axios.get(`${process.env.REACT_APP_SUBMIT_REGISTRATION_FORM}`)
                .then(resp => setCompanyList(resp.data))
                .catch(error => setCompanyError(handleError(error.response.status)))
            setIsLoading(false)

        }
        try {
            setIsLoading(true)
            getCompanyData()

        } catch (error) {

        }
        setIsLoading(false)

    }, [])

    const uploadFile = async (file) => {
        let formData = new FormData()
        formData.append("file", file)
        return await axios.post(`${process.env.REACT_APP_UPLOAD_IMAGE}`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Content-Type': "multipart/form-data;"
                }
            }
        )
            .then(resp => { return resp.data.model.link })
            .catch(err => console.log(err))
    }


    const yearCollection = []
    for (let i = 1972; i <= currentYear; i++) {
        yearCollection.push(i)
    }

    const handleSelect = (e) => {
        setCompanyDataError(false)
        setCompany(e)
    }

    const onSubmit = async (data) => {
        if (!company) {
            setCompanyDataError(true)
            return
        }
        data.currentCompany = company.value
        const resumeLink = await uploadFile(data.resume[0])
        data.resumeLink = resumeLink

        delete data['resume']
        delete data['email']
        data.menteeId = currentUser.data.id
        sendData(data)

    }
    const sendData = async (data) => {
        await axios.post(process.env.REACT_APP_BECOME_MENTOR,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }
        )
            .then(resp => {
                console.log(resp)
                setSuccess(true)
            })
            .catch(err => setFailure(true))
    }

    const companyOptions = companyList.map(company => {
        return { value: company.name, label: company.name }
    })

    return (
        <>
            <Helmet>
                <title>Mentor Registration Form | Become Mentor - TradeBuddy  </title>
                <meta name='description' content='Fill the Mentor Application Form to become a Mentor and Unlock Features Like Creating Your Own Events, Courses and More.' charSet="utf-8" />
            </Helmet>

            <Header />
            {
                isLoading ? <PaginationLoader /> :

                    <>
                        {
                            success && <div className=''>
                                <img className="success_img" src={img_success} alt='' />
                            </div>
                        }
                        {
                            failure && <div className='registrationFailure' style={{ width: "100%" }}>
                                <img src={img_failure} style={{ width: "100%" }} alt='' />
                            </div>
                        }
                        {
                            !success && !failure &&
                            <div className=" d-flex mt-5 p-5 align-items-center justify-content-center gap-5">
                                <form onSubmit={handleSubmit(onSubmit)} className="mentor-form">
                                    {/* Full name  */}
                                    <h2 className=" fw-600 mb-4">Ready to become a mentor?</h2>
                                    {/* Email address */}
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="text" id="name" readOnly className="form-control pointer-event-none" value={currentUser.data.email} name="email" placeholder="example@domain.com" {...register("email", { required: true, pattern: /^\S+@\S+$/i })} />
                                        {errors.email && <p className="form-validation-error">Email not specified or invalid</p>}
                                    </div>

                                    {/* Contact number */}
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label d-block">Phone Number</label>
                                        <input id="phone" type="tel" name="phone" className="form-control" defaultValue={currentUser.data.phone} placeholder="Enter Mobile Number" {...register("phone", { required: true, minLength: 10, maxLength: 10 })} />
                                        {errors.phone && <p className="form-validation-error">Phone number is required and must be 10 digits</p>}
                                    </div>

                                    {/* Current Company */}
                                    <div className="mb-3">
                                        <label htmlFor="currentEmployer" className="form-label">Current Employer</label>
                                        {/* {
                        isLoading ?
                            <select disabled className="form-select" name="currentCompany" />
                            :
                            <select id="currentEmployer" className="form-select" name="currentCompany" {...register("currentCompany", { required: true, pattern: /^(?!Select Company$)/ })}>
                                <option defaultValue hidden>Select Company</option>
                                {companyList.map(company => {
                                    return <option onClick={() => setOthersSelected(false)} key={company.id} value={company.name}>{company.name}</option>
                                })}
                                <option onClick={() => setOthersSelected(true)} value="other">Other</option>
                            </select>
                            } */}
                                        {/* {otherSelected ? <div className="mb-3">
                                                <input type="text" className="form-control" placeholder="Type company name" name="otherCompany" {...register("otherCompany", { required: true })} />
                                                {errors.otherCompany && <p className="form-validation-error">Please type your company name</p>}
                                            </div>
                                                : null} */}
                                        {
                                            companyError ? companyError :
                                                <>
                                                    <CreatableSelect
                                                        options={companyOptions}
                                                        onChange={(e) => handleSelect(e)}
                                                        placeholder="Select Company"

                                                    />
                                                    {companyDataError && <p className="form-validation-error">Please provide company name</p>}
                                                </>
                                        }
                                    </div>

                                    {/* LinkedIn url */}
                                    <div className="mb-3">
                                        <label htmlFor="linkedIn" className="form-label">LinkedIn Profile</label>
                                        <input type="text" id="linkedIn" className="form-control" name="linkedInUrl" placeholder="LinkedIn Profile" {...register("linkedInUrl", { required: true })} />
                                    </div>
                                    {errors.linkedIn && <p className="form-validation-error">LinkedIn profile is required</p>}

                                    {/* Resume upload */}
                                    <div className="mb-3">
                                        <label htmlFor="resumeUpload" className="form-label">Resume</label>
                                        <input type="file"
                                            id="resumeUpload"
                                            className="form-control uploadFile"
                                            name="resume"
                                            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            {...register("resume", { required: true })}

                                        />
                                    </div>
                                    {errors.resume && <p className="form-validation-error">Resume is required</p>}
                                    <div className="text-center text-sm-end">
                                        <button className="btn text-uppercase fw-bold">Send Application</button>
                                    </div>
                                </form>
                                <div className="mentor-svg">
                                    <img className="img-fluid d-none d-md-flex" src={mentorImg} alt="Register" />
                                </div>
                            </div>
                        }
                    </>
            }


            <Footer />

        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})
export default connect(mapStateToProps)(MentorApplicationForm)