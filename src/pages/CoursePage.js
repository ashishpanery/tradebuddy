import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import "./BootCampPage.css"
import { useHistory, useParams, useLocation } from 'react-router-dom'
import axios from 'axios'
import PageLoader from '../components/PageLoader/PageLoader'
import { connect } from 'react-redux'
import successImg from "../images/registration success.png"
import failureImg from "../images/registration failure.png"
import { PaginationLoader } from "../components/Spinner/Spinner"
import moment from "moment";
import { Helmet } from 'react-helmet'
import useRedirect from '../components/Redirect/Redirect'
import { Breadcrumbs, Rating } from '@mui/material'
import { CourseCards } from '../components'
import "./CoursePage.css"
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'
// import StarBorderIcon from '@mui/icons-material/StarBorder';


function CoursePage({ currentUser }) {
    const { course_ID } = useParams()
    const [courseData, setCourseData] = useState({})
    const [coursesByTag, setCoursesByTag] = useState([])
    const [courseId, setCourseId] = useState("")
    const [courseAmount, setCourseAmount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [similarCoursesLoading, setSimilarCoursesLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [registrationInProgress, setRegistrationInProgress] = useState(false)
    let date = moment().format("YYYY-MM-DD");
    const [courseByIdError, setCourseByIdError] = useState('')
    const [courseByTagsError, setCourseByTagsError] = useState('')
    const { handleError } = useHandleError(window.location.pathname)

    let finalId;
    const history = useHistory()

    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    // const color = history.location.state.color
    const color = "rgba(0, 0, 0, 0.7)"

    const getCoursesByTags = async () => {
        await axios.get(`${process.env.REACT_APP_GET_SIMILAR_COURSE_BY_ID}/${course_ID}`)
            .then(resp => {
                resp.data.code === 200 && setCoursesByTag(resp.data.model)
                setSimilarCoursesLoading(false)
            })
            .catch(err => {
                setCourseByTagsError(handleError(err.response.status))
                setSimilarCoursesLoading(false)
            })
    }

    useEffect(() => {

        const getCourseData = async () => {
            axios.get(`${process.env.REACT_APP_GET_COURSE_BY_ID}/${course_ID}`, {
                headers: {
                    Authorization: `Bearer ${currentUser ? currentUser.token : "dummy"}`
                }
            }
            )
                .then(resp => {
                    console.log(resp.data)
                    if (resp.data.code === 200) {
                        setCourseData(resp.data.model)

                    }
                    else if (resp.data.code === 404) {
                        setCourseByIdError(handleError(404, "course"))

                    }
                    setLoading(false)
                    getCoursesByTags()

                })
                .catch(err => {
                    // console.log(err.response.status)
                    setCourseByIdError(handleError(err.response.status, "course"))
                    setLoading(false)
                })
        }
        getCourseData()

    }, [])

    const getTotalRating = () => {
        let total = 0
        if (courseData.ratingMap) {
            for (let i = 0; i < 6; i++) {
                if (courseData.ratingMap[i])
                    total += courseData.ratingMap[i]
            }

        }
        return total
    }

    const getCourseId = (id, amt) => {
        !currentUser && redirectWithLogin()
        setCourseId(id)
        setCourseAmount(amt)
    }
    const registerCourse = async (e) => {
        e.preventDefault()
        // setComponentLoading(true)
        // console.log(currentUser)
        console.log({ courseId, courseAmount })

        setRegistrationInProgress(true)
        if (courseAmount === 0) {
            await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
                contentId: courseId,
                menteeId: currentUser.data.id,
                menteeName: currentUser.data.name,
                menteeEmail: currentUser.data.email,
                amount: courseAmount,
                contentType: "COURSE",
                paymentStatus: "PAYMENT_SUCCESS",

            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            })
                .then((response) => {
                    if (response.data.code === 200) {
                        setSuccess(true)
                        setFailure(false)

                    }
                })
                .catch(err => console.log(err))
        }
        else {

            await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
                contentId: courseId,
                menteeId: currentUser.data.id,
                menteeName: currentUser.data.name,
                menteeEmail: currentUser.data.email,
                amount: courseAmount,
                paymentStatus: "PAYMENT_PENDING",
                contentType: "COURSE",
                orderId: "NA"
            }, {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            }).then((response) => {
                // contentId = response.data.model.id;
                finalId = response.data.model.id;
                return axios.post(`${process.env.REACT_APP_PAYMENT_TRANSACTION}`, {
                    userId: currentUser.data.id,
                    amount: courseAmount * 100,
                    paymentMode: 'CR'
                }, {
                    headers: {
                        client_Id: 'tradebuddy',
                        client_key: 'dXBzeW5r',
                    }
                })
            }).then((paymentResponse) => {
                console.log({ paymentResponse })
                var amount = parseInt(paymentResponse.data.model.amount) * 100;
                console.log(amount)
                var options = {
                    "key": process.env.RAZORPAY_APIKEY,
                    "amount": courseAmount * 100,
                    "currency": "INR",
                    "name": "TradeBuddy",
                    "order_id": paymentResponse.data.model.transactionId,
                    "handler": async function (response) {
                        await axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
                            id: paymentResponse.data.model.transactionId,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            status: "success"
                        }).then((response) => {
                            console.log(response)
                            setSuccess(true)
                            setFailure(false)
                        })

                        await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
                            contentId: courseId,
                            id: finalId,
                            menteeId: currentUser.data.id,
                            paymentStatus: "PAYMENT_SUCCESS",
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            menteeName: currentUser.data.name,
                            menteeEmail: currentUser.data.email,
                            amount: courseAmount,
                            contentType: "COURSE",
                            orderDate: date

                        }, {
                            headers: {
                                Authorization: `Bearer ${currentUser.token}`,
                            }
                        }).then((response) => {
                            console.log(response)
                            setSuccess(true)
                            setFailure(false)
                        }).catch((err) => {
                            if (err.response) {
                                console.log(err.response)
                            }
                        })
                    }
                };
                var rzp1 = new window.Razorpay(options);
                rzp1.open();
                rzp1.on('payment.failed', function (response) {
                    console.log(response)
                    axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
                        id: paymentResponse.data.model.transactionId,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                        status: "failure"
                    }).then((response) => {
                        console.log(response)
                        setSuccess(false)
                        setFailure(true)
                    })
                    axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
                        contentId: courseId,
                        id: finalId,
                        menteeId: currentUser.data.id,
                        paymentStatus: "PAYMENT_FAILED",
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        menteeName: currentUser.data.name,
                        menteeEmail: currentUser.data.email,
                        amount: courseAmount,
                        contentType: "COURSE",
                        orderDate: date
                    }, {
                        headers: {
                            Authorization: `Bearer ${currentUser.token}`,
                        }
                    }).then((response) => {
                        console.log(response)
                        setRegistrationInProgress(false)
                    }).catch((err) => {
                        if (err.response) {
                            console.log(err.response)
                        }
                    })

                })
            }).catch((err) => {
                if (err.response) {
                    if (err.response.status === 403) {
                        // history.push(`/login/events/${eventDetails.id}`)
                    }
                }
            })
        }


        // setComponentLoading(false)
    }

    const openLecture = (id, subscribed, locked, title) => {
        if (subscribed || !locked) {
            window.open(`/courses/${course_ID}/${id}/${title.split(" ").join("-")}`, '_blank')
        }
    }

    return (
        <>
            <Header />
            {
                loading ?
                    <PageLoader />
                    :
                    courseByIdError ? <div className="d-flex flex-column justify-content-between mt-5 pt-5" style={{ minHeight: "100vh" }}>
                        <Helmet>
                            <title>Course Not Found - TradeBuddy  </title>
                            <meta name='description' content='Get Customized Online Courses Specifically for Your Needs at Best Prices, Free Courses and Premium Courses with Free Lectures are Free to Learn From. Get Certificates From Eligilble Courses' charSet="utf-8" />
                        </Helmet>
                        {courseByIdError}
                        <Footer />
                    </div>
                        :
                        <>
                            <Helmet>
                                <title>{courseData?.title} - TradeBuddy  </title>

                                <meta name='description' content='Get Customized Online Courses Specifically for Your Needs at Best Prices, Free Courses and Premium Courses with Free Lectures are Free to Learn From. Get Certificates From Eligilble Courses' charSet="utf-8" />
                            </Helmet>
                            <main>
                                {/* header section */}
                                <section className='pt-5 mt-4'>
                                    <div className="py-4" style={{ background: color }}>
                                        <div className="row container mx-auto">
                                            <div className='pb-3 ' style={{ width: "fit-content" }}>
                                                <Breadcrumbs aria-label="breadcrumb" className="text-white border-bottom">
                                                    <p
                                                        underline="hover"
                                                        className="text-white cursor-pointer"
                                                        onClick={() => history.push(`/courses/`)}
                                                    >
                                                        Courses
                                                    </p>
                                                    <p
                                                        underline="hover"
                                                        className="text-white fw-bold"
                                                    >
                                                        {courseData?.title}
                                                    </p>
                                                </Breadcrumbs>
                                            </div>

                                            <p className='fs-6 text-white text-uppercase'>What you will learn</p>
                                            <h2 className='pb-3 text-white' style={{ fontSize: '2.5rem' }} >{courseData?.title}</h2>
                                            {
                                                courseData.subTitle && <p className='fs-6 text-white'>{courseData.subTitle} </p>
                                            }
                                            <div className='d-flex flex-column gap-2'>
                                                <div className='d-flex flex-column flex-sm-row gap-2'>
                                                    <Rating name="half-rating" defaultValue={courseData.ratingMap['-1']} readOnly precision={0.5} />
                                                    <p className='text-white'>({getTotalRating()})</p>
                                                    <p className='text-white'>Rated by {courseData.noOfRegistrations} students.</p>


                                                </div>
                                                <div>
                                                    <p onClick={() => history.push(`/profile/${courseData.mentorId}`)} className=' text-white cursor-pointer' >Created By: <span style={{ textDecoration: "underline" }}>{courseData.mentorName}</span> </p>
                                                    <p className=' text-white'>Created: {moment(courseData.createTS).format("DD-MMM-YYYY")}</p>
                                                    <p className=' text-white'>Last updated: {courseData.updateTS === 0 ? moment(courseData.createTS).format("DD-MMM-YYYY") : moment(courseData.updateTS).format("DD-MMM-YYYY")}</p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" pt-5">
                                        {/* tags */}
                                        <div className='container row mx-auto'>
                                            <div className=" col-12 d-flex gap-2 gap-md-4 flex-wrap">
                                                {
                                                    courseData.tags.map((tag, index) => {
                                                        return <p className="fs-6 border rounded p-2" key={index}>{tag}</p>
                                                    })
                                                }

                                            </div>
                                        </div>
                                        {/* body */}


                                    </div>
                                </section>

                                <section className='my-3'>
                                    <div className="container row mx-auto px-0 ">
                                        <div className="row px-0">
                                            {/* left section */}
                                            <div className="col-12 col-lg-9">
                                                {
                                                    courseData.free ?
                                                        <div className="row border-bottom my-3 flex-column-reverse gap-3 flex-lg-row gap-lg-0 custom_box_shadow">
                                                            <div className="col-12 pb-3 text-center">
                                                                <div className="mb-5 px-2 py-4" style={{ wordWrap: "break-word" }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: courseData.description
                                                                    }}></div>
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className=" border-bottom my-3 flex-column-reverse gap-3 flex-lg-row gap-lg-0 custom_box_shadow">
                                                            <div className="col-12 pb-3">
                                                                <div className="mb-5 px-2 py-4" style={{ wordWrap: "break-word" }}
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: courseData.description
                                                                    }}></div>
                                                            </div>
                                                        </div>
                                                }
                                                <div className="row pb-5">
                                                    <div>
                                                        {/* course registration modal */}
                                                        <div className="modal fade" id="courseRegistrationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                            <div className="modal-dialog">
                                                                <div className="modal-content">
                                                                    <div className="modal-header">
                                                                        <p className="modal-title fs-5 text-dark" id="staticBackdropLabel">Course Subscription Form</p>
                                                                        <button onClick={() => {
                                                                            setTimeout(() => {
                                                                                setSuccess(false)
                                                                                setFailure(false)
                                                                                setRegistrationInProgress(false)
                                                                            }, 500)

                                                                        }}
                                                                            type="button"
                                                                            className="btn-close"
                                                                            data-bs-dismiss="modal"
                                                                            aria-label="Close"
                                                                        ></button>
                                                                    </div>
                                                                    <div className="modal-body">
                                                                        {
                                                                            success && <div className=''>
                                                                                <img className="success_img" src={successImg} alt='' />
                                                                            </div>
                                                                        }
                                                                        {
                                                                            failure && <div className='registrationFailure' style={{ width: "100%" }}>
                                                                                <img src={failureImg} style={{ width: "100%" }} alt='' />
                                                                                {/* <button onClick={resetToDefault}>Please Try Again</button> */}
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !failure && !success && <form>
                                                                                {
                                                                                    currentUser ?
                                                                                        <>
                                                                                            <div className="mb-3">
                                                                                                <label htmlFor="mentee_name" className="form-label">Your Name:</label>
                                                                                                <input type="text" className="form-control" id="mentee_name" defaultValue={currentUser.data.name} />
                                                                                            </div>
                                                                                            <div className="mb-3">
                                                                                                <label htmlFor="mentee_email" className="form-label">Your Email:</label>
                                                                                                <input type="email" className="form-control" id="mentee_email" defaultValue={currentUser.data.email} />
                                                                                            </div>
                                                                                            <div className="mb-3">
                                                                                                <label htmlFor="mentee_registration_amount" className="form-label">Registration Amount:</label>
                                                                                                <input type="number" className="form-control" id="mentee_registration_amount" readOnly value={courseAmount} />
                                                                                            </div>
                                                                                            <button type="submit" onClick={(e) => registerCourse(e)} className="btn">{registrationInProgress ? <PaginationLoader /> : "Confirm and Pay"} </button>
                                                                                        </>
                                                                                        :
                                                                                        <>
                                                                                            <p className="fs-5">You need to login to register to this course.</p>
                                                                                            <button type="submit" onClick={() => redirectWithLogin()} className="btn" data-bs-dismiss="modal"
                                                                                                aria-label="Close">Login</button>
                                                                                        </>
                                                                                }
                                                                            </form>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='mt-3'>
                                                            <h2 className='premium-para fs-3'>Course Contents</h2>
                                                        </div>
                                                        <div className="py-3 ">
                                                            {
                                                                courseData.lectureList.map((lecture, index) => {
                                                                    const { id, title, locked } = lecture
                                                                    return <div className="border-bottom" key={index}>
                                                                        <h2 className="my-1   cursor-pointer"
                                                                            data-bs-toggle={!courseData.subscribed && locked && currentUser && "modal"}
                                                                            data-bs-target={!courseData.subscribed && locked && currentUser && "#courseRegistrationModal"}
                                                                            onClick={() => !courseData.subscribed && locked && getCourseId(courseData.id, courseData.fee ? Number(courseData.fee) : 0)}
                                                                        >
                                                                            <div onClick={() => openLecture(id, courseData.subscribed, locked, title)} className="px-2 py-3 text-dark fs-5" >
                                                                                <div className='d-flex w-100 justify-content-between px-2'>
                                                                                    <span>{title}</span>
                                                                                    <span>
                                                                                        {locked && !courseData.subscribed && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                                                                        </svg>
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </h2>
                                                                    </div>
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* right section */}
                                            <div className="col-12 col-lg-3 px-2  d-flex flex-column align-items-center">
                                                {
                                                    !courseData.free && !courseData.subscribed &&
                                                    <>
                                                        <div className="col-12 custom_box_shadow my-3 pb-3" style={{ height: "fit-content" }}>
                                                            <div className="row gap-3 pt-3">
                                                                <img style={{ width: "100%", minHeight: "15em" }} src={courseData.bannerImage} alt="" />
                                                                <p className='fs-6 my-0 fw-bold '>
                                                                    Course features:
                                                                </p>
                                                                <ul className='d-flex flex-column gap-1 default-list ps-5'>
                                                                    <li className=''>{courseData?.lectureList.length} lectures.</li>
                                                                    <li>Lifetime Access.</li>
                                                                    <li>Access anytime anywhere on any device.</li>
                                                                    <li>Certificate of completion.</li>

                                                                </ul>
                                                                <p className="fs-4 text-center">{courseData?.fee} INR</p>
                                                                <div className='row mx-auto'>
                                                                    <button
                                                                        className="btn bg-primary"
                                                                        data-bs-toggle={currentUser && "modal"}
                                                                        data-bs-target={currentUser && "#courseRegistrationModal"}
                                                                        onClick={() => getCourseId(courseData?.id, courseData?.fee ? Number(courseData?.fee) : 0)}
                                                                    >Buy Now</button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                }
                                                <div className="row">
                                                    {
                                                        similarCoursesLoading ?
                                                            <PaginationLoader />
                                                            :
                                                            courseByTagsError ? courseByTagsError
                                                                :
                                                                <div>
                                                                    {coursesByTag && coursesByTag.length > 0 ?
                                                                        <>
                                                                            <p className='text-center mt-3 fs-6'>Similar Courses for you:</p>
                                                                            {
                                                                                coursesByTag.map((course, index) => {
                                                                                    return <div className='col-12 col-sm col-md-6 col-lg-12 px-0' key={index}>
                                                                                        {/* // return <div className='' key={index}> */}
                                                                                        <CourseCards courseCard={course} index={index} />
                                                                                    </div>
                                                                                })
                                                                            }
                                                                        </>
                                                                        :
                                                                        <p className='text-center mt-3 fs-6'>No similar courses found</p>

                                                                    }
                                                                </div>



                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </main>
                            <Footer />
                        </>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(CoursePage)

