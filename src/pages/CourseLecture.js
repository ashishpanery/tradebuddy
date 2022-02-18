import axios from "axios"
import { useState, useEffect } from "react"
import { Header, Footer, PageLoader } from "../components"
import { useParams, useHistory, useLocation } from "react-router-dom"
import { connect } from "react-redux"
import { Helmet } from "react-helmet"
import { Breadcrumbs, Rating } from '@mui/material'
import moment from "moment"
import successImg from "../images/registration success.png"
import failureImg from "../images/registration failure.png"
import { PaginationLoader } from "../components/Spinner/Spinner"
import useRedirect from '../components/Redirect/Redirect'
// import { useErrorHandler } from "react-error-boundary"
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler"

// 



function CourseLecture({ currentUser }) {
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    const [lectureData, setLectureData] = useState([])
    const [loading, setLoading] = useState(true)
    const { course_ID, lec_index, LecTitle } = useParams()
    const [courseData, setCourseData] = useState([])
    const [lectureListLength, setLectureListLength] = useState(0)
    const history = useHistory()
    const lectureID = Number(lec_index)
    const lectureIndex = Number(lec_index) - 1
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [registrationInProgress, setRegistrationInProgress] = useState(false)
    const [courseId, setCourseId] = useState("")
    const [courseAmount, setCourseAmount] = useState(0)
    const [userRating, setUserRating] = useState(0)
    const [notRated, setNotRated] = useState(false)
    const [ratingSuccess, setRatingSuccess] = useState(false)
    const [ratingFailure, setRatingFailure] = useState(false)
    const [error, setError] = useState('')
    const [courseLectureError, setCourseLectureError] = useState('')

    let date = moment().format("YYYY-MM-DD");
    let finalId;

    const { handleError } = useHandleError(location)

    const getCourseId = (id, amount) => {
        !currentUser && redirectWithLogin()
        setCourseId(id)
        setCourseAmount(amount)
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
                contentType: "COURSE"
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
                        client_Id: process.env.RAZORPAY_CLIENT_ID,
                        client_key: process.env.RAZORPAY_CLIENT_KEY,
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

                        await axios.put(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
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
                    axios.put(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
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

    const submitUserRating = async () => {
        if (userRating === 0) {
            setNotRated(true)
            return
        }
        await axios.get(`${process.env.REACT_APP_GET_UPDATE_COURSE_RATING_BY_COURSE_ID}/${course_ID}/${userRating}`,
            {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`,
                }
            })
            .then(resp => {
                console.log(resp.data)
                if (resp.data.code === 200) {
                    setRatingSuccess(true)
                    setRatingFailure(false)
                }
            })
            .catch(err => {
                setRatingSuccess(false)
                setRatingFailure(true)
                alert(err)

            })
    }

    useEffect(() => {
        const fetchData = async () => {


            await axios.get(`${process.env.REACT_APP_GET_COURSE_BY_ID}/${course_ID}`, {
                headers: {
                    Authorization: `Bearer ${currentUser ? currentUser.token : "dummy"}`
                }
            })
                .then(async courseResp => {
                    if (courseResp.data.code === 200) {
                        setCourseData(courseResp.data.model)
                        setLectureListLength(courseResp.data.model.lectureList.length)

                    }
                    else if (courseResp.data.code === 404) {
                        setError(handleError(404, "course"))
                    }
                    // else if (courseResp.data.code === 403) {
                    //     setError(handleError(403))
                    // }
                    else if (courseResp.data.code === 401) {
                        setError(handleError(401))
                    }
                    await axios.get(`${process.env.REACT_APP_GET_LECTURE_BY_ID_FOM_COURSE}/${course_ID}/${lectureID}`, {
                        headers: {
                            Authorization: `Bearer ${currentUser ? currentUser.token : "dummy"}`
                        }
                    })
                        .catch(err => setCourseLectureError(handleError(err.response.status)))
                        .then(courseLectureresp => {
                            if (courseLectureresp.data.code === 200) {
                                setLectureData(courseLectureresp.data.model)
                            }
                            else if (courseLectureresp.data.code === 404) {
                                setError(handleError(404))
                            }
                            else if (courseLectureresp.data.code === 403) {
                                setCourseLectureError('403')
                                console.log(courseResp.data, courseLectureresp.data)
                            }
                            else if (courseLectureresp.data.code === 401) {
                                setError(handleError(401))
                            }
                        })
                })
                .catch(err => setError(handleError(err.response.status)))








            //     const courseReq = axios.get(`${process.env.REACT_APP_GET_COURSE_BY_ID}/${course_ID}`, {
            //         headers: {
            //             Authorization: `Bearer ${currentUser ? currentUser.token : "dummy"}`
            //         }
            //     })
            //     const lectureReq = axios.get(`${process.env.REACT_APP_GET_LECTURE_BY_ID_FOM_COURSE}/${course_ID}/${lectureID}`, {
            //         headers: {
            //             Authorization: `Bearer ${currentUser ? currentUser.token : "dummy"}`
            //         }
            //     })

            //     await axios.all([courseReq, lectureReq]).then(axios.spread((...responses) => {
            //         const courseResponse = responses[0]
            //         const lectureResponse = responses[1]
            //         // check if course exists
            //         if (courseResponse.data.code === 200) {
            //             setCourseData(courseResponse.data.model)
            //             setLectureListLength(courseResponse.data.model.lectureList.length)
            //         }
            //         else
            //             setError(handleError(404, "course"))

            //         // set lecture data
            //         setLectureData(lectureResponse.data.model)
            //     }))
            //         .catch(err => {
            //             setError( handleError(err.response.status, err.message))
            //         })
            setLoading(false)
        }

        fetchData()
    }, [])


    const nextPage = () => {
        let new_title = courseData.lectureList[(lectureIndex + 1)].title.split(" ")
        window.location.assign(`/courses/${course_ID}/${(Number(lec_index) + 1)}/${new_title.join("-")}`)
    }
    const prevPage = () => {
        let new_title = courseData.lectureList[(lectureIndex - 1)].title.split(" ")

        window.location.assign(`/courses/${course_ID}/${(Number(lec_index) - 1)}/${new_title.join("-")}`)
    }

    return (
        <>
            {
                loading ?
                    <PageLoader />
                    :
                    <>
                        <Header />
                        {
                            error ?
                                <>
                                    <Helmet>
                                        <title>TradeBuddy | Course/Lecture not found | Trade Buddy  </title>
                                        {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Features: Audio and Video Sessions, Event Particiaption, Courses and Boot Camps' charSet="utf-8" /> */}
                                    </Helmet>
                                    <div className="d-flex mt-5 pt-5 flex-column justify-content-between text-center" style={{ height: "100vh" }}>
                                        {error}
                                    </div>
                                </>
                                :
                                <>
                                    <Helmet>
                                        <title>TradeBuddy | {LecTitle ? `${LecTitle} | ` : ''} Trade Buddy  </title>
                                        {/* <meta name='description' content='Online platform to connect and get crafted advice from experts. Features: Audio and Video Sessions, Event Particiaption, Courses and Boot Camps' charSet="utf-8" /> */}
                                    </Helmet>
                                    <main className="pt-5" style={{ minHeight: '70vh' }}>
                                        <section className='container custom_box_shadow  mt-5'>
                                            <div className=" py-4 d-flex flex-column-reverse flex-lg-row gap-3 flex-wrap gap-lg-0 justify-content-between pe-2" >
                                                <Breadcrumbs aria-label="breadcrumb" className=" border-bottom">
                                                    <p
                                                        underline="hover"
                                                        className=" cursor-pointer"
                                                        onClick={() => history.push(`/courses/`)}
                                                    >
                                                        Courses
                                                    </p>
                                                    <p
                                                        underline="hover"
                                                        className=" cursor-pointer"
                                                        onClick={() => history.push(`/courses/${course_ID}/${LecTitle}`)}
                                                    >
                                                        {courseData.title}
                                                    </p>
                                                    <p
                                                        underline="hover"
                                                        className=" fw-bold"
                                                    >
                                                        {courseData.lectureList[(lectureIndex)].title.split(" ").join("-")}
                                                    </p>
                                                </Breadcrumbs>

                                                {/* COURSE RATING */}
                                                <p className="fs-6 cursor-pointer" onClick={() => !currentUser && redirectWithLogin()} data-bs-toggle={currentUser && "modal"} data-bs-target="#staticBackdrop">Rate this course</p>
                                                {/*Ratig Modal */}
                                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="staticBackdropLabel">Rate Course</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                {
                                                                    !ratingSuccess && !ratingFailure &&
                                                                    <>
                                                                        <div className="d-flex flex-column gap-2">
                                                                            <div style={{ width: "fit-content" }}>
                                                                                <Rating
                                                                                    size="big"
                                                                                    onChange={(event, newValue) => {
                                                                                        setNotRated(false)
                                                                                        setUserRating(newValue)
                                                                                    }}
                                                                                    defaultValue={0}
                                                                                    precision={1}
                                                                                />
                                                                                {notRated && <p>Please provide your rating.</p>}
                                                                            </div>
                                                                            {/* <label htmlFor="rating-review">Your review on this course:</label>
                                                        <textarea className="form-control mb-3" rows="8" /> */}
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button onClick={() => submitUserRating()} type="button" className="btn" >Submit</button>
                                                                            <button type="button" className="btn" data-bs-dismiss="modal">Cancel</button>
                                                                        </div>
                                                                    </>
                                                                }
                                                                {
                                                                    ratingSuccess &&
                                                                    <>
                                                                        <div className="container d-flex flex-column gap-2 justify-content-between align-items-center">
                                                                            <div style={{ width: "120px" }}>
                                                                                <svg>
                                                                                    <g>
                                                                                        <path className="st0" fill="#2EAFB4" d="M58.86,0c9.13,0,17.77,2.08,25.49,5.79c-3.16,2.5-6.09,4.9-8.82,7.21c-5.2-1.89-10.81-2.92-16.66-2.92 c-13.47,0-25.67,5.46-34.49,14.29c-8.83,8.83-14.29,21.02-14.29,34.49c0,13.47,5.46,25.66,14.29,34.49 c8.83,8.83,21.02,14.29,34.49,14.29s25.67-5.46,34.49-14.29c8.83-8.83,14.29-21.02,14.29-34.49c0-3.2-0.31-6.34-0.9-9.37 c2.53-3.3,5.12-6.59,7.77-9.85c2.08,6.02,3.21,12.49,3.21,19.22c0,16.25-6.59,30.97-17.24,41.62 c-10.65,10.65-25.37,17.24-41.62,17.24c-16.25,0-30.97-6.59-41.62-17.24C6.59,89.83,0,75.11,0,58.86 c0-16.25,6.59-30.97,17.24-41.62S42.61,0,58.86,0L58.86,0z M31.44,49.19L45.8,49l1.07,0.28c2.9,1.67,5.63,3.58,8.18,5.74 c1.84,1.56,3.6,3.26,5.27,5.1c5.15-8.29,10.64-15.9,16.44-22.9c6.35-7.67,13.09-14.63,20.17-20.98l1.4-0.54H114l-3.16,3.51 C101.13,30,92.32,41.15,84.36,52.65C76.4,64.16,69.28,76.04,62.95,88.27l-1.97,3.8l-1.81-3.87c-3.34-7.17-7.34-13.75-12.11-19.63 c-4.77-5.88-10.32-11.1-16.79-15.54L31.44,49.19L31.44,49.19z"></path>
                                                                                    </g>
                                                                                </svg>

                                                                            </div>
                                                                            <p className="fs-6 text-success fw-bold">Your rating has been saved.</p>

                                                                        </div>
                                                                        <div className="border-top pt-3 text-end mt-3">
                                                                            <button type="button" className="btn" data-bs-dismiss="modal">Close</button>
                                                                        </div>
                                                                    </>
                                                                }
                                                                {/*  */}
                                                                {
                                                                    ratingFailure &&
                                                                    <>
                                                                        <div className="container d-flex flex-column gap-2 justify-content-between align-items-center">
                                                                            <div style={{ width: "125px" }}>
                                                                                <svg style={{ width: "125px" }}>

                                                                                    <g>
                                                                                        <path fill="#FF4141" d="M61.44,0c16.96,0,32.328,6.882,43.453,17.986c11.104,11.125,17.986,26.494,17.986,43.453 c0,16.961-6.883,32.328-17.986,43.453C93.769,115.998,78.4,122.879,61.44,122.879c-16.96,0-32.329-6.881-43.454-17.986 C6.882,93.768,0,78.4,0,61.439C0,44.48,6.882,29.111,17.986,17.986C29.112,6.882,44.48,0,61.44,0L61.44,0z M73.452,39.152 c2.75-2.792,7.221-2.805,9.986-0.026c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.077,12.25 c2.728,2.77,2.689,7.256-0.081,10.021c-2.772,2.766-7.229,2.758-9.954-0.012L61.445,71.541L49.428,83.729 c-2.75,2.793-7.22,2.805-9.985,0.025c-2.763-2.775-2.776-7.291-0.026-10.082L51.48,61.435l-12.078-12.25 c-2.726-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.954,0.013L61.435,51.34L73.452,39.152L73.452,39.152z M96.899,25.98C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685 c-9.073,9.073-14.684,21.609-14.684,35.459s5.611,26.387,14.684,35.459c9.073,9.074,21.609,14.686,35.46,14.686 c13.85,0,26.386-5.611,35.459-14.686c9.073-9.072,14.684-21.609,14.684-35.459S105.973,35.054,96.899,25.98L96.899,25.98z"></path>
                                                                                    </g>

                                                                                </svg>

                                                                            </div>
                                                                            <p className="fs-6 text-danger  fw-bold">Your rating could not be saved.</p>

                                                                        </div>
                                                                        <div className="border-top pt-3 text-end mt-3">
                                                                            <button type="button" className="btn" data-bs-dismiss="modal">Close</button>
                                                                        </div>
                                                                    </>
                                                                }

                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/*  */}
                                            </div>
                                            <div className="row" >
                                                {/* left side, list of lectures */}
                                                <div className="col-12 col-md-3 px-0 ">
                                                    <div >
                                                        <div className="offcanvas.show" data-bs-scroll="true" data-bs-backdrop="false" tabIndex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel">
                                                            <div className="offcanvas-header">
                                                                <h5 className="offcanvas-title" id="offcanvasScrollingLabel">Course Chapters</h5>
                                                                {/* <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
                                                            </div>
                                                            <div className="offcanvas-body ">
                                                                <ul className="d-flex flex-column gap-2">
                                                                    {
                                                                        courseData?.lectureList.map((lecture, index) => {
                                                                            let newTitle = lecture.title.split(" ")
                                                                            return <li key={index} className={`cursor-pointer d-flex gap-2 align-items-center fs-6 ${index + 1 === Number(lec_index) && "fw-bold"}`} onClick={() => window.location.assign(`/courses/${course_ID}/${index + 1}/${newTitle.join("-")}`)}>{lecture.title}
                                                                                {/* (courseData.subscribed || !lecture?.locked)  */}
                                                                                {(lecture.locked && !courseData.subscribed) && <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                                                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                                                                </svg>}
                                                                            </li>
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* right side, content of particular lecture*/}
                                                <div className="col-12 col-md-9 border-start my-3 flex-column-reverse gap-3 flex-lg-row gap-lg-0">
                                                    <div className="col-12 pb-3">
                                                        {
                                                            (courseData && courseData.subscribed) || (lectureData && courseLectureError !== "403") ?
                                                                <div className='d-flex gap-2 flex-column'>
                                                                    <h1 className='pb-3' style={{ fontSize: '2.5rem' }} >{lectureData.title}</h1>
                                                                    <div className="mb-5 px-3 py-4"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: lectureData.description
                                                                        }}></div>
                                                                </div>
                                                                : <>
                                                                    <div className="py-3 d-flex flex-column align-items-center gap-2 justify-content-center"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-lock-fill" viewBox="0 0 16 16">
                                                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                                                                    </svg> <h3>Purchase the course to continue learning.</h3> </div>
                                                                    {/* purchase button */}
                                                                    <div className="text-center">
                                                                        <button className="btn"
                                                                            data-bs-toggle={currentUser && "modal"}
                                                                            data-bs-target={currentUser && "#courseRegistrationModal"}
                                                                            onClick={() => getCourseId(courseId, courseData.fee)}>Purchase</button>
                                                                    </div>
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
                                                                        </div>
                                                                    </div>
                                                                    {/*  */}
                                                                </>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </main>
                                    {/* pagination */}
                                    <div className="container d-flex justify-content-between py-5">
                                        <button onClick={() => prevPage()} className={`py-2 px-3 d-flex custom_box_shadow border-0 bg-white text-dark`} style={{ visibility: `${lectureIndex > 0 ? 'visible' : 'hidden'}` }}> &laquo; Previous</button>
                                        <button onClick={() => nextPage()} className="py-2 px-3 custom_box_shadow border-0 bg-white text-dark" style={{ visibility: `${lectureIndex < lectureListLength - 1 ? 'visible' : 'hidden'}` }}>Next &raquo;</button>
                                    </div>
                                </>
                        }
                        <Footer />
                    </>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    currentUser: state.user.currentUser
})

export default connect(mapStateToProps)(CourseLecture)