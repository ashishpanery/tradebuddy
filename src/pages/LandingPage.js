import React, { useEffect, useState, useRef, Suspense } from 'react'
import {
    Navbar,
    UpcomingEventCard,
    Footer,
    WhatIsInItForYouCard,
    PageLoader,
    CourseCards,
    // LandingPageBanner,
    OurClientCard,

} from '../components'


import './LandingPage.css'
// import addIconForFaq from '../images/addIconForFAQ.png'
import topBackground from '../images/landingPageBackground.png'
import yellowBackground from '../images/yellowBackGround.png'
// import ServiceCards from '../components/ServiceCards/ServiceCards'
import ServiceCard1 from '../images/serviceCard1.png'
import ServiceCard2 from '../images/serviceCard2.png'
import ServiceCard3 from '../images/serviceCard4.png'
import ServiceCard4 from '../images/serviceCard3.png'
// import ServiceCard5 from '../images/serviceCard5.png'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import right_arrow from "../images/right-arrow.png"
import { Helmet } from 'react-helmet'
import ribbon from "../images/Group 536.png"
import { IoMdCall } from 'react-icons/io'
import $ from "jquery"
import { Rating } from '@mui/material'
import useHandleError from '../components/Handlers/ErrorHandler/ErrorHandler'
import { PaginationLoader } from '../components/Spinner/Spinner'

const LandingPageBanner = React.lazy(() => import('../components/LandingPageBanner/LandingPageBanner'))


