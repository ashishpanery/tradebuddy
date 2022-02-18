import React, { useEffect, useState } from 'react'
import './MenteeProfile.css'
import blueBackground from "../images/landingPageBackground.png";
import axios from 'axios';
import { connect } from 'react-redux';
import pencil from "../images/Pencil Icon.png"
import { useParams } from 'react-router-dom'
import Rating from "@mui/material/Rating";
import { updatePhoto } from '../react-redux/reducers/allActions';
import { UploadImage, MenteeProfileForm1, MenteeProfileForm2, MenteeProfileForm3, MenteeProfileForm4, MenteeProfileForm5, MenteeExperienceTab, MenteeEducationTab, PageLoader, Navbar, Footer, MenteeScheduleAppointment }
    from '../components';
import $ from "jquery"
import { Helmet } from 'react-helmet';
import { ErrorBoundary } from 'react-error-boundary';
import Error from './Error';
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler';

function MenteeProfile({ currentUser, updatePhoto }) {
    const [menteeProfileData, setMenteeProfileData] = useState({})
    const [showPersonalDetails, setShowPersonalDetails] = useState(false)
    const [showEducationDetails, setShowEducationalDetails] = useState(false)
    const [showExperienceDetails, setShowExperienceDetails] = useState(false)
    const [experienceDetailsMode, setExperienceDetailsMode] = useState(false)
    const [educationDetailsMode, setShowEdicationDetailMode] = useState(false)
    const [showIndustryAndServices, setShowIndustryAndServices] = useState(false)
    const [showPaymentDetails, setShowPaymentDetails] = useState(false)
    const [onChange, setOnChange] = useState('')
    const [experienceKey, setExperienceKey] = useState()
    const { handleError } = useHandleError(window.location.pathname)
    const [pageError, setPageError] = useState('')
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const [totalRating, setTotalRating] = useState(0)
    const isPublic = currentUser ? id === currentUser.data.id ? false : true : true

    $(function () {
        $("#nav_profile_item").addClass("nav_item_active");
    });

    useEffect(() => {
        const fetchMenteeProfile = async () => {
            await axios.get(`${process.env.REACT_APP_GET_MENTEE_DETAILS}`, {
                headers: {
                    'Authorization': `Bearer ${currentUser?.token}`
                }
            }).then(menteeData => {
                if (menteeData.data.code === 200) {
                    // setUserExists(true)
                    setMenteeProfileData(menteeData.data.model)
                    setOnChange(menteeData.data.model.photoUrl)
                }
                else if (menteeData.data.code === 404) {
                    setPageError(handleError(404, "profile"))
                }
                else {
                    alert(menteeData.data.message)
                }
                // setLoading(false)


            }).catch(err => {
                setPageError(handleError(err.response.status))
                setLoading(false)

            })
            // setLoading(false)
        }
        const fetchPublicProfile = async () => {
            await axios.get(`${process.env.REACT_APP_GET_PUBLIC_PROFILE}/${id}`).then(publicProfileData => {
                if (publicProfileData.data.code === 200) {
                    // setUserExists(true)
                    setMenteeProfileData(publicProfileData.data.model)
                    setOnChange(publicProfileData.data.model.photoUrl)

                } else if (publicProfileData.data.code === 404) {
                    setPageError(handleError(404, "profile"))
                }
            }).catch(err => {
                setPageError(handleError(err.response.status))
                // setLoading(false)
            })
        }
        isPublic ? fetchPublicProfile() : fetchMenteeProfile()
        setLoading(false)
    }, [])

    useEffect(() => {
        const savePhoto = async () => {
            const reqObj = { ...menteeProfileData, photoUrl: onChange }
            if (onChange !== '')
                await axios.post(`${process.env.REACT_APP_SAVE_MENTEE_DETAILS}`, {
                    ...reqObj

                }, {
                    headers: {
                        'Authorization': `Bearer ${currentUser.token}`
                    }
                }).then((response => {
                    // console.log("", response)
                    updatePhoto(response.data.model.photoUrl)
                    setMenteeProfileData(response.data.model)
                }))

        }
        !isPublic && savePhoto()
    }, [onChange])

    useEffect(() => {
        const getTotalRating = () => {
            let total = 0
            if (menteeProfileData.ratingMap) {
                for (let i = 0; i < 6; i++) {
                    if (menteeProfileData.ratingMap[i])
                        total += menteeProfileData.ratingMap[i]
                }
                setTotalRating(total)
            }
            else setTotalRating(0)
        }
        getTotalRating()
    })

    const setKey = (index) => {
        setExperienceKey(index)
    }

    const getPercentage = (num) => {
        return (num / totalRating * 100)
    }

    return (
        loading ?
            <PageLoader />

            :
            !pageError ?
                <>
                    <header>
                        <ErrorBoundary FallbackComponent={Error}>
                            <Navbar />
                            <Helmet>
                                <title>{menteeProfileData?.name ? `${menteeProfileData?.name}'s Profile` : "Profile Not Found"} - TradeBuddy  </title>
                                {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Fetures: Chat, Audio and Video Call using Sessions, Event Particiaption  ' charSet="utf-8" /> */}
                            </Helmet>
                        </ErrorBoundary>
                    </header>

                    <div className='container-fluid'>
                        <div className="personalDetails_cover_img">
                            <img src={blueBackground} alt="" style={{ width: "100%" }} />
                        </div>
                    </div>
                    <div className='container'>
                        <div className="row py-3 personalProfileContainer">
                            <div className="col-12 col-lg-3 px-lg-0">
                                <div className="personalProfilePictureTab  mentee_profile_picture d-flex flex-column align-items-center justify-content-center py-4" style={{ background: "#DFF4FF" }}>
                                    <ErrorBoundary FallbackComponent={Error}>
                                        <UploadImage
                                            photoID="profilePhotoID"
                                            uploadBtnID="profilePhotoBtnID"
                                            height="150px"
                                            width="150px"
                                            borderRadius="50%"
                                            value={menteeProfileData.photoUrl}
                                            setOnChange={setOnChange}
                                            isPublic={isPublic}

                                        />
                                    </ErrorBoundary>
                                    <div>
                                        <h4 className="pt-3 text-center">{menteeProfileData.name}</h4>
                                        <p className="fs-6 text-center">{menteeProfileData.designation}</p>
                                        {
                                            menteeProfileData.status === "APPROVED" ?
                                                <p className=" text-center">{menteeProfileData.currency} {menteeProfileData.callRatePerMin} / min</p>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-9 pt-lg-0 pt-3">
                                <div className="personalDetailsTab py-4 bg-white">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h3 className="pb-2">Personal Details</h3>
                                        {
                                            isPublic === false ?
                                                <img className='new_menteeProfileTabPencil ms-auto' src={pencil} alt='' onClick={() => setShowPersonalDetails(true)} />
                                                :
                                                null
                                        }
                                    </div >
                                    <div className="d-flex pb-2">
                                        <h4 style={{ width: "150px" }} >Name</h4>
                                        <p className="fs-6">{menteeProfileData.name}</p>
                                    </div>


                                    <h4 className="pb-2">About Me</h4>
                                    <div>
                                        <p className="fs-6">
                                            {menteeProfileData.coverLine}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row ">
                            {/*  left Section */}
                            <div className="col-12 col-lg-3 px-lg-0 order-2 order-lg-1 ">
                                {
                                    // menteeProfileData.status==="APPROVED" ?
                                    <div className="row">
                                        <div className="col-12 pb-2">
                                            {/* <div className="d-flex justify-content-center justify-content-lg-between d-none">
                                        <div className=" mentee_profile_button">
                                            <img className="mx-auto mb-1 mt-2" src={mentee_msg} alt="" style={{ height: "25px", width: "25px" }} />
                                            <h6 className="text-white pt-1">23k min</h6>
                                        </div>
                                        <div className=" mentee_profile_button  mx-2 mx-lg-0">
                                            <img className="mx-auto mb-1 mt-2" src={mentee_call} alt="" style={{ height: "25px", width: "25px" }} />
                                            <h6 className="text-white pt-1">23k min</h6>
                                        </div>
                                        <div className=" mentee_profile_button">
                                            <img className="mx-auto mb-1 mt-2" src={mentee_reports} alt="" style={{ height: "25px", width: "25px" }} />
                                            <h6 className="text-white pt-1">0 Reports</h6>
                                        </div>
                                    </div> */}
                                            {/* rating */}
                                            {
                                                menteeProfileData.status === "APPROVED" ?
                                                    menteeProfileData.ratingMap ?
                                                        menteeProfileData.ratingMap === {} ?
                                                            <>
                                                                <p className=" text_black rounded_border custom_box_shadow bg-white py-3 text-center">
                                                                    No Rating Data available. Be the first to rate!
                                                                </p>
                                                                {/* <button className="custom_box_shadow px-3 py-2">Rate Mentor</button> */}

                                                            </>
                                                            :
                                                            <div className=" text_black rounded_border custom_box_shadow bg-white py-3 ">
                                                                <h4 className="text-center mb-3">Rating</h4>
                                                                <div className="d-flex justify-content-between align-items-center px-4">
                                                                    <div className="d-flex flex-column">
                                                                        {/* average rating */}
                                                                        <h3 className="text-center">{menteeProfileData.ratingMap ? menteeProfileData.ratingMap['-1'] : 0}</h3>
                                                                        <h3 className="text-center">
                                                                            <Rating name="half-rating" defaultValue={menteeProfileData.ratingMap['-1']} readOnly precision={0.5} />
                                                                        </h3>
                                                                        <h4 className="d-flex align-items-center justify-content-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                                        </svg> <span>{totalRating} Total</span> </h4>
                                                                    </div>
                                                                    {/* Rating bars */}
                                                                    <div className="d-flex flex-column ">
                                                                        <h4 className="d-flex align-items-center"> <span style={{ width: '15px' }} className="text-blue">5</span><div className="rating_progress_bar_outer mx-1"><div className=" rating_progress_bar_inner" style={{ width: `${getPercentage(menteeProfileData.ratingMap[5])}%` }}></div></div> <span className="ms-auto">{menteeProfileData.ratingMap[5] ? menteeProfileData.ratingMap[5] : 0}</span></h4>
                                                                        <h4 className="d-flex align-items-center"><span style={{ width: '15px' }} className="text-blue">4</span><div className="rating_progress_bar_outer mx-1"><div className="rating_progress_bar_inner" style={{ width: `${getPercentage(menteeProfileData.ratingMap[4])}%` }}></div></div><span className="ms-auto">{menteeProfileData.ratingMap[4] ? menteeProfileData.ratingMap[4] : 0}</span></h4>
                                                                        <h4 className="d-flex align-items-center"><span style={{ width: '15px' }} className="text-blue">3</span><div className="rating_progress_bar_outer mx-1"><div className="rating_progress_bar_inner" style={{ width: `${getPercentage(menteeProfileData.ratingMap[3])}%` }}></div></div><span className="ms-auto">{menteeProfileData.ratingMap[3] ? menteeProfileData.ratingMap[3] : 0}</span></h4>
                                                                        <h4 className="d-flex align-items-center"><span style={{ width: '15px' }} className="text-blue">2</span><div className="rating_progress_bar_outer mx-1"><div className="rating_progress_bar_inner" style={{ width: `${getPercentage(menteeProfileData.ratingMap[2])}%` }}></div></div><span className="ms-auto">{menteeProfileData.ratingMap[2] ? menteeProfileData.ratingMap[2] : 0}</span></h4>
                                                                        <h4 className="d-flex align-items-center"><span style={{ width: '15px' }} className="text-blue">1</span><div className="rating_progress_bar_outer mx-1"><div className="rating_progress_bar_inner" style={{ width: `${getPercentage(menteeProfileData.ratingMap[1])}%` }}></div></div> <span className="ms-auto">{menteeProfileData.ratingMap[1] ? menteeProfileData.ratingMap[1] : 0}</span></h4>
                                                                    </div>
                                                                </div>
                                                                {/* {
                                                                    currentUser?.data.id !== menteeProfileData.id &&
                                                                    <div className="p-3 text-end mt-3">
                                                                        <a href={`/review-page/${menteeProfileData.id}`} style={{ textDecoration: "none", color: "black", width: "fit-content" }} className="cursor-pointer custom_box_shadow rounded px-3 py-2 border">Rate Mentor</a>
                                                                    </div>

                                                                } */}

                                                            </div>
                                                        :
                                                        <>
                                                            <div className=" text_black rounded_border custom_box_shadow bg-white py-3 ">
                                                                No Rating Data available
                                                            </div>
                                                            {/* <button className="custom_box_shadow px-3 py-2">Rate Mentor</button> */}

                                                        </>
                                                    :
                                                    null
                                            }
                                        </div>
                                        {/* reviews */}
                                        <div className="col-12 py-2">
                                            {
                                                menteeProfileData.status === "APPROVED" ?
                                                    menteeProfileData.reviews && menteeProfileData.reviews.length > 0 ?
                                                        <div className=" py-2 mb-2  d-block d-lg-flex flex-column">
                                                            {menteeProfileData.reviews.map((review, index) => {
                                                                return <div className="rounded_border custom_box_shadow p-3 my-2" key={index}>
                                                                    <div className="d-flex">
                                                                        <img className="me-3" src={review.menteePhotoUrl} alt="" style={{ borderRadius: "50%", width: "75px", height: '75px' }} />
                                                                        <div className="d-flex flex-column align-items-center justify-content-center">
                                                                            <h6 className="py-0 my-0">{review.menteeName}</h6>
                                                                            <h3 className="pt-2 my-0">
                                                                                <Rating name="half-rating" defaultValue={review.rating} readOnly precision={0.5} />
                                                                            </h3>
                                                                            <p className="fs-6 py-0 my-0">{review.createDate}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr style={{ opacity: ".1" }} />
                                                                    <p className=" mt-3">"{review.review}"</p>
                                                                </div>
                                                            })}
                                                        </div>
                                                        :
                                                        <div className="rounded_border custom_box_shadow p-3 my-2">
                                                            <p>No reviews available</p>
                                                        </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* right section */}
                            <div className="col-12 col-lg-9 mb-5 order-1 order-lg-2">
                                <div className="row ">
                                    {/* Schedule Appointment */}
                                    {
                                        currentUser ? menteeProfileData.id === currentUser.data.id ? null
                                            :
                                            menteeProfileData.status === "APPROVED" &&
                                            <div className={` col-12 bg-white ${isPublic === true ? 'pb-2' : 'py-2'}`}>
                                                <div className="personalDetailsTab ">
                                                    <MenteeScheduleAppointment
                                                        userProfile={menteeProfileData}
                                                    />

                                                </div>
                                            </div>
                                            :
                                            menteeProfileData.status === "APPROVED" &&
                                            <div className={` col-12 bg-white ${isPublic === true ? 'pb-2' : 'py-2'}`}>
                                                <div className="personalDetailsTab ">
                                                    <MenteeScheduleAppointment
                                                        userProfile={menteeProfileData}
                                                    />

                                                </div>
                                            </div>
                                    }
                                    {/* industries and services details */}
                                    {
                                        menteeProfileData.status === "APPROVED" ?
                                            <div className="col-12 pb-2">
                                                <div className="personalDetailsTab py-4 bg-white">
                                                    <div className="d-flex justify-content-between align-items-center bg-white">
                                                        <h3 className="pb-2">Industries, Services and skills</h3>
                                                        {
                                                            isPublic === false ?
                                                                <img className='new_menteeProfileTabPencil ms-auto' src={pencil} alt='' onClick={() => setShowIndustryAndServices(true)} />
                                                                :
                                                                null
                                                        }
                                                    </div >
                                                    <div className="inline">
                                                        <h4 className=" pt-3" >Industries</h4>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {
                                                                menteeProfileData.industry ?
                                                                    menteeProfileData.industry.length > 0 ?
                                                                        menteeProfileData.industry.map((industry_item, index) => {
                                                                            return <p key={index} className="fs-6 bg-secondary text-white p-1 rounded ">{industry_item}</p>
                                                                        })
                                                                        :
                                                                        <p>Add industries you were a part of here</p>
                                                                    :
                                                                    isPublic ?
                                                                        <p>User has not added any industries</p>
                                                                        :
                                                                        <p>Add industries you were a part of here</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="inline">
                                                        <h4 className=" pt-3" >Services</h4>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {
                                                                menteeProfileData.services ?
                                                                    menteeProfileData.services.length > 0 ?

                                                                        menteeProfileData.services.map((service_item, index) => {
                                                                            return <p key={index} className="fs-6 bg-secondary text-white p-1 rounded ">{service_item}</p>
                                                                        })
                                                                        :
                                                                        <p>Add services you were a part of here</p>

                                                                    :
                                                                    isPublic ?
                                                                        <p>User has not added any services</p>
                                                                        :
                                                                        <p>Add services you were a part of here</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="inline">
                                                        <h4 className=" pt-3" >Skills</h4>
                                                        <div className="d-flex flex-wrap gap-2">
                                                            {
                                                                menteeProfileData.skills ?
                                                                    menteeProfileData.skills.length > 0 ?

                                                                        menteeProfileData.skills.map((skill_item, index) => {
                                                                            return <p key={index} className="fs-6 bg-secondary text-white p-1 rounded ">{skill_item}</p>
                                                                        })
                                                                        :
                                                                        <p>Add skills you possess here</p>

                                                                    :
                                                                    isPublic ?
                                                                        <p>User has not added any skills</p>
                                                                        :
                                                                        <p>Add skills you possess here</p>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                    }
                                    {/* experience details */}
                                    <div className={`col-12  ${isPublic === true ? 'pb-2' : 'py-2'}`}>
                                        <MenteeExperienceTab info={menteeProfileData} showForm={setShowExperienceDetails} formMode={setExperienceDetailsMode} updateData={setMenteeProfileData} setKey={setKey} edit={isPublic === true ? false : true} />
                                    </div>
                                    {/* education details */}
                                    <div className="col-12  py-2">
                                        <MenteeEducationTab info={menteeProfileData} showForm={setShowEducationalDetails} formMode={setShowEdicationDetailMode} updateData={setMenteeProfileData} setKey={setKey} edit={isPublic === true ? false : true} />
                                    </div>
                                    {/* Payment Details */}
                                    {currentUser ? menteeProfileData.id === currentUser.data.id ?
                                        <div className={`col-12 bg-white py-2 d-${isPublic ? 'none' : 'block'}`}>
                                            <div className="personalDetailsTab py-4 bg-white">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <h3 className="pb-2">Payment Details</h3>
                                                    {
                                                        isPublic === false ?
                                                            <img className='new_menteeProfileTabPencil ms-auto' src={pencil} alt='' onClick={() => setShowPaymentDetails(true)} />
                                                            :
                                                            null
                                                    }
                                                </div >
                                                {
                                                    menteeProfileData.paymentProfile ?
                                                        <>
                                                            <div className="d-flex flex-column flex-md-row  pb-2">
                                                                <h4 style={{ width: "300px" }} >PAN Photo:</h4>
                                                                {
                                                                    menteeProfileData.paymentProfile.panPhotoUrl ?
                                                                        <img src={menteeProfileData.paymentProfile.panPhotoUrl} alt="PAN" style={{ height: "150px", width: "150px", border: "none", borderRadius: "1em" }} />
                                                                        :
                                                                        <p>Upload Your PAN photo. </p>

                                                                }
                                                            </div>

                                                            <div className="d-flex flex-column flex-md-row pb-2">
                                                                <h4 style={{ width: "300px" }} >Account Holder's Full Name</h4>
                                                                <p className="fs-6">{menteeProfileData.paymentProfile.accountHolderFullName ? menteeProfileData.paymentProfile.accountHolderFullName : "Add account holder's name"}</p>
                                                            </div>
                                                            <div className="d-flex flex-column flex-md-row  pb-2">
                                                                <h4 style={{ width: "300px" }} >Account Number:</h4>
                                                                <p className="fs-6">{menteeProfileData.paymentProfile.accountNumber ? menteeProfileData.paymentProfile.accountNumber : "Add account number"}</p>
                                                            </div>
                                                            <div className="d-flex flex-column flex-md-row  pb-2">
                                                                <h4 style={{ width: "300px" }} >IFSC Code:</h4>
                                                                <p className="fs-6">{menteeProfileData.paymentProfile.ifscCode ? menteeProfileData.paymentProfile.ifscCode : "Add IFSC Code"}</p>
                                                            </div>
                                                            <div className="d-flex flex-column flex-md-row  pb-2">
                                                                <h4 style={{ width: "300px" }} >PAN Number:</h4>
                                                                <p className="fs-6">{menteeProfileData.paymentProfile.panCard ? menteeProfileData.paymentProfile.panCard : "Add PAN number"}</p>
                                                            </div>
                                                            <div className="d-flex flex-column flex-md-row pb-2">
                                                                <h4 style={{ width: "300px" }} >Preferred Payment Mode</h4>
                                                                <p className="fs-6">{menteeProfileData.paymentProfile.paymentMode ? menteeProfileData.paymentProfile.paymentMode : "Add payment mode"}</p>
                                                            </div>

                                                        </>
                                                        :
                                                        <div>
                                                            <p>Add your payment details here:</p>
                                                        </div>

                                                }

                                            </div>
                                        </div>
                                        : null
                                        : null
                                    }
                                </div>
                            </div>
                        </div>

                        {
                            showPersonalDetails && <MenteeProfileForm1 closeForm={setShowPersonalDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} />
                        }
                        {
                            showIndustryAndServices && <MenteeProfileForm4 closeForm={setShowIndustryAndServices} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} />
                        }
                        {
                            showExperienceDetails && <MenteeProfileForm3 closeForm={setShowExperienceDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} formMode={experienceDetailsMode} index={experienceKey} setFormMode={setExperienceDetailsMode} />
                        }
                        {
                            showEducationDetails &&
                            <MenteeProfileForm2 closeForm={setShowEducationalDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} formMode={educationDetailsMode} index={experienceKey} setFormMode={setShowEdicationDetailMode} />
                        }
                        {
                            showPaymentDetails &&
                            <MenteeProfileForm5 closeForm={setShowPaymentDetails} menteeProfileData={menteeProfileData} updateData={setMenteeProfileData} />
                        }

                    </div>
                    <Footer />
                </>
                :
                <>
                    <>
                        <Navbar />
                        <div className="d-flex flex-column align-items-center justify-content-between mt-5 pt-5" style={{ height: "100vh" }}>
                            {pageError}
                            <Footer />
                        </div>

                    </>
                </>
    )


}
const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser,
});
const mapDispatchToProps = (dispatch) => ({
    updatePhoto: (photo) => dispatch(updatePhoto(photo))
})
export default connect(mapStateToProps, mapDispatchToProps)(MenteeProfile)
