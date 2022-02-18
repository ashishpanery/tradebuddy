import React, { useEffect, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import "./Bootcamp.css"
import face1 from "../images/faces/face1.jpg"
import face2 from "../images/faces/face2.jpg"
import face3 from "../images/faces/face3.jpg"
import face4 from "../images/faces/face6.jpg"
import ribbon from '../images/Group 536.png'
import right_arrow from '../images/right-arrow.png'
import { Chrono } from "react-chrono";
import { Helmet } from 'react-helmet'
import axios from 'axios'
import PageLoader from '../components/PageLoader/PageLoader'
import Slider from 'react-slick'
import $ from "jquery"

// images for 3 cell grid 
import img1 from "../images/Bootcamp images/graphic-affordable2-darkmode.svg"
import img2 from "../images/Bootcamp images/graphic-local2.svg"
import img3 from "../images/Bootcamp images/graphic-flexible3.svg"

// images for six cell grid
import img8 from "../images/Bootcamp images/graphic-instructor-led2.svg"
import img9 from "../images/Bootcamp images/graphic-food.svg"
import img10 from "../images/Bootcamp images/graphic-workshop.svg"
import img11 from "../images/Bootcamp images/graphic-courses4.svg"
import img12 from "../images/Bootcamp images/graphic-portfolio.svg"
import img13 from "../images/Bootcamp images/graphic-career-services-fuchsia.svg"
// apply active className to the nav item
import useHandleError from "../components/Handlers/ErrorHandler/ErrorHandler"
export default function Bootcamp() {
    const [bootcampData, setBootcampData] = useState([])
    const [loading, setLoading] = useState(true)
    const history = useHistory()
    const bootcampCardsSliderRef = useRef()
    const { handleError } = useHandleError(window.location.pathname)
    // Error state
    const [bootampError, setBootcampError] = useState('')

    $(function () {
        $("#navbarDropdown_services").addClass("nav_item_active");
        $("#nav_bootcamp_item").addClass("nav_sub-item_active");
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
        slidesToScroll: 1,
        slidesToShow: bootcampData.length < 4 ? bootcampData.length : 4,

        responsive: [
            {
                breakpoint: 1150,
                settings: {
                    slidesToShow: bootcampData.length < 3 ? bootcampData.length : 3,


                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: bootcampData.length < 2 ? bootcampData.length : 2,


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

    useEffect(() => {
        const getBootcampData = async () => {
            try {
                await axios.get(process.env.REACT_APP_GET_BOOTCAMP_DATA)
                    .then(resp => {
                        setBootcampData(resp.data.model)
                        setLoading(false)
                    })
                    .catch(err => {
                        setBootcampError(handleError(err.response.status))
                        setLoading(false)
                    })
            } catch (error) {
                setBootcampError(handleError(400))
                setLoading(false)
            }
        }
        getBootcampData()
    }, [])

    const gotoNext = (sliderRef) => {
        sliderRef.current.slickNext();
    }
    const gotoPrev = (sliderRef) => {
        sliderRef.current.slickPrev();
    }


    // values for timeline
    const items = [{
        title: "Step 1",
        cardTitle: "",
        cardSubtitle: "Web Development Fundamentals",
        media: {
            type: "IMAGE",
            source: {
                url: "https://dialaway-bkt.s3.ap-south-1.amazonaws.com/2021-12-16T15:45:23.863883_beginner.svg"
            }
        }
    },
    {
        title: "Step 2",
        cardTitle: "",
        cardSubtitle: "Back End, SQL, and DevOps with Python",
        media: {
            type: "IMAGE",
            source: {
                url: "https://dialaway-bkt.s3.ap-south-1.amazonaws.com/2021-12-16T15:46:44.789935_backend.svg"
            }
        }
    },
    {
        title: "Step 3",
        cardTitle: "",
        cardSubtitle: "Full Stack Web + Mobile Development",
        media: {
            type: "IMAGE",
            source: {
                url: "https://dialaway-bkt.s3.ap-south-1.amazonaws.com/2021-12-16T15:47:19.284812_intermediate.svg"
            }
        }
    },
    {
        title: "Step 4",
        cardTitle: "",
        cardSubtitle: "Job Hunting Bootcamp + Career Services",
        media: {
            type: "IMAGE",
            source: {
                url: "https://dialaway-bkt.s3.ap-south-1.amazonaws.com/2021-12-16T15:47:02.053179_advanced.svg"
            }
        }
    },
    ];
    return (
        <div>
            <Helmet>
                <meta charSet="utf-8" />
                <title>Hand Picked Boot Camps By Experts - TradeBuddy  </title>
                <meta name="description" content="Learn software engineering with our coding bootcamp online, with the help of passionate instructors and a heartful community of mentors." />
            </Helmet>
            <Header />
            {
                loading ?
                    <PageLoader />
                    :
                    <>
                        {/* section 1 */}
                        <section className='landingPageTopContainer py-5'>
                            <div className='pb-5 my-5'>
                                <div className='container mentorLandingPageTop'>
                                    <div className='row' >
                                        {/* left */}
                                        <div className='mentorLandingPageBannerLeft col-12 col-lg-6 '>
                                            <div className='mentorLandingPageBannerLeftContainer'>
                                                <div className='mentorLandingPageBannerLeftHeading '>
                                                    <h1 >Start your journey into tech with <span>top rated</span>  and <span>most affordable</span>  coding boot camp</h1>
                                                </div>
                                                <div className='mentorLandingPageBannerLeftPara '>
                                                    <p className="py-lg-3 py-0">Learn software engineering with our coding bootcamp online, with the help of passionate instructors and a heartful community of mentors.</p>
                                                </div>
                                                <div className=''>
                                                    <button className="btn btn_get_started view_bootcamps_btn">
                                                        <a style={{ textDecoration: "none", color: "white" }} href="#bootcamps">View bootcamps</a> </button>
                                                </div>
                                            </div>
                                        </div>
                                        {/* right */}
                                        <div className='mentorLandingPageBannerRight col-12 col-lg-6 mt-5 pt-5 pt-lg-0 mt-lg-0'>
                                            <div className='bootcamp_group_img position-relative'>
                                                <img className='position-absolute face1' src={face1} alt='' />
                                                <img className='position-absolute face2' src={face2} alt='' />
                                                <img className='position-absolute face3' src={face3} alt='' />
                                                <img className='position-absolute face4' src={face4} alt='' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className='bg-theme-color py-5 mb-5'>
                            <div className="row container mx-auto my-5">
                                <div className="col-12 col-lg-4">
                                    <div>
                                        <div className='features_img text-center'>
                                            <img src={img1} alt="" />
                                        </div>
                                        <h4 className='py-4 text-white fw-bold text-center'>Affordable</h4>
                                        <p className='text-white  line-height-1 fs-6 text-center'>Priced as low as 100 INR/month with financing options available so you can learn with zero risk.</p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4 features_img_mid">
                                    <div>
                                        <div className='features_img text-center '>
                                            <img src={img2} alt="" />
                                        </div>
                                        <h4 className='py-4 text-white fw-bold text-center'>Local</h4>
                                        <p className='text-white  line-height-1 fs-6 text-center'>Skip the commute and join others from any city with online live bootcamps.</p>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-4">
                                    <div>
                                        <div className='features_img text-center'>
                                            <img src={img3} alt="" />
                                        </div>
                                        <h4 className='py-4 text-white fw-bold text-center'>Flexible</h4>
                                        <p className='text-white  line-height-1 fs-6 text-center'>Fits into your normal life with part-time and weekend classes that adapt to your schedule.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* package cards */}
                        <section id="bootcamps">
                            <div className="container py-5 my-5">
                                <div className="row pb-3">
                                    <div className="col-12">
                                        <div className='ourServicesHeading'>
                                            <h1 className="text-start text-md-center px-2"><span>Participate in </span> bootcamps at best prices.</h1>
                                        </div>
                                    </div>
                                </div>
                                {
                                    bootampError ?
                                        bootampError :
                                        <>
                                            <div className="customSlick mt-4">
                                                <Slider {...bootcamps_slider_settings} ref={bootcampCardsSliderRef}>
                                                    {
                                                        bootcampData.map((item, index) => {
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
                                                            return <div className="   h-100 pe-2" key={index} >
                                                                <div className='ms-4 pb-4 d-flex flex-column landingPageCards custom_box_shadow align-items-stretch justify-content-between h-100  ' style={{ maxWidth: "320px" }}>
                                                                    {/* card header */}
                                                                    <div className="px-2 pb-5 pt-3" style={{ backgroundImage: `linear-gradient(120deg,${colorArrary[index % colorArrary.length]})` }}>
                                                                        <h4 className=" fw-bold fs-5 text-white my-0 flexible  h-100" style={{ minHeight: "3em", }}>{title}</h4>
                                                                        <h6 className=" fs-6 text-white my-0 " >{shortTitle} </h6>
                                                                    </div>
                                                                    {/* card body */}
                                                                    <div className='position-relative card_ribbon'>
                                                                        <img className='' src={ribbon} alt='' style={{ filter: hueArray[index % hueArray.length] }} />
                                                                        <h5 className='text-white'>{labelvalue}</h5>
                                                                    </div>
                                                                    <div className="d-flex justify-content-center mt-5">
                                                                        <img className='card-img-top' src={image} style={{ width: "100px" }} alt="" />
                                                                    </div>
                                                                    <div className="h-100">
                                                                        <p className='py-4 px-3 '>{description}</p>
                                                                    </div>

                                                                    <div className="d-flex justify-content-center">
                                                                        <button onClick={() => history.push(`/services/bootcamp/${name}`)} className="bootcamp_card_btn" style={{ backgroundImage: `linear-gradient(120deg,${colorArrary[index % colorArrary.length]})` }}>View Bootcamp Details</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        })}
                                                </Slider>
                                            </div>
                                            <div className='d-flex justify-content-center gap-5  mt-2 slider_arrows' >
                                                <div onClick={() => gotoPrev(bootcampCardsSliderRef)} className='position-relative' >
                                                    <img className='cursor-pointer me-5 slider_arrows_left_img' src={right_arrow} alt="prev_arrow" style={{ width: "20px", transform: "scale(-1,1)" }} />
                                                </div>
                                                <div onClick={() => gotoNext(bootcampCardsSliderRef)} className='position-relative'>
                                                    <img className='cursor-pointer ms-5 slider_arrows_right_img' src={right_arrow} alt="next_arrow" style={{ width: "20px" }} />
                                                </div>
                                            </div>
                                        </>
                                }

                            </div>
                        </section>

                        {/* grids */}
                        <section className="mb-5">
                            <div className="container mx-auto">
                                <div className="row">
                                    <div className="col-12">
                                        <div className='ourServicesHeading'>
                                            <h1 className="text-start text-md-center px-2"><span>Every thing you need </span> to succeed.</h1>
                                        </div>
                                        <p className='py-4 fs-5'>Get the best blend of online learning, in-className support, and affordability to make it easy to start today and finish strong.</p>
                                    </div>
                                    <div className="row features_grid">
                                        <div className="col-12 col-md-4 col-lg-4 text-center border-bottom ">
                                            <div className=' p-3'>

                                                <div>
                                                    <img src={img8} alt="" />
                                                </div>
                                                <h6 className='py-3'>Instructor-led experience</h6>
                                                <p>You're not alone. Each bootcamp is limited to a maximum of 12 students and a dedicated instructor who is available daily to help you succeed.</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 col-lg-4 text-center inline_border border-bottom">
                                            <div className='  border-md-none p-3 central_box'>

                                                <div>
                                                    <img src={img9} alt="" />
                                                </div>
                                                <h6 className='py-3 '>Unique Classroom Experience</h6>
                                                <p>Workshops meet in a network of convenient, comfortable cafes and co-working locations, a significant cost-savings we pass on to you.</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 col-lg-4 text-center border-bottom">
                                            <div className='  border-md-none p-3'>

                                                <div>
                                                    <img src={img10} alt="" />
                                                </div>
                                                <h6 className='py-3'>Weekly In-Person Workshops</h6>
                                                <p>Stay on track with collaborative, in-person, 4-hour workshops with the instructor and up to 12 students as you work through course projects.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row row features_grid">
                                        <div className="col-12 col-md-4 col-lg-4 text-center block_end_border">
                                            <div className='  border-md-none p-3'>

                                                <div>
                                                    <img src={img11} alt="" />
                                                </div>
                                                <h6 className='py-3'>Proven Courses &#38; Curriculum</h6>
                                                <p>Build confidence knowing course content was designed by former Microsoft Learning experts based on open-source content from renowned professors.</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 col-lg-4 text-center inline_border block_end_border">
                                            <div className='  border-md-none p-3 below_central_box'>

                                                <div>
                                                    <img src={img12} alt="" />
                                                </div>
                                                <h6 className='py-3'>Start Building Your Coding Portfolio</h6>
                                                <p>Learn better by doing. In addition to the weekly assignments, you will be working on your own coding project you can add to your portfolio.</p>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-4 col-lg-4 text-center block_end_border">
                                            <div className='  border-md-none p-3'>

                                                <div>
                                                    <img src={img13} alt="" />
                                                </div>
                                                <h6 className='py-3'>Career &#38; Job Placement Services</h6>
                                                <p>Get 1:1 career coaching, access to an exclusive job board and career development course, and hands-on help with your resume and LinkedIn recommendations.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* timeline chrono */}
                        <section className='mb-5'>
                            <div className="container">
                                <div className="row">
                                    <div className="col-12">
                                        <div className='ourServicesHeading'>
                                            <h1 className="text-start text-md-center px-2"><span style={{ wordBreak: "break-word" }}>The most comprehensive path </span> to a career in tech</h1>
                                        </div>
                                        <p className='py-4 fs-5'>The complete software engineering bootcamp path brings together everything <span className='fw-600'>TradeBuddy</span>  has to offer in the web development space.</p>
                                    </div>
                                </div>
                                <div className=" mx-auto">
                                    <div className="custom_box_shadow text-center">
                                        <div className=" ">
                                            <Chrono
                                                mode="VERTICAL"
                                                hideControls
                                                scrollable={{ scrollbar: true }}
                                                items={items}
                                            />

                                        </div>
                                    </div>
                                    {/* <div className="d-flex gap-5">
                            <div className='flex-column gap-4' >
                                <div className="career_timeline_img">
                                    <img src="https://www.nucamp.co/assets/imgs/bootcamps/beginner.svg" alt="" />
                                </div>
                                <div className='py-3'>
                                    <img src="" alt="" />
                                </div>
                                <h6>Web Development Fundamentals</h6>
                            </div>
                            <div className='flex-column gap-4' >
                                <div className="career_timeline_img">
                                    <img src="https://www.nucamp.co/assets/imgs/bootcamps/backend.svg" alt="" />
                                </div>
                                <div className='py-3'>
                                    <img src="" alt="" />
                                </div>
                                <h6>Back End, SQL, and DevOps with Python</h6>
                            </div>
                            <div className='flex-column gap-4' >
                                <div className="career_timeline_img">
                                    <img src="https://www.nucamp.co/assets/imgs/bootcamps/advanced.svg" alt="" />
                                </div>
                                <div className='py-3'>
                                    <img src="" alt="" />
                                </div>
                                <h6>Full Stack Web + Mobile Development</h6>
                            </div>
                            <div className='flex-column gap-4' >
                                <div className="career_timeline_img">
                                    <img src="https://www.nucamp.co/assets/imgs/bootcamps/careerservices.svg" alt="" />
                                </div>
                                <div className='py-3'>
                                    <img src="" alt="" />
                                </div>
                                <h6>Job Hunting Bootcamp + Career Services</h6>
                            </div>
                        </div> */}
                                </div>
                            </div>

                        </section>
                        <Footer />
                    </>
            }
        </div>
    )
}