export default function LandingPage() {
    const history = useHistory()
    // loader states
    const [loading, setLoading] = useState(true)
    const [mentorDataLoading, setMentorDataLoading] = useState(true)
    const [bootcampDataLoading, setBootcampDataLoading] = useState(true)
    const [courseDataLoading, setCourseDataLoading] = useState(true)
    const [eventDataLoading, setEventDataLoading] = useState(true)
    const [reviewDataLoading, setReviewDataLoading] = useState(true)
    const { handleError } = useHandleError()
    // states
    const [eventDetails, setEventDetails] = useState([])
    const [Bootcamps, setBootcamps] = useState([])
    const [reviews, setReviews] = useState([])
    const [paginatedCourses, setPaginatedCourses] = useState([])
    const [mentorData, setMentorData] = useState([])
    // error codes
    const [eventError, setEventError] = useState('')
    const [BootcampsError, setBootcampsError] = useState('')
    const [reviewsError, setReviewsError] = useState('')
    const [paginatedCoursesError, setPaginatedCoursesError] = useState('')
    const [mentorDataError, setMentorDataError] = useState('')
    // slider refs
    const mentorCardsSliderRef = useRef()
    const bootcampCardsSliderRef = useRef()
    const courseCardsSliderRef = useRef()
    const eventCardSliderRef = useRef()
    const fellowCardSliderRef = useRef()

    // apply active className to the nav item
    $(function () {
        $("#nav_home_item").addClass("nav_item_active");
        reCalibrateSliderArrows()
    });


    const bootcamps_slider_settings = {
        infinite: false,
        autoPlay: false,
        rows: 1,
        slidesPerRow: 1,
        variableWidth: true,
        speed: 500,
        dots: true,
        arrows: false,
        cssEase: "ease-out",
        slidesToScroll: 1,
        slidesToShow: Bootcamps.length < 4 ? Bootcamps.length : 4,

        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: Bootcamps.length < 3 ? Bootcamps.length : 3,


                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: Bootcamps.length < 2 ? Bootcamps.length : 2,


                }
            }
            , {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1


                }
            }
        ]
    }
    const courses_slider_settings = {
        infinite: false,
        autoPlay: false,
        arrows: false,
        rows: 1,
        slidesToShow: paginatedCourses.length < 4 ? paginatedCourses.length : 4,
        variableWidth: true,
        slidesPerRow: 1,
        cssEase: "ease-out",
        speed: 500,
        dots: true,
        slidesToScroll: 1,
        autoplaySpeed: 1000,
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: paginatedCourses.length < 3 ? paginatedCourses.length : 3,


                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: paginatedCourses.length < 2 ? paginatedCourses.length : 2,


                }
            }
            , {
                breakpoint: 500,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,

                }
            }
        ]
    }
    const events_slider_settings = {
        infinite: false,
        arrows: false,
        speed: 500,
        dots: true,
        autoplaySpeed: 1000,
        cssEase: "ease-out",

        rows: eventDetails.length > 2 ? 2 : 1,
        slidesPerRow: 1,
        slidesToScroll: 1,
        slidesToShow: eventDetails.length < 2 ? 1 : 2,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false

                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false



                }
            }
            , {
                breakpoint: 500,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false

                }
            }
        ]
    }
    const ourClientCardSettings = {
        infinite: false,
        arrows: false,
        speed: 500,
        dots: true,
        autoplaySpeed: 1000,
        rows: reviews.length > 2 ? 2 : 1,
        slidesPerRow: 1,
        slidesToScroll: 1,
        slidesToShow: reviews.length < 2 ? 1 : 2,
        cssEase: "ease-out",
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false

                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false



                }
            }
            , {
                breakpoint: 500,
                settings: {
                    slidesPerRow: 1,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    rows: 1,
                    variableWidth: false

                }
            }
        ]
    }
    const mentorListLength = mentorData.length
    const mentorSlider_settings = {
        infinite: false,
        autoPlay: false,
        rows: 1,
        slidesPerRow: mentorListLength.length < 4 ? mentorListLength.length : 4,
        variableWidth: false,
        speed: 500,
        dots: true,
        arrows: false,
        cssEase: "ease-out",
        slidesToScroll: 1,
        slidesToShow: 1,

        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesPerRow: mentorListLength.length < 3 ? mentorListLength.length : 3,


                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesPerRow: mentorListLength.length < 2 ? mentorListLength.length : 2,


                }
            }
            , {
                breakpoint: 500,
                settings: {
                    slidesPerRow: 1


                }
            }
        ]
    }

    const temp = [
        'TradeBuddy was an amazing service for me! I was transitioning from a career in education to a career in software development. I had no previous experience in the tech industry except for some online course work and personal projects.',
        'I wanted a support system and TradeBuddy was everything I could have asked for. My mentors helped me accomplish what would have taken me 3 years alone in less than 3 months.',
        ' Amazing program with very talented mentors. They are super supportive, knowledgeable, and kind. They analyzed my situation very well and provided super useful feedback',
        'Constant check-ins with career mentor, guidance from industry mentors, interview preparations, technical interview coding preparations, Their ways and strategies for resume crafting, job search and networking has completely changed the way I approached this process!Constant check-ins with career mentor, guidance from industry mentors, interview preparations, technical interview coding preparations, Their ways and strategies for resume crafting, job search and networking has completely changed the way I approached this process!',
        'My mentor and I had personalized sessions and plans that we came up with together before each interview. They went above and beyond in helping me every step of the way.',

    ]


    const gotoNext = (sliderRef) => {
        sliderRef.current.slickNext();
    }
    const gotoPrev = (sliderRef) => {
        sliderRef.current.slickPrev();
    }

    useEffect(() => {
        const fetchDetails = async () => {
            // MENTOR API
            axios.post(`${process.env.REACT_APP_GET_MENTOR_LIST}`,
                {
                    pageNo: 1,
                    pageSize: 4,
                    sort: "experience"
                })
                .then(res => {
                    setMentorData(res.data.model)
                    setMentorDataLoading(false)

                })
                // .catch(err => {setMentorDataErrorCode(err.response.status)})
                .catch(err => {
                    setMentorDataError(handleError(err.response.status))

                })

            // BOOTCAMP API
            axios.get(process.env.REACT_APP_GET_BOOTCAMP_DATA)
                .then(res => {
                    setBootcamps(res.data.model)
                    setBootcampDataLoading(false)

                })
                .catch(err => setBootcampsError(handleError(err.response.status))
                )

            // PAGINATED COURSE API
            axios.post(process.env.REACT_APP_GET_PAGINATED_COURSE, {
                pageNo: 1,
                pageSize: 5
            })
                .then(res => {
                    setPaginatedCourses(res.data.model)
                    setCourseDataLoading(false)

                })
                .catch(err => setPaginatedCoursesError(handleError(err.response.status))
                )

            // EVENT API
            axios.post(`${process.env.REACT_APP_EVENT_LIST_PAGINATED}`, {
                pageNo: 1,
                pageSize: 4,
                sort: "startDate"
            })
                .then(res => {
                    setEventDetails(res.data.model)
                    // setEventDetails([res.data.model[0], res.data.model[0], res.data.model[0]])
                    setEventDataLoading(false)
                })
                .catch(err => setEventError(handleError(err.response.status)))

            // REVIEWS API
            axios.get(process.env.REACT_APP_MENTEE_HOME_PAGE_REVIEW)
                .then(res => {
                    setReviews(res.data.model)
                    setReviewDataLoading(false)


                })
                .catch(err => setReviewsError(handleError(err.response.status))
                )
            setLoading(false)

        }
        fetchDetails()
    }, [])


    useEffect(() => {
        window.addEventListener('resize', () => reCalibrateSliderArrows())
        return () => { window.removeEventListener('resize', () => reCalibrateSliderArrows()) }
    }, [])

    const reCalibrateSliderArrows = () => {
        $('.bootcampSliderRow .slick-dots').length === 0 ? $('.bootcampSliderRow .slider_arrows').addClass('d-none') : $('.bootcampSliderRow .slider_arrows').removeClass('d-none')
        $('.mentorCardsSliderRow .slick-dots').length === 0 ? $('.mentorCardsSliderRow .slider_arrows').addClass('d-none') : $('.mentorCardsSliderRow .slider_arrows').removeClass('d-none')
        $('.courseSliderRow .slick-dots').length === 0 ? $('.courseSliderRow .slider_arrows').addClass('d-none') : $('.courseSliderRow .slider_arrows').removeClass('d-none')
        $('.eventSliderRow .slick-dots').length === 0 ? $('.eventSliderRow .slider_arrows').addClass('d-none') : $('.eventSliderRow .slider_arrows').removeClass('d-none')
        $('.fellowSliderRow .slick-dots').length === 0 ? $('felloweSliderRow .slider_arrows').addClass('d-none') : $('felloweSliderRow .slider_arrows').removeClass('d-none')
    }

    const ourServicesClick = (path) => () => {
        history.push(path)
    }

    return (
        <>
            <header>
                <Helmet>
                    <title>TradeBuddy | Trade Buddy  </title>
                    <meta name='description' content='Online platform to connect and get crafted advice from experts. Features: Audio and Video Sessions, Event Particiaption, Boot Camps and Courses' charSet="utf-8" />
                </Helmet>
                <Navbar />
            </header>
            {
                loading ?
                    <PageLoader />
                    :
                    <>

                        <main className='landingPage'>
                            <section className='landingPageTopPart '>
                                <img src={topBackground} alt='' />
                                <div className='container mentorLandingPageTop'>
                                    <Suspense fallback={<h1>Loading...</h1>}>
                                        <LandingPageBanner />

                                    </Suspense>
                                </div>
                            </section>
                            <section className='container my-5 '>
                                <div className='ourServicesHeading'>
                                    <img src={yellowBackground} alt='' />
                                    <h1 className="text-center px-2"><span>What's in it for</span> you ?</h1>
                                </div>
                                <div className="row mt-5">
                                    <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-2 mt-5">
                                        <WhatIsInItForYouCard
                                            img={ServiceCard1}
                                            title='1-O-1 Sessions'
                                            desc='Get career ready  through 1-on-1  sessions with real-life interviewers and Industry expret from the world’s best companies.'
                                            clickHandler={ourServicesClick('/mentor-list')}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-2 mt-5 ">
                                        <WhatIsInItForYouCard
                                            img={ServiceCard2}
                                            title='Bootcamp'
                                            desc='Start your journey into tech by joining the top rated and most affordable coding bootcamp.'
                                            clickHandler={ourServicesClick('/services/bootcamp')}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-2 mt-5">
                                        <WhatIsInItForYouCard
                                            img={ServiceCard3}
                                            title='Courses'
                                            desc='Learn in-demand tech skills in half the time.Hands-on courses help you learn without the hassle of setup or videos'
                                            clickHandler={ourServicesClick('/courses')}

                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-3 px-2 px-lg-2 mt-5">
                                        <WhatIsInItForYouCard
                                            img={ServiceCard4}
                                            title='Online Events'
                                            desc='Amazing Webinars from brilliant mentors. Engage with expert for online is better than recorded videos.'
                                            clickHandler={ourServicesClick('/events')}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Mentors */}
                            <div className="h-100 container mx-auto">
                                <div className="row pb-3">
                                    <div className="col-12">
                                        <div className='ourServicesHeading'>
                                            <h1 className="text-start text-md-center"><span>Pick your mentor and</span> start learning.</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* MENTOR SLIDER */}
                            {mentorDataError ?
                                <></>
                                :
                                mentorDataLoading ?
                                    <PaginationLoader />
                                    :
                                    <section className="mentorCardsSliderRow">
                                        <div className="container my-5">
                                            <div className="customSlick">
                                                <Slider {...mentorSlider_settings} ref={mentorCardsSliderRef}>
                                                    {
                                                        mentorData.map((item, index) => {
                                                            const { name, designation, currentCompany, photoUrl, experience, currentCity, currentCountry, currency, callRatePerMin, rating } = item
                                                            return <div className="h-100 extraPadding cursor-pointer" key={index}  >
                                                                <div className='mx-2 p-3 d-flex mx-2 flex-column  custom_box_shadow justify-content-between h-100'
                                                                    style={{ width: "220px", background: "#E7FDFD" }}
                                                                    onClick={() => history.push(`/profile/${item.id}/${name.split(" ").join("-")}`)}
                                                                >
                                                                    <div className="d-flex justify-content-center mt-5 position-relative" >
                                                                        <div style={{ position: "absolute", top: "-8.5em" }}>
                                                                            <img loading='lazy' className='card-img-top' src={photoUrl} style={{ width: "120px", aspectRatio: "1", borderRadius: "50%" }} alt="" />
                                                                        </div>
                                                                    </div>
                                                                    <div className="px-2 pb-2 pt-3 h-100 text-center">
                                                                        <h4 className="fs-5 fw-600 text-black my-0 flexible  " style={{ minHeight: "2em", }}>{name}</h4>
                                                                        <h6 style={{ minHeight: "3em", fontSize: "16px" }} className="text-black my-0 py-2 " >{designation} </h6>
                                                                        <p style={{ fontSize: "14px" }} className='mt-2 text-black' >{currentCompany}</p>
                                                                    </div>
                                                                    <div className="d-flex justify-content-center">
                                                                        <div className='text-start'>
                                                                            <p className=''>Exp: {experience} years</p>
                                                                            <p >{currentCity}, {currentCountry}</p>
                                                                            <p style={{ color: "rgb(46, 175, 180)" }}>{currency} {callRatePerMin}/minute</p>
                                                                        </div>
                                                                    </div>
                                                                    <p className="mt-1 text-center">
                                                                        <Rating name="half-rating" defaultValue={rating} readOnly precision={0.5} size="small" />
                                                                    </p>
                                                                    <div className='position-relative ' >
                                                                        <div className='' style={{ borderRadius: "50%", background: "#2EAFB4", padding: ".25em", position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: "-2.5em" }}>
                                                                            <IoMdCall style={{ width: "40px", height: "40px", color: "white" }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })}
                                                </Slider>
                                            </div>

                                            {/* </div> */}
                                            <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows' >
                                                <div onClick={() => gotoPrev(mentorCardsSliderRef)} className='position-relative' >
                                                    <img className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "20px", transform: "scale(-1,1)" }} />
                                                </div>
                                                <div onClick={() => gotoNext(mentorCardsSliderRef)} className='position-relative'>
                                                    <img className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "20px" }} />
                                                </div>
                                            </div>
                                            <div className="my-5 text-center">
                                                <button onClick={() => history.push("/mentor-list")} className="btn">Show More</button>
                                            </div>

                                        </div>
                                    </section>}

                            {/* bootcamp cards */}
                            {BootcampsError ?
                                <></>
                                :
                                bootcampDataLoading ?
                                    <PaginationLoader />
                                    :
                                    <section className="bootcampSliderRow">
                                        <div className="container py-5 my-5">
                                            <div className="row pb-3">
                                                <div className="col-12">
                                                    <div className='ourServicesHeading'>
                                                        <h1 className="text-start text-md-center px-2"><span>Get trained with </span > boot camps at best prices.</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="customSlick mt-4">
                                                <Slider {...bootcamps_slider_settings} ref={bootcampCardsSliderRef}>
                                                    {
                                                        Bootcamps.map((item, index) => {
                                                            const { name, title, description, image, labelvalue, shortTitle } = item
                                                            const colorArrary = [
                                                                '#0096dc,#07d3ff',
                                                                '#800000,#80000099',
                                                                'black,rgba(0, 0, 0, 0.7) ',
                                                                '#f5c71a,#f5c71a99 ',
                                                            ]
                                                            const hueArray = [
                                                                "hue-rotate(18deg) brightness(120%)",
                                                                "hue-rotate(180deg) brightness(70%)",
                                                                "brightness(30%) sepia(1)",
                                                                "hue-rotate(240deg) brightness(160%)"
                                                            ]
                                                            return <div className="h-100 pe-2" key={index} >
                                                                <div className='gap-3 ms-4 pb-4 d-flex flex-column landingPageCards custom_box_shadow align-items-stretch justify-content-between h-100  ' style={{ maxWidth: "320px" }}>
                                                                    {/* card header */}
                                                                    <div className="px-2 pb-5 pt-3" style={{ backgroundImage: `linear-gradient(120deg,${colorArrary[index % colorArrary.length]})` }}>
                                                                        <h4 className=" fw-bold fs-5 text-white my-0 flexible  h-100" style={{ minHeight: "3em", }}>{title}</h4>
                                                                        <h6 className=" fs-6 text-white my-0 " >{shortTitle} </h6>
                                                                    </div>
                                                                    {/* card body */}
                                                                    <div className='position-relative card_ribbon'>
                                                                        <img loading='lazy' className='' src={ribbon} alt='' style={{ filter: hueArray[index % hueArray.length] }} />
                                                                        <h5 className='text-white'>{labelvalue}</h5>
                                                                    </div>
                                                                    <div className="d-flex justify-content-center mt-5">
                                                                        <img loading='lazy' className='card-img-top' src={image} style={{ width: "100px", height: "75px" }} alt="bootcamp_card_logo" />
                                                                    </div>
                                                                    <div className="">
                                                                        <p className='py-4 px-3 overflow-clamp-4 text-black'>{description}</p>
                                                                    </div>

                                                                    <div className="d-flex justify-content-center">
                                                                        <button onClick={() => history.push(`/services/bootcamp/${name}`)} className="bootcamp_card_btn" style={{ backgroundImage: `linear-gradient(120deg,${colorArrary[index % colorArrary.length]})` }}>View Bootcamp Details</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })}
                                                </Slider>
                                            </div>

                                            {/* </div> */}
                                            <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows' >
                                                <div onClick={() => gotoPrev(bootcampCardsSliderRef)} className='position-relative' >
                                                    <img loading='lazy' className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "20px", transform: "scale(-1,1)" }} />
                                                </div>
                                                <div onClick={() => gotoNext(bootcampCardsSliderRef)} className='position-relative'>
                                                    <img loading='lazy' className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "20px" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                            }

                            {/* courses */}
                            {
                                paginatedCoursesError ?
                                    <></>
                                    :
                                    courseDataLoading ?
                                        <PaginationLoader />
                                        :
                                        <section className="courseSliderRow">
                                            <div className="container py-5 my-5">
                                                <div className=" row pb-3">
                                                    <div className="col-12">
                                                        <div className='ourServicesHeading'>
                                                            <h1 className="text-start text-md-center px-2"><span>Expand your </span> skill set from the best courses.</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* only slick carousels with this className have height 100% */}
                                                <div className="customSlick mt-4">
                                                    <Slider {...courses_slider_settings} ref={courseCardsSliderRef} >
                                                        {
                                                            paginatedCourses.map((item, index) => {
                                                                return <div className='mt-1'>
                                                                    <CourseCards courseCard={item} key={index} index={index} ps={true} />
                                                                </div>


                                                            })}
                                                    </Slider>

                                                    <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows' >
                                                        <div onClick={() => gotoPrev(courseCardsSliderRef)} className='position-relative' >
                                                            <img loading='lazy' className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "1.5em", transform: "scale(-1,1)" }} />
                                                        </div>
                                                        <div onClick={() => gotoNext(courseCardsSliderRef)} className='position-relative'>
                                                            <img loading='lazy' className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "1.5em" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                            }

                            {/* upcoming events */}
                            {
                                eventError ?
                                    <></> :
                                    eventDataLoading ?
                                        <PaginationLoader />
                                        :

                                        <section className="eventSliderRow">
                                            <div className="container">
                                                <div className="row pb-3">
                                                    <div className="col-12">
                                                        <div className='upComingEventsHeading'>
                                                            <h1 className="text-center"><span>Upcoming</span> events</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="customSlickHalfHeight h-100 ">
                                                    <Slider {...events_slider_settings} ref={eventCardSliderRef} >
                                                        {
                                                            eventDetails.map((event, index) => {
                                                                return <div className='h-100' key={index}>
                                                                    <UpcomingEventCard key={event.id} single_col={true} eventDetails={event} maxWidth={true} />
                                                                </div>
                                                            })}
                                                    </Slider>
                                                    <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows'>
                                                        <div onClick={() => gotoPrev(eventCardSliderRef)} className='position-relative' >
                                                            <img loading='lazy' className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "1.5em", transform: "scale(-1,1)" }} />
                                                        </div>
                                                        <div onClick={() => gotoNext(eventCardSliderRef)} className='position-relative' >
                                                            <img loading='lazy' className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "1.5em" }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                            }

                            {/* our clients */}
                            {
                                reviewsError ?
                                    <></> :
                                    reviewDataLoading ?
                                        <PaginationLoader />
                                        :
                                        <section className='ourClients fellowSliderRow'>
                                            <div className='ourServicesHeading'>
                                                <img loading='lazy' src={yellowBackground} alt='' />
                                                <h1 className="text-center"><span>Hear it from our</span> fellows</h1>
                                            </div>
                                            <div className={`ourClientCardsRow ${reviews.length > 2 && 'customSlickHalfHeight'} container`}>
                                                <Slider {...ourClientCardSettings} ref={fellowCardSliderRef}>
                                                    {
                                                        reviews.map((review, index) => (
                                                            <div className='h-100' key={index}>
                                                                <OurClientCard
                                                                    img={review.photoUrl}
                                                                    name={review.name}
                                                                    desc={temp[index]}
                                                                    link={review.postLink}
                                                                    index={index}
                                                                />
                                                            </div>

                                                        ))
                                                    }
                                                </Slider>
                                                <div className='d-flex justify-content-center gap-5 mt-2 slider_arrows' >
                                                    <div onClick={() => gotoPrev(fellowCardSliderRef)} className='position-relative' >
                                                        <img loading='lazy' className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "1.5em", transform: "scale(-1,1)" }} />
                                                    </div>
                                                    <div onClick={() => gotoNext(fellowCardSliderRef)} className='position-relative'>
                                                        <img loading='lazy' className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "1.5em" }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                            }
                            <Footer />
                        </main>
                    </>
            }
        </>
    )
}