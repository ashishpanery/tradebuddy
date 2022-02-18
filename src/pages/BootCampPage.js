import React, { useRef, useEffect, useState } from 'react'
import { PaginationLoader } from "../components/Spinner/Spinner"
import { Header, Footer } from "../components"
import "./BootCampPage.css"
import Slider from 'react-slick'
import right_arrow from "../images/right-arrow.png"
import { useParams, useLocation, useHistory } from 'react-router-dom'
import axios from 'axios'
import PageLoader from '../components/PageLoader/PageLoader'
import { connect } from 'react-redux'
import successImg from "../images/registration success.png"
import failureImg from "../images/registration failure.png"
import moment from "moment";
import { Helmet } from 'react-helmet'
import $ from "jquery"
import { useForm } from 'react-hook-form'
import useRedirect from '../components/Redirect/Redirect'
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'

function BootCampPage({ currentUser }) {
    const [bootcampData, setBootcampData] = useState()
    const [courseId, setCourseId] = useState("")
    const [courseAmount, setCourseAmount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [failure, setFailure] = useState(false)
    const [registrationInProgress, setRegistrationInProgress] = useState(false)
    const [showSliderArrows, setShowSliderArrows] = useState(true)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const { param } = useParams()
    const location = useLocation().pathname
    const redirectWithLogin = useRedirect(location)
    const [bootcampBynameError, setBootcampBynameError] = useState('')
    const { handleError } = useHandleError(location)

    let date = moment().format("YYYY-MM-DD");
    let finalId;
    const sliderRef = useRef()

    $(function () {
        $(`#${param}`).addClass("nav_item_active");
    });

    useEffect(() => {
        const getBootcampData = async () => {
            axios.get(`${process.env.REACT_APP_GET_BOOTCAMP_BY_NAME}/${param}`)
                .then(resp => {
                    if (resp.data.code === 200) {
                        setBootcampData(resp.data.model)

                    }
                    else if (resp.data.code === 404) {
                        setBootcampBynameError(handleError(404, "bootcamp"))

                    }
                    setLoading(false)
                })
                .catch(err => {
                    setBootcampBynameError(handleError(err.response.status))
                    setLoading(false)
                })
        }
        getBootcampData()
    }, [])

    useEffect(() => {
        if (document.querySelector(".slick-dots"))
            setShowSliderArrows(true)
        else
            setShowSliderArrows(false)
    }, [])

    const getBootcampId = (id, amt) => {
        setCourseId(id)
        setCourseAmount(amt)
    }

    const gotoNext = () => {
        sliderRef.current.slickNext();
    }
    const gotoPrev = () => {
        sliderRef.current.slickPrev();
    }

    const onSubmit = (data) => {
        registerBootCampFree(data)
    }

    // const registerCourse = async (e) => {
    //     e.preventDefault()
    //     // setComponentLoading(true)
    //     console.log(currentUser)
    //     setRegistrationInProgress(true)
    //     if (courseAmount === 0) {
    //         await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
    //             contentId: courseId,
    //             menteeId: currentUser.data.id,
    //             menteeName: currentUser.data.name,
    //             menteeEmail: currentUser.data.email,
    //             amount: courseAmount,
    //             contentType: "BOOTCAMP",
    //             paymentStatus: "PAYMENT_SUCCESS",

    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${currentUser.token}`,
    //             }
    //         })
    //             .then((response) => {
    //                 if (response.data.code === 200) {
    //                     // alert('You have successfully registered')
    //                     setSuccess(true)
    //                     setFailure(false)

    //                 }
    //             })
    //             .catch(err => console.log(err))
    //     }
    //     else {

    //         await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
    //             contentId: courseId,
    //             menteeId: currentUser.data.id,
    //             menteeName: currentUser.data.name,
    //             menteeEmail: currentUser.data.email,
    //             amount: courseAmount,
    //             paymentStatus: "PAYMENT_PENDING",
    //             contentType: "BOOTCAMP"
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${currentUser.token}`,
    //             }
    //         }).then((response) => {
    //             // contentId = response.data.model.id;
    //             finalId = response.data.model.id;
    //             return axios.post(`${process.env.REACT_APP_PAYMENT_TRANSACTION}`, {
    //                 userId: currentUser.data.id,
    //                 amount: courseAmount * 100,
    //                 paymentMode: 'CR'
    //             }, {
    //                 headers: {
    //                     client_Id: process.env.RAZORPAY_CLIENT_ID,
    //                     client_key: process.env.RAZORPAY_CLIENT_KEY,
    //                 }
    //             })
    //         }).then((paymentResponse) => {
    //             console.log({ paymentResponse })
    //             var amount = parseInt(paymentResponse.data.model.amount) * 100;
    //             console.log(amount)
    //             var options = {
    //                 "key": process.env.RAZORPAY_APIKEY,
    //                 "amount": courseAmount * 100,
    //                 "currency": "INR",
    //                 "name": "TradeBuddy",
    //                 "order_id": paymentResponse.data.model.transactionId,
    //                 "handler": async function (response) {
    //                     await axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
    //                         id: paymentResponse.data.model.transactionId,
    //                         razorpay_payment_id: response.razorpay_payment_id,
    //                         razorpay_order_id: response.razorpay_order_id,
    //                         razorpay_signature: response.razorpay_signature,
    //                         status: "success"
    //                     }).then((response) => {
    //                         console.log(response)
    //                         setSuccess(true)
    //                         setFailure(false)
    //                     })

    //                     await axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
    //                         contentId: courseId,
    //                         id: finalId,
    //                         menteeId: currentUser.data.id,
    //                         paymentStatus: "PAYMENT_SUCCESS",
    //                         paymentId: response.razorpay_payment_id,
    //                         orderId: response.razorpay_order_id,
    //                         menteeName: currentUser.data.name,
    //                         menteeEmail: currentUser.data.email,
    //                         amount: courseAmount,
    //                         contentType: "BOOTCAMP",
    //                         orderDate: date

    //                     }, {
    //                         headers: {
    //                             Authorization: `Bearer ${currentUser.token}`,
    //                         }
    //                     }).then((response) => {
    //                         console.log(response)
    //                         setSuccess(true)
    //                         setFailure(false)
    //                     }).catch((err) => {
    //                         if (err.response) {
    //                             console.log(err.response)
    //                         }
    //                     })
    //                 }
    //             };
    //             var rzp1 = new window.Razorpay(options);
    //             rzp1.open();
    //             rzp1.on('payment.failed', function (response) {
    //                 console.log(response)
    //                 axios.post(`${process.env.REACT_APP_UPDATE_TRANSACTION}`, {
    //                     id: paymentResponse.data.model.transactionId,
    //                     razorpay_payment_id: response.razorpay_payment_id,
    //                     razorpay_order_id: response.razorpay_order_id,
    //                     razorpay_signature: response.razorpay_signature,
    //                     status: "failure"
    //                 }).then((response) => {
    //                     console.log(response)
    //                     setSuccess(false)
    //                     setFailure(true)
    //                 })
    //                 axios.post(`${process.env.REACT_APP_SAVE_COURSE_REGISTRATION}`, {
    //                     contentId: courseId,
    //                     menteeId: currentUser.data.id,
    //                     id: finalId,
    //                     paymentStatus: "PAYMENT_FAILED",
    //                     paymentId: response.razorpay_payment_id,
    //                     orderId: response.razorpay_order_id,
    //                     menteeName: currentUser.data.name,
    //                     menteeEmail: currentUser.data.email,
    //                     amount: courseAmount,
    //                     contentType: "BOOTCAMP",
    //                     orderDate: date
    //                 }, {
    //                     headers: {
    //                         Authorization: `Bearer ${currentUser.token}`,
    //                     }
    //                 }).then((response) => {
    //                     console.log(response)
    //                     setRegistrationInProgress(false)
    //                 }).catch((err) => {
    //                     if (err.response) {
    //                         console.log(err.response)
    //                     }
    //                 })

    //             })
    //         }).catch((err) => {
    //             if (err.response) {
    //                 if (err.response.status === 403) {
    //                     // history.push(`/login/events/${eventDetails.id}`)
    //                 }
    //             }
    //         })
    //     }


    //     // setComponentLoading(false)
    // }
    const registerBootCampFree = async ({ email, name, phone }) => {
        setSuccess(false)
        setFailure(false)
        await axios.post(process.env.REACT_APP_SAVE_BOOTCAMP_REGISTRATION, {
            programId: courseId,
            menteeId: currentUser.data.id,
            menteeName: name,
            email: email,
            mobile: phone,
            status: "OPEN"
        },
            {
                headers: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            }
        )
            .then(resp => {
                resp.data.code === 200 && setSuccess(true)
            })
            .catch(err => {
                // setRegisterError(handleError(err.response.status))
                setFailure(true)
            })

    }

    const settings = {
        autoplay: false,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        dots: true,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    rows: 1,

                }
            }, {
                breakpoint: 750,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,

                }
            }
        ]
        // variableWidth: true
    };

    return (
        <>
            {
                loading ?
                    <PageLoader />
                    :
                    bootcampBynameError ?
                        <>
                            <header>
                                <Helmet>
                                    <title> Bootcamp Not Found - TradeBuddy  </title>
                                    <meta name='description' content='Personalized Boot Camps to Help Speed up Your Growth and Land Your Dream Job.' charSet="utf-8" />
                                </Helmet>
                                <Header />
                            </header>
                            <div className="d-flex mt-5 pt-5 flex-column justify-content-between text-center" style={{ minHeight: "100vh" }}>
                                {bootcampBynameError}
                                <Footer />
                            </div>
                        </>
                        :
                        <>
                            <Helmet>
                                <title>{bootcampData?.title} - TradeBuddy  </title>
                                <meta name='description' content='Personalized Boot Camps to Help Speed up Your Growth and Land Your Dream Job.' charSet="utf-8" />
                            </Helmet>
                            <Header />
                            <main>
                                {/* section 1 */}
                                <section className='pt-5 mt-5'>
                                    <div className="row container py-5 mt-5 mx-auto">
                                        <div className="col-12  bootcampPage_img text-center">
                                            <img src={bootcampData.bannerImage} alt="" />
                                        </div>
                                        <div className="row">
                                            <div className="col-12 mentorLandingPageBannerLeftHeading">
                                                <h1 className='py-3 text-lg-center ' style={{ fontSize: '3rem' }} >{bootcampData.title}</h1>
                                                <p className=' fs-5 line-height-1'>{bootcampData.shorttitle} </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {/* select community */}
                                <section className='my-5'>
                                    <div className="row container mx-auto py-5 custom_box_shadow">
                                        <div className="col-12" style={{ border: "1px dotted black " }}>
                                            <h4 className='text-center py-5' style={{ textDecoration: "underline" }}>Select Your Bootcamp</h4>
                                        </div>
                                        <div className="row">
                                            <div className="  text-center text-dark">
                                                <Slider {...settings} ref={sliderRef}>
                                                    {bootcampData.programDates.map((item, index) => {
                                                        const { duration, startDate, status, id, price } = item

                                                        return <div className={`px-md-3 px-lg-5`} key={index}>
                                                            <div className=''>
                                                                <div className="d-flex flex-column align-items-center align-items-lg-start re gap-3 p-3">
                                                                    <div className='text-start'>
                                                                        <h4 className="fs-5">{duration}</h4>
                                                                        <ul className='m-0 p-0'>
                                                                            <li className='fs-6'>{startDate}</li>
                                                                            <li className='fs-6'>{status}</li>
                                                                            <li className='fs-6'>{price ? price : '0 INR '}</li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className='d-flex gap-1 flex-column flex-xxl-row'>
                                                                        {
                                                                            !["closed", "opening soon"].includes(status.toLowerCase()) ?
                                                                                currentUser ?
                                                                                    <button onClick={() => getBootcampId(id, price ? Number(price.split(" ")[0]) : 0)} className='btn' data-bs-toggle="modal" data-bs-target="#courseRegistrationModal">Free Register</button>
                                                                                    :
                                                                                    <button onClick={() => redirectWithLogin()} className='btn'>Free Register</button>
                                                                                :
                                                                                <button className='btn cursor_not_allowed' disabled> Free Register</button>

                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    })}
                                                </Slider>
                                            </div>
                                            <div className={`d-${showSliderArrows ? 'flex' : 'none'} justify-content-center gap-5  mt-2 slider_arrows`}>
                                                <div onClick={() => gotoPrev()} className='position-relative' >
                                                    <img className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "20px", transform: "scale(-1,1)" }} />
                                                </div>
                                                <div onClick={() => gotoNext()} className='position-relative'>
                                                    <img className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "20px" }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            {/* course registration modal */}
                                            <div className="modal fade" id="courseRegistrationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                <div className="modal-dialog">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <p className="modal-title fs-5 text-dark" id="staticBackdropLabel">Course Registration Form</p>
                                                            <button onClick={() => {
                                                                setSuccess(false)
                                                                setFailure(false)
                                                                setRegistrationInProgress(false)
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
                                                                !failure && !success && currentUser ? <form onSubmit={handleSubmit(onSubmit)}>
                                                                    <p className='fs-6 mb-2'>Try our bootcamp for free. Purchase the full course only if you're satisfied!</p>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="mentee_name" className="form-label">Your Name:</label>
                                                                        <input type="text" className="form-control" id="mentee_name" defaultValue={currentUser.data.name} name="name" {...register("name", { required: true })} />
                                                                        {errors.name && <p className="text-danger">Name is required</p>}
                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="mentee_email" className="form-label">Your Email:</label>
                                                                        <input type="email" className="form-control" id="mentee_email" defaultValue={currentUser.data.email} name="email" {...register("email", { required: true })} />
                                                                        {errors.email && <p className="text-danger">Email is required</p>}

                                                                    </div>
                                                                    <div className="mb-3">
                                                                        <label htmlFor="mentee_phone" className="form-label">Your Phone Number:</label>
                                                                        <input type="number" className="form-control" id="mentee_phone" defaultValue={currentUser.data.phone} name="phone" {...register("phone", { required: true, minLength: 10, maxLength: 10 })} />
                                                                        {errors.phone && <p className="text-danger">Phone Number is required and should be 10 digits.</p>}

                                                                    </div>
                                                                    {/* <div className="mb-3">
                                                                        <label htmlFor="mentee_registration_amount" className="form-label">Registration Amount:</label>
                                                                        <input type="number" className="form-control" id="mentee_registration_amount" readOnly value={courseAmount} />
                                                                    </div> */}
                                                                    <button type="submit" className="btn">{registrationInProgress ? <PaginationLoader /> : "Register for free!"} </button>

                                                                </form> :
                                                                    null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* preview text */}
                                <section className='my-5'>
                                    <div className="row text-center container mx-auto">
                                        <div className="col-12">
                                            <h2 className='fs-2 fw-bold'>Get a preview of what you'll learn and apply to help you prepare</h2>
                                            <p className='fs-5 py-2'>Web Development Fundamentals spans over 4 weeks through 4 projects.</p>
                                        </div>
                                        <div className="row custom_box_shadow px-2 px-lg-5 py-5  ">
                                            <div className="col-12 mx-auto prequisites">
                                                <h3 className='text-start pb-3'>Prerequisites</h3>
                                                <ul className='text-start m-0 p-0 '>
                                                    {
                                                        bootcampData.Prerequisites.map((item, index) => {
                                                            return <li key={index}>{item}</li>
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* what you will learn */}
                                <section className='mb-5'>
                                    <div className="container mx-auto">
                                        <div className="text-center">
                                            <div className="col-12">
                                                <h2 className='fs-3 fw-bold'>In this Bootcamp, you will learn the following technologies and their applications.</h2>
                                            </div>
                                        </div>
                                        {/* cards */}
                                        <div className="row mt-5 h-100">
                                            {
                                                bootcampData.technology.map((item, index) => {
                                                    const desc = [
                                                        "Hypertext Markup Language (HTML) is the standard markup language for creating web pages and web applications. HTML elements are the building blocks of HTML pages.",
                                                        "Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in a markup language.",
                                                        "JavaScript is used to make dynamic webpages interactive and provide online programs, including video games.",
                                                        "Microsoft's Visual Studio Code is the overall most popular development environment, and will be used throughout the Bootcamp to write your code. You'll learn which extensions to use to increase your productivity."
                                                    ]
                                                    return <div className=" px-3 py-4 col-12 col-md-6 col-lg-3 px-2 px-lg-2  " key={index}>
                                                        <div className={`custom_box_shadow px-2 px-lg-3 pb-3 h-100 flexible p-5`}>
                                                            <div className='bootcamp_cards_img text-center'>
                                                                <img src={item.image} alt='' />
                                                            </div>
                                                            <div className=' mt-5 px-3 d-flex flex-column  justify-content-between'>
                                                                <h5 className="text-center"  >{item.name}</h5>
                                                                <p className='py-4 text-start '>{desc[index]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                                )}
                                        </div>


                                        {/*  */}
                                        {/* summary */}
                                        <section className="my-5 ">
                                            <div className="container mx-auto">
                                                <div className="row">
                                                    {
                                                        bootcampData.sections.map((item, index) => {
                                                            return <div className="row features_grid p-2 p-lg-5 py-2" key={index}>
                                                                {/* col 1 */}
                                                                <div className="col-12 col-md-7 col-lg-7 border-bottom ">
                                                                    <div className=' p-3'>
                                                                        {/* <h3><strong>Week 1: </strong>Tech Talk</h3> */}
                                                                        <h3>{item.title}</h3>
                                                                        <p className='fs-6 pt-4 line-height-1 line-height-1'>{item.description}.</p>
                                                                    </div>
                                                                </div>
                                                                {/* col 2 */}
                                                                <div className="col-12 col-md-5 col-lg-5 text-center border-bottom d-flex align-items-center">
                                                                    <div className='  border-md-none p-3 row'>
                                                                        <div className='col-12 d-flex align-items-center justify-content-between'>
                                                                            <h6 className=''>Exercises: </h6>
                                                                            <p className="fs-6 fs-md-1">{item.exercises}</p>
                                                                        </div>
                                                                        <div className='col-12 d-flex align-items-center justify-content-between'>
                                                                            <h6 className=''>Assignment: </h6>
                                                                            <p className="fs-6">{item.assignment}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </section>
                                        {/*  */}
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

export default connect(mapStateToProps)(BootCampPage)

